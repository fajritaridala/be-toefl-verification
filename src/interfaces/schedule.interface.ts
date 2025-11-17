import { Model, Types } from "mongoose";
import {
  AllParticipantsResult,
  HistoryResult,
  ScheduleRegisterResult,
  ScheduleResult,
} from "./result.interface";

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

interface IScheduleStatics extends Model<ISchedule> {
  getParticipantHistory(participant_id: string): Promise<HistoryResult>;
  getSchedule(options?: ScheduleQueryOptions): Promise<ScheduleResult[]>;
  getScheduleRegister(
    options?: ScheduleQueryOptions,
  ): Promise<ScheduleRegisterResult[]>;
  getAllParticipants(schedule_id: string): Promise<AllParticipantsResult[]>;
}

export { ISchedule, IScheduleStatics, IRegistrants, ScheduleQueryOptions };
