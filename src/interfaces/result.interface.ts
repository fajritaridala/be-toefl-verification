import { ObjectId, Types } from "mongoose";

interface HistoryResult {
  service_name: string;
  schedule_date: Date;
  status: string;
  cid_certificate?: string;
  scores?: {
    listening: number;
    reading: number;
    writing: number;
    total: number;
  };
}

interface ScheduleResult {
  data: any[];
  pagination: {
    current: number;
    total: number;
    totalPages: number;
  };
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

interface ScheduleRegistrantResult {
  schedule_id: ObjectId;
  service_name: string;
  schedule_date: Date;
  register_date: Date;
  payment_receipt: string;
  payment_date: Date;
  status: string;
  participant_id: ObjectId;
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
  scores?: {
    listening: number;
    reading: number;
    writing: number;
    total: number;
  };
  cid_certificate?: string;
}

export {
  HistoryResult,
  ScheduleResult,
  ScheduleRegisterItem,
  ScheduleRegisterResult,
  ScheduleRegistrantResult,
};
