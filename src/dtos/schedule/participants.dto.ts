import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../common/pagination.dto";
import { ScoreOutputDto } from "./score-input.dto";

export interface ScheduleParticipantsQueryDto extends PaginationQueryDto {
  status?: string;
  search?: string;
  sort?: "newest" | "oldest";
}

export interface ScheduleParticipantItemDto {
  id: string;
  scheduleId: string;
  participantId: string;
  serviceName: string;
  scheduleDate: string;
  registrationDate: string;
  status: string;
  paymentReceipt: string;
  paymentDate: string;
  fullName: string;
  gender?: string;
  birthDate?: string;
  phoneNumber?: string;
  nim?: string;
  faculty?: string;
  major?: string;
  approved?: {
    adminId?: string;
    date?: string;
  };
  scores?: ScoreOutputDto;
  cidCertificate?: string;
}

export type ScheduleParticipantsResponseDto =
  PaginatedResponseDto<ScheduleParticipantItemDto>;
