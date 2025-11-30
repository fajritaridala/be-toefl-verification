import { Types } from "mongoose";
import { PaginationDto } from "../../../common/dtos/query.dto";
import { RegisterEnrollDto } from "./enrollment.req.dto";

interface FindAllEnrollResponseDto {
  data: RegisterEnrollDto & {
    paymentProof: string;
    status: string;
    scheduleId: Types.ObjectId | string;
    scheduleDate: Date;
    registerAt: Date;
  };
  pagination: PaginationDto;
}

interface GetScheduleEnrollResponseDto {
  data: Omit<FindAllEnrollResponseDto["data"], "scheduleId" | "scheduleDate">;
  pagination: PaginationDto;
}

interface FindParticipantResponseDto {
  user: Omit<RegisterEnrollDto, "paymentDate">;
  address: string;
}

export type {
  FindAllEnrollResponseDto,
  FindParticipantResponseDto,
  GetScheduleEnrollResponseDto,
};
