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
    const { data, pagination } = await EnrollmentModel.findAll(options);
    const result = data.map((item) => ({
      enrollId: item.enrollId,
      scheduleId: item.scheduleId,
      participantId: item.participantId,
      scheduleDate: item.scheduleDate,
      registerAt: item.registerAt,
      paymentDate: item.paymentDate,
      paymentProof: item.paymentProof,
      status: item.status,
      fullName: item.fullName,
      gender: item.gender,
      birthDate: item.birthDate,
      email: item.email,
      phoneNumber: item.phoneNumber,
      nim: item.nim,
      faculty: item.faculty,
      major: item.major,
    }));

    return { result, pagination };
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
    const { certificate, address } = participant;
    console.log(certificate);

    const score = toeflConverter(options.body);

    const data: EnrollPinataJson = {
      serviceName: certificate.serviceName,
      fullName: certificate.fullName,
      gender: certificate.gender,
      birthDate: certificate.birthDate,
      email: certificate.email,
      phoneNumber: certificate.phoneNumber,
      nim: certificate.nim,
      faculty: certificate.faculty,
      major: certificate.major,
      listening: score.listening,
      reading: score.reading,
      structure: score.structure,
      totalScore: score.totalScore,
    };

    const fileName: string = `${data.nim}-${data.fullName.split(" ")[1].toLowerCase()}.json`;

    // const { cid } = await uploader.pinata.json(data, fileName);
    const { cid } = await uploader.pinata.json(data, fileName);
    const hash = `0x${generateHash({ cid, address })}`;

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
};

export default enrollmentService;
