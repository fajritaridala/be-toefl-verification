import mongoose, { ClientSession } from "mongoose";
import { QueryDto } from "../../common/dtos/query.dto";
import { ENROLLED_STATUS } from "../../common/utils/constants";
import generateHash from "../../common/utils/hashing";
import toeflConverter from "../../common/utils/toeflConverter";
import uploader from "../../common/utils/uploader";
import ScheduleModel from "../schedule/models/schedule.model";
import {
  ApprovalEnrollOptionsDto,
  BlockchainOptionsDto,
  FindAllEnrollOptionsDto,
  FindAllEnrollQueryDto,
  GetHashUserDto,
  GetScheduleEnrollOptionsDto,
  RegisterEnrollOptionsDto,
  RegisterEnrollParamsDto,
  SubmitEnrollOptionsDto,
} from "./dtos/enrollment.req.dto";
import { EnrollPinataJson } from "./enrollment.interface";
import EnrollmentModel from "./model/enrollment.model";

const enrollmentService = {
  register: async (options: RegisterEnrollOptionsDto) => {
    // preparing
    let session: ClientSession | null = null;
    let imagePublicId: string | null = null;

    if (!options.file) throw new Error("file wajib ada");
    const image = await uploader.cloudinary.uploadFile(
      options.file,
      options.body.fullName,
    );
    imagePublicId = image.public_id;

    const { paymentDate, ...data } = options.body;
    const registrant = {
      candidate: data,
      paymentDate,
      scheduleId: new mongoose.Types.ObjectId(options.params.scheduleId),
      participantId: new mongoose.Types.ObjectId(options.user.participantId),
      paymentId: image.public_id,
      paymentProof: image.secure_url,
    };

    // database processing
    session = await mongoose.startSession();
    session.startTransaction();

    try {
      // tambah jumlah pendaftar di collection schedules
      const schedule = await ScheduleModel.findOneAndUpdate(
        {
          _id: options.params.scheduleId,
          quota: { $gte: 0 },
        },
        {
          $inc: { quota: -1, registrants: 1 },
        },
        { session, new: true },
      );
      if (!schedule) throw new Error("jadwal penuh");

      // simpan data pendaftar ke colecction enrollments
      const save = await EnrollmentModel.create(registrant);
      await session.commitTransaction();

      const { __v, updatedAt, ...result } = save.toObject();
      return result;
    } catch (error) {
      if (imagePublicId) {
        console.warn([`[Rollback] menghapus gambar sampah: ${imagePublicId}`]);
        await uploader.cloudinary.remove(imagePublicId);
      }
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
  findAll: async (query: FindAllEnrollQueryDto) => {
    const skip = (query.page - 1) * query.limit;
    const options: FindAllEnrollOptionsDto = {
      skip,
      limit: query.limit,
    };
    if (query.status) {
      options.status = query.status;
    }
    if (query.search) {
      options.search = query.search;
    }
    const data = await EnrollmentModel.findAll(options);
    return data;
  },
  getScheduleParticipants: async (
    query: QueryDto,
    params: RegisterEnrollParamsDto,
  ) => {
    const skip = (query.page - 1) * query.limit;
    const options: GetScheduleEnrollOptionsDto = {
      skip,
      limit: query.limit,
      scheduleId: params.scheduleId,
    };
    if (query.search) {
      options.search = query.search;
    }
    const data = await EnrollmentModel.getScheduleParticipants(options);
    return data;
  },
  approval: async (options: ApprovalEnrollOptionsDto) => {
    if (
      ![ENROLLED_STATUS.APPROVED, ENROLLED_STATUS.REJECTED].includes(
        options.body.status,
      )
    ) {
      throw new Error("Invalid status");
    }
    const data = await EnrollmentModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(options.params.enrollId),
        status: ENROLLED_STATUS.PENDING,
      },
      { status: options.body.status },
    );
    if (data.matchedCount === 0)
      throw new Error(
        `Gagal: data tidak ditemukan atau peserta telah diproses sebelumnya`,
      );

    return { data, message: `peserta telah ${options.body.status}` };
  },
  submitScore: async (options: SubmitEnrollOptionsDto) => {
    const participant = await EnrollmentModel.findParticipant({
      participantId: options.params.participantId,
      enrollId: options.params.enrollId,
    });
    if (!participant) throw new Error("Peserta tidak ditemukan");
    const { user, address } = participant;

    const { totalScore, listening, structure, reading } = toeflConverter(
      options.body,
    );

    const data: EnrollPinataJson = {
      fullName: user.fullName,
      gender: user.gender,
      email: user.email,
      phoneNumber: user.phoneNumber,
      nim: user.nim,
      faculty: user.faculty,
      major: user.major,
      listening,
      structure,
      reading,
      totalScore,
    };

    const fileName: string = `${data.nim}-${data.fullName.split(" ")[1].toLowerCase()}.json`;

    // const { cid } = await uploader.pinata.json(data, fileName);
    const cid = "bafybeig44clrhah3cthmwsi23xi3mveuiv6lzn5xaioxzufnkgcopsia6u";
    const hash = `0x${generateHash({ cid, address })}`;

    // await EnrollmentModel.findOneAndUpdate(
    //   {
    //     participantId: new mongoose.Types.ObjectId(
    //       options.params.participantId,
    //     ),
    //   },
    //   {
    //     $set: {
    //       hash,
    //     },
    //   },
    //   {
    //     new: true,
    //   },
    // );

    return {
      cid,
      hash,
      participantId: options.params.participantId,
      enrollId: options.params.enrollId,
    };
  },
  blockchainSuccess: async (options: BlockchainOptionsDto) => {
    const hash = options.body.hash;
    const participantId = options.params.participantId;
    const result = await EnrollmentModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(options.params.enrollId),
        participantId: new mongoose.Types.ObjectId(participantId),
      },
      {
        $set: {
          hash,
          status: ENROLLED_STATUS.FINISHED,
        },
      },
      {
        new: true,
      },
    );
    return result;
  },
  getHash: async (user: GetHashUserDto) => {
    const data = await EnrollmentModel.findOne({ participantId: user });
    if (!data) throw new Error("Peserta tidak ditemukan");
    const hash = data?.hash;
    return { hash };
  },
};

export default enrollmentService;
