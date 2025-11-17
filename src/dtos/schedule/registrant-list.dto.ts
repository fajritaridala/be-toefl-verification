import { PaginationQueryDto } from "../common/pagination.dto";
import { ScoreOutputDto } from "./score-input.dto";

export interface RegistrantListQueryDto extends PaginationQueryDto {
  status?: string;
  search?: string;
  sort?: "newest" | "oldest";
}

export interface RegistrantItemDto {
  id: string;
  scheduleId: string;
  serviceName: string;
  scheduleDate: string;
  registrationDate: string;
  status: string;
  paymentReceipt: string;
  paymentDate: string;
  participantId: string;
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
