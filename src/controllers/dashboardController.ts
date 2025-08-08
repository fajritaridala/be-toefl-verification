import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { ROLES } from "../utils/contant";

export default {
  async getUnprocessParticipants(req: Request, res: Response) {
    try {
      const unprocessParticipants = await UserModel.find({
        role: ROLES.PESERTA,
        isActivated: false,
      })
        .select("fullName email address createdAt")
        .sort({ createdAt: -1 })
        .limit(10);

      res.status(200).json({
        message: "Unprocessed participants retrieved successfully",
        data: unprocessParticipants,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while retrieving unprocessed participants",
        data: null,
      });
    }
  },

  async getData(req: Request, res: Response) {
    try {
      // Get summary data
      const participants = await UserModel.countDocuments({
        role: ROLES.PESERTA,
      });
      const isActivated = await UserModel.countDocuments({
        role: ROLES.PESERTA,
        isActivated: true,
      });
      const notActivated = await UserModel.countDocuments({
        role: ROLES.PESERTA,
        isActivated: false,
      });

      // Get latest unprocessed participants
      const unprocessParticipants = await UserModel.find({
        role: ROLES.PESERTA,
        isActivated: false,
      })
        .select("fullName email address createdAt")
        .sort({ createdAt: -1 })
        .limit(10);

      const result = {
        summary: {
          totalParticipants: participants,
          processedParticipants: isActivated,
          unprocessParticipants: notActivated,
        },
        latestUnprocess: unprocessParticipants,
      };

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
