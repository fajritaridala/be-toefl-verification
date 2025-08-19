import { Request,Response } from "express";
import { PesertaModel } from "../models/user.model";
import { TOverview } from "../utils/types";

export default {
  async Overview(req: Request, res: Response) {
    try {
      const result: TOverview = await PesertaModel.getOverview();
      res.status(200).json({
        message: "Dashboard data retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while retrieving dashboard data",
        data: null,
      });
    }
  },
};
