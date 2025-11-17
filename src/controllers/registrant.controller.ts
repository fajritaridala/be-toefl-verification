import { Response } from "express";
import { IReqUser } from "../interfaces/auth.interface";
import { registrantService } from "../services";
import response from "../utils/response";
import { scheduleValidation } from "../validates/schedule.validate";

const registrantController = {
  async listRegistrants(req: IReqUser, res: Response) {
    try {
      const { page, limit, status, search, sort } =
        await scheduleValidation.registrants.validate(req.query);

      const result = await registrantService.getRegistrants({
        page,
        limit,
        status,
        search,
        sort,
      });

      response.pagination({
        res,
        data: result.data,
        pagination: {
          current: result.meta.page,
          totalPages: result.meta.totalPages,
          total: result.meta.total,
        },
        message: "Pendaftar berhasil ditemukan",
      });
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
};

export default registrantController;
