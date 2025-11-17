import { Model, Types } from "mongoose";
import {
  AllParticipantsResult,
  HistoryResult,
  ScheduleRegistrantResult,
  ScheduleRegisterResult,
  ScheduleResult,
} from "./result.interface";

interface IRegistrantScore {
  listening: number;
  reading: number;
  writing: number;
  total: number;
}

interface IRegistrants {
  register_date: Date;
  payment_receipt: string;
  payment_date: Date;
  participant_id: Types.ObjectId;
  status?: string;
  approved?: {
    admin_id: Types.ObjectId;
    date: Date;
  };
  scores?: IRegistrantScore;
  cid_certificate?: string;
}

interface ISchedule {
  schedule_date: Date;
  quota?: number;
  service_id: Types.ObjectId;
  registrants?: IRegistrants[];
  is_full?: boolean;
}

interface ScheduleQueryOptions {
  service_id?: Types.ObjectId | undefined;
  search?: string;
  skip?: number;
  limit?: number;
  status?: string;
}

interface ScheduleRegistrantsQueryOptions {
  skip: number;
  limit: number;
  status?: string;
  search?: string;
}

interface IScheduleStatics extends Model<ISchedule> {
  getParticipantHistory(participant_id: string): Promise<HistoryResult[]>;
  getSchedule(options?: ScheduleQueryOptions): Promise<ScheduleResult[]>;
  getScheduleRegister(
    options?: ScheduleQueryOptions,
  ): Promise<ScheduleRegisterResult[]>;
  getAllParticipants(schedule_id: string): Promise<AllParticipantsResult[]>;
  getRegistrants(
    options: ScheduleRegistrantsQueryOptions,
  ): Promise<ScheduleRegistrantResult[]>;
  setRegistrantScores(
    scheduleId: string,
    participantId: string,
    scores: IRegistrantScore,
  ): Promise<void>;
  setRegistrantCidCertificate(
    scheduleId: string,
    participantId: string,
    cid: string,
  ): Promise<void>;
  getRegistrantDetail(
    scheduleId: string,
    participantId: string,
  ): Promise<ScheduleRegistrantResult | null>;
}

export {
  ISchedule,
  IScheduleStatics,
  IRegistrants,
  IRegistrantScore,
  ScheduleQueryOptions,
  ScheduleRegistrantsQueryOptions,
};
