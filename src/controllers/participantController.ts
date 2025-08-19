import { Request, Response } from "express";
import { PesertaModel } from "../models/user.model";

export default {
  async getAllParticipants(req: Request, res: Response) {
    try {
      const result = await PesertaModel.getAllParticipant();
      res.status(200).json({
        message: "Participants retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while retrieving participants",
        data: null,
      });
    }
  },
  async getProcessed(req: Request, res: Response) {
    try {
      const result = await PesertaModel.getProcessedParticipant();
      res.status(200).json({
        message: "Processed participants retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while retrieving processed participants",
        data: null,
      });
    }
  },

  // Get peserta yang belum aktif
  async getUnprocessed(req: Request, res: Response) {
    try {
      const pesertaNotActivated =
        await PesertaModel.getUnprocessedParticipants();

      res.status(200).json({
        message: "Unprocessed participants retrieved successfully",
        data: pesertaNotActivated,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while retrieving unprocessed participants",
        data: null,
      });
    }
  },
};
