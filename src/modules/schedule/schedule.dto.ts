import { Types } from "mongoose";
import * as yup from "yup";
import { FilterDto } from "../../common/dtos/query.dto";
import { PaginationResponse } from "../../common/utils/response";
import { UserToken } from "../auth/auth.interface";

const scheduleParamsSchema = yup.object().shape({
  scheduleId: yup.string().required(),
});

const createScheduleSchema = yup.object().shape({
  scheduleDate: yup.string().required(),
  startTime: yup.string().required(),
  endTime: yup.string().required(),
  capacity: yup.number().optional(),
});
const updateScheduleSchema = createScheduleSchema.partial();

// request
type CreateScheduleDto = yup.InferType<typeof createScheduleSchema> & {
  quota?: number;
};
type UpdateScheduleDto = yup.InferType<typeof updateScheduleSchema>;
type ScheduleParamsDto = yup.InferType<typeof scheduleParamsSchema>;
type ScheduleOptionsDto = FilterDto & { user?: UserToken };

// response
interface ScheduleResponseDto {
  findAll: {
    data: {
      scheduleId: Types.ObjectId | string;
      serviceId: Types.ObjectId | string;
      serviceName: string;
      scheduleDate: Date | string;
      startTime: Date | string;
      endTime: Date | string;
      status: string;
      capacity: number;
      quota: number;
      registrants: number;
    };
    pagination: PaginationResponse;
  };
}

export { createScheduleSchema, scheduleParamsSchema, updateScheduleSchema };
export type {
  CreateScheduleDto,
  ScheduleOptionsDto,
  ScheduleParamsDto,
  ScheduleResponseDto,
  UpdateScheduleDto,
};
