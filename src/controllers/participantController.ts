import { Response } from "express";
import { PesertaModel } from "../models/user.model";
import { IReqUser } from "../utils/interfaces";
import schema from "../utils/schemas";
import { generateHash } from "../utils/hashes";

type TToeflRecord = {
  nim: string;
  major: string;
  dateTest: Date;
  sessionTest: number;
  listening: number;
  reading: number;
  writing: number;
};

export default {
  async getAllPeserta(req: IReqUser, res: Response) {
    try {
      const result = await PesertaModel.getAllPeserta();
      res.status(200).json({
        message: "data successfully received",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "an error occurred while retrieving data",
        data: null,
      });
    }
  },
  async getComplete(req: IReqUser, res: Response) {
    try {
      const result = await PesertaModel.getPesertaByActivated(true);
      res.status(200).json({
        message: "data successfully received",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "an error occurred while retrieving data",
        data: null,
      });
    }
  },
  async getPending(req: IReqUser, res: Response) {
    try {
      const pesertaNotActivated = await PesertaModel.getPesertaByActivated(
        false
      );

      res.status(200).json({
        message: "data successfully received",
        data: pesertaNotActivated,
      });
    } catch (error) {
      res.status(500).json({
        message: "an error occurred while retrieving data",
        data: null,
      });
    }
  },
  async create(req: IReqUser, res: Response) {
    try {
      const { address } = req.params;
      const { nim, major, dateTest, sessionTest, listening, reading, writing } =
        req.body as unknown as TToeflRecord;

      const peserta = await PesertaModel.findOne({ address }).lean();
      if (!peserta) {
        return res.status(404).json({
          message: "peserta not found",
          data: null,
        });
      }

      const data = {
        address: peserta.address,
        fullName: peserta.fullName,
        email: peserta.email,
        nim,
        major,
        dateTest,
        sessionTest,
        listening,
        reading,
        writing,
      };

      // validasi inputan
      const validasiData = await schema.input.validate(data);

      // hashing inputan
      const hashCode = generateHash(validasiData);

      // save hash -> db peserta
      await PesertaModel.findOneAndUpdate(
        { address },
        {
          $set: { hashToefl: hashCode, isActivated: true },
        }
      );

      const result = {
        Peserta: validasiData,
        hashToefl: hashCode,
      };

      return res.status(201).json({
        message: "added successfully",
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
