import { Response } from "express";
import { PesertaModel } from "../models/user.model";
import { IReqUser } from "../utils/interfaces";

export default {
  async getAll(req: IReqUser, res: Response) {
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
  async getProcessed(req: IReqUser, res: Response) {
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
  async getUnprocessed(req: IReqUser, res: Response) {
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
};
