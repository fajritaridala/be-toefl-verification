import { Types } from "mongoose";
import * as yup from "yup";
import { FilterDto } from "../../common/dtos/query.dto";
import { PaginationResponse } from "../../common/utils/response";

const scheduleParamsSchema = yup.object().shape({
  scheduleId: yup.string().required(),
});

const serviceParamsSchema = yup.object().shape({
  serviceId: yup.string().required(),
});

const createScheduleSchema = yup.object().shape({
  scheduleDate: yup.string().required(),
  startTime: yup.string().required(),
  endTime: yup.string().required(),
  capacity: yup.number().optional(),
});
const updateScheduleSchema = createScheduleSchema.partial();

const scheduleAdminQuerySchema = yup.object().shape({
  includeDeleted: yup.boolean().optional().default(false),
});

// request
type CreateScheduleDto = yup.InferType<typeof createScheduleSchema> & {
  quota?: number;
};
type UpdateScheduleDto = yup.InferType<typeof updateScheduleSchema>;
type ScheduleParamsDto = yup.InferType<typeof scheduleParamsSchema>;
type ServiceParamsDto = yup.InferType<typeof serviceParamsSchema>;
type ScheduleAdminQueryDto = FilterDto &
  yup.InferType<typeof scheduleAdminQuerySchema>;

// response
interface ScheduleDataDto {
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
  deletedAt?: Date | null;
}

interface PublicScheduleDto {
  _id: Types.ObjectId | string;
  scheduleDate: Date | string;
  serviceName: string;
  quota: number;
  registrants: number;
  status: string;
}

interface ScheduleResponseDto {
  findAll: {
    data: ScheduleDataDto[];
    pagination: PaginationResponse;
  };
}

export {
  createScheduleSchema,
  scheduleParamsSchema,
  serviceParamsSchema,
  updateScheduleSchema,
  scheduleAdminQuerySchema,
};
export type {
  CreateScheduleDto,
  PublicScheduleDto,
  ScheduleAdminQueryDto,
  ScheduleParamsDto,
  ScheduleResponseDto,
  ServiceParamsDto,
  UpdateScheduleDto,
};
