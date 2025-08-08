import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { ROLES } from "../utils/contant";

export default {
  // Get seluruh peserta
  async getParticipants(req: Request, res: Response) {
    try {
      const participants = await UserModel.find({
        role: ROLES.PESERTA,
      })
        .select("fullName email address isActivated createdAt")
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "Participants retrieved successfully",
        data: participants,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while retrieving participants",
        data: null,
      });
    }
  },

  // Get peserta yang belum aktif
  async getUnprocessedParticipants(req: Request, res: Response) {
    try {
      const unprocessedParticipants = await UserModel.find({
        role: ROLES.PESERTA,
        isActivated: false,
      })
        .select("fullName email address createdAt")
        .sort({ createdAt: -1 })
        .limit(10);

      res.status(200).json({
        message: "Unprocessed participants retrieved successfully",
        data: unprocessedParticipants,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while retrieving unprocessed participants",
        data: null,
      });
    }
  },

  // Get dashboard data
  async getDashboard(req: Request, res: Response) {
    try {
      const totalParticipants = await UserModel.countDocuments({
        role: ROLES.PESERTA,
      });
      const processedParticipants = await UserModel.countDocuments({
        role: ROLES.PESERTA,
        isActivated: true,
      });
      const unprocessedParticipants = await UserModel.countDocuments({
        role: ROLES.PESERTA,
        isActivated: false,
      });

      const latestUnprocessed = await UserModel.find({
        role: ROLES.PESERTA,
        isActivated: false,
      })
        .select("fullName email address createdAt")
        .sort({ createdAt: -1 })
        .limit(10);

      const dashboardData = {
        statistics: {
          totalParticipants,
          processedParticipants,
          unprocessedParticipants,
        },
        latestUnprocessed,
      };

      res.status(200).json({
        message: "Dashboard data retrieved successfully",
        data: dashboardData,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while retrieving dashboard data",
        data: null,
      });
    }
  },
};
