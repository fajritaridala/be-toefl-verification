import type { Response } from "express";
import { FilterDto, filterSchema } from "../../common/dtos/query.dto";
import response from "../../common/utils/response";
import { ReqUser } from "../auth/auth.dto";
import {
  type CreateScheduleDto,
  type ScheduleOptionsDto,
  type ScheduleParamsDto,
  type UpdateScheduleDto,
  createScheduleSchema,
  scheduleParamsSchema,
  updateScheduleSchema,
} from "./schedule.dto";
import scheduleService from "./schedule.service";

const scheduleController = {
  create: async (req: ReqUser, res: Response) => {
    const query: FilterDto = await filterSchema.validate(req.query);
    const body: CreateScheduleDto = await createScheduleSchema.validate(
      req.body,
    );
    const result = await scheduleService.create(query, body);
    return response.success(res, result, "jadwal berhasil dibuat");
  },
  findAll: async (req: ReqUser, res: Response) => {
    const query: FilterDto = await filterSchema.validate(req.query);
    const options: ScheduleOptionsDto = { ...query, user: req.user };
    const result = await scheduleService.findAll(options);
    return response.pagination({
      res,
      data: result.data,
      pagination: result.pagination,
      message: "jadwal berhasil ditemukan",
    });
  },
  update: async (req: ReqUser, res: Response) => {
    const params: ScheduleParamsDto = await scheduleParamsSchema.validate(
      req.params,
    );
    const body: UpdateScheduleDto = await updateScheduleSchema.validate(
      req.body,
    );
    const result = await scheduleService.update(params, body);
    return response.success(res, result, "jadwal berhasil diperbarui");
  },
  remove: async (req: ReqUser, res: Response) => {
    const params: ScheduleParamsDto = await scheduleParamsSchema.validate(
      req.params,
    );
    const result = await scheduleService.remove(params);
    return response.success(res, result, "jadwal berhasil dihapus");
  },
};

export default scheduleController;
