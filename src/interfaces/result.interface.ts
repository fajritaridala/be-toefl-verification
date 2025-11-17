import { ObjectId, Types } from "mongoose";
import { IRegistrants } from "./schedule.interface";

interface HistoryResult {
  service: string;
  date: string;
  status: string;
}

interface ScheduleResult {
  _id: ObjectId;
  service_name: string;
  schedule_date: Date;
  quota: number;
  is_full: boolean;
  registrants?: IRegistrants[];
}

interface ScheduleRegisterItem {
  _id: ObjectId;
  schedule_date: Date;
  quota: number;
  registrants: number;
  is_full: boolean;
}

interface ScheduleRegisterResult {
  month: string;
  schedules: ScheduleRegisterItem[];
}

interface AllParticipantsResult {
  register_date: Date;
  payment_receipt: string;
  payment_date: Date;
  status: string;
  fullName: string;
  gender: string;
  birth_date: Date;
  phone_number: string;
  NIM: string;
  faculty: string;
  major: string;
  approved?: {
    admin_id: Types.ObjectId;
    date: Date;
  };
}

export {
  HistoryResult,
  ScheduleResult,
  ScheduleRegisterItem,
  ScheduleRegisterResult,
  AllParticipantsResult,
};
