import { Model, Types } from "mongoose";
import { FilterDto } from "../../common/dtos/query.dto";
import { ScheduleResponseDto } from "./schedule.dto";

interface Schedule {
  serviceId: Types.ObjectId;
  scheduleDate: Date;
  startTime: Date;
  endTime: Date;
  status: string;
  capacity: number;
  quota: number;
  registrants: number;
}

interface ScheduleModel extends Model<Schedule> {
  findAll(query: FilterDto): Promise<ScheduleResponseDto["findAll"][]>;
}

export type { Schedule, ScheduleModel };
