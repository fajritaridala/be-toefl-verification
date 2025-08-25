import { Response } from "express";
import { PesertaModel } from "../models/user.model";
import { IReqUser } from "../utils/interfaces";

export default {
  async Overview(req: IReqUser, res: Response) {
    try {
      const result = await PesertaModel.getOverview();
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
};
