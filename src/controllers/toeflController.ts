import { Response } from "express";
import moment from "moment";
import { ToeflModel } from "../models/toefl.model";
import { PesertaModel } from "../models/user.model";
import { STATUS } from "../utils/constant";
import date from "../utils/date";
import { generateHash } from "../utils/hashes";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import uploader from "../utils/uploader";
import { inputValidateSchema, toeflValidateSchema } from "../utils/validates";

type TRegister = {
  nama_lengkap: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  nomor_induk_mahasiswa: string;
  fakultas: string;
  program_studi: string;
  sesi_tes: string;
};

type TInput = {
  nilai_listening: number;
  nilai_structure: number;
  nilai_reading: number;
};

type TFile = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
};

export default {
  async findAll(req: IReqUser, res: Response) {
    const { page, limit, search } = req.query as unknown as IPaginationQuery;
    try {
      const query = {};
      if (search) {
        Object.assign(query, {
          $or: [
            { nama_lengkap: { $regex: search, $options: "i" } },
            // { nim: { $regex: search, $options: 'i' } },
          ],
        });
      }
      const result = await ToeflModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await ToeflModel.countDocuments(query);

      const pagination = {
        total: count,
        totalPages: Math.ceil(count / limit),
        current: page,
      };

      res.status(200).json({
        message: "data successfully received",
        data: result,
        pagination: pagination,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({
        message: err.message,
        data: null,
      });
    }
  },
  async register(req: IReqUser, res: Response) {
    try {
      const { address_peserta } = req.params;
      const {
        nama_lengkap,
        jenis_kelamin,
        tanggal_lahir,
        nomor_induk_mahasiswa,
        fakultas,
        program_studi,
        sesi_tes,
      } = req.body as unknown as TRegister;

      const result = {
        address_peserta,
        nama_lengkap,
        jenis_kelamin,
        tanggal_lahir,
        nomor_induk_mahasiswa,
        fakultas,
        program_studi,
        sesi_tes,
        tanggal_tes: moment().unix(),
        status: STATUS.BELUM_SELESAI,
      };

      await toeflValidateSchema.validate(result);

      const existingAddress = await ToeflModel.findOne({ address_peserta });
      const existingNIM = await ToeflModel.findOne({ nomor_induk_mahasiswa });
      if (existingAddress) throw new Error("address peserta telah terdaftar");
      if (existingNIM) throw new Error("NIM telah terdaftar");

      // ubah Date() ke string
      const tanggalTes = date.numberToString(result.tanggal_tes);

      // ubah string ke Date()
      const tanggalLahir = date.stringToNumber(result.tanggal_lahir);

      const sendToDb = {
        ...result,
        tanggal_tes: tanggalTes,
      };

      await ToeflModel.create(sendToDb);

      res.status(201).json({
        message: "toefl register successfully",
        data: {
          ...result,
          tanggal_lahir: tanggalLahir,
        },
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async input(req: IReqUser, res: Response) {
    try {
      const { address_peserta } = req.params;
      const { nilai_listening, nilai_structure, nilai_reading } =
        req.body as unknown as TInput;

      const peserta = await ToeflModel.findOne({ address_peserta });
      if (!peserta) {
        return res.status(404).json({
          message: "peserta not found",
          data: null,
        });
      }

      const nilai_total =
        300 + nilai_listening + nilai_structure + nilai_reading;

      const result = {
        address_peserta,
        nama_lengkap: peserta.nama_lengkap,
        jenis_kelamin: peserta.jenis_kelamin,
        tanggal_lahir: peserta.tanggal_lahir,
        nomor_induk_mahasiswa: peserta.nomor_induk_mahasiswa,
        fakultas: peserta.fakultas,
        program_studi: peserta.program_studi,
        sesi_tes: peserta.sesi_tes,
        tanggal_tes: peserta.tanggal_tes,
        nilai_listening,
        nilai_structure,
        nilai_reading,
        nilai_total,
      };

      await inputValidateSchema.validate(result);

      const hash = generateHash(result);
      const toefl_hash = "0x" + hash;

      await PesertaModel.findOneAndUpdate(
        { address: address_peserta },
        {
          $set: { toefl_hash },
        },
      );

      const tanggalLahir = date.stringToNumber(result.tanggal_lahir);
      const tanggalTes = date.stringToNumber(result.tanggal_tes);

      res.status(201).json({
        message: "success input data",
        data: {
          peserta: {
            ...result,
            tanggal_tes: tanggalTes,
            tanggal_lahir: tanggalLahir,
          },
          toefl_hash,
        },
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async uploadCertificate(req: IReqUser, res: Response) {
    if (!req.file) {
      res.status(400).json({
        message: "file not found",
        data: null,
      });
    }
    try {
      const { address_peserta } = req.params;
      const peserta = await ToeflModel.findOne({ address_peserta }).lean();
      if (!peserta) {
        res.status(404).json({
          message: "peserta not found",
          data: null,
        });
      }

      const upload = await uploader.uploadCertificate(
        req.file as Express.Multer.File,
      );
      const { cid, url, size } = upload;

      await ToeflModel.findOneAndUpdate(
        { address_peserta },
        {
          $set: { status: "selesai" },
        },
      );

      await PesertaModel.findOneAndUpdate(
        { address: address_peserta },
        { $set: { certificate: cid } },
      );

      const result = {
        cid,
        url,
        size,
      };

      res.status(201).json({
        message: "success upload certificate",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
