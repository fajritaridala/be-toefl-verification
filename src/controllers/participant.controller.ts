import { Response } from "express";
import { IReqUser } from "../interfaces/auth.interface";
import { registrantService } from "../services";
import response from "../utils/response";

const participantController = {
  async listParticipantHistory(req: IReqUser, res: Response) {
    try {
      const participantId = req.user?._id?.toString();

      if (!participantId) {
        return response.error(res, null, "Pengguna tidak valid");
      }

      const history =
        await registrantService.getParticipantHistory(participantId);

      response.success(res, history, "Riwayat pendaftaran berhasil ditemukan");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
};

export default participantController;
