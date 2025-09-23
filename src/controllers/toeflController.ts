import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import { inputValidateSchema, toeflValidateSchema } from "../utils/validates";
import { ToeflModel } from "../models/toefl.model";
import { PINATA, STATUS } from "../utils/constant";
import { generateHash } from "../utils/hashes";
import { PesertaModel } from "../models/user.model";
import uploader from "../utils/uploader";

type TRegister = {
  fullName: string;
  email: string;
  nim: string;
  major: string;
  sessionTest: string;
};

type TInput = {
  listening: number;
  swe: number;
  reading: number;
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
            { fullName: { $regex: search, $options: "i" } },
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
      const { address } = req.params;
      const { fullName, email, nim, major, sessionTest } =
        req.body as unknown as TRegister;

      const data = {
        address,
        fullName,
        email,
        nim,
        major,
        sessionTest,
        testDate: new Date(),
        status: STATUS.BELUM_SELESAI,
      };

      await toeflValidateSchema.validate(data);

      const existingAddress = await ToeflModel.findOne({ data });
      const existingEmail = await ToeflModel.findOne({ email });
      if (existingAddress) throw new Error("address already registered");
      if (existingEmail) throw new Error("email already register");

      const result = await ToeflModel.create(data);

      res.status(201).json({
        message: "toefl register successfully",
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
  async input(req: IReqUser, res: Response) {
    try {
      const { address } = req.params;
      const { listening, swe, reading } = req.body as unknown as TInput;

      const peserta = await ToeflModel.findOne({ address });
      if (!peserta) {
        return res.status(404).json({
          message: "peserta not found",
          data: null,
        });
      }

      const scoreTotal = listening + swe + reading;
      const data = {
        address,
        fullName: peserta.fullName,
        email: peserta.email,
        nim: peserta.nim,
        major: peserta.major,
        status: peserta.status,
        sessionTest: peserta.sessionTest,
        testDate: peserta.testDate,
        listening,
        swe,
        reading,
        scoreTotal,
      };

      await inputValidateSchema.validate(data);

      const hash = generateHash(data);

      await PesertaModel.findOneAndUpdate(
        { address },
        {
          $set: { hash },
        }
      );

      await ToeflModel.findOneAndUpdate(
        { address },
        {
          $set: { status: "selesai" },
        }
      );

      const updatedPeserta = await ToeflModel.findOne({ address });

      const result = {
        peserta: {
          ...data,
          status: updatedPeserta?.status,
        },
        hash,
      };

      res.status(201).json({
        message: "success input data",
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
  async uploadCertificate(req: IReqUser, res: Response) {
    if (!req.file) {
      res.status(400).json({
        message: "file not found",
        data: null,
      });
    }
    try {
      const { address } = req.params;
      const peserta = await ToeflModel.findOne({ address }).lean();
      if (!peserta) {
        res.status(404).json({
          message: "peserta not found",
          data: null,
        });
      }

      const upload = await uploader.uploadCertificate(
        req.file as Express.Multer.File
      );
      const { cid, url, size } = upload;

      await PesertaModel.findOneAndUpdate(
        { address },
        { $set: { certificate: cid } }
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
