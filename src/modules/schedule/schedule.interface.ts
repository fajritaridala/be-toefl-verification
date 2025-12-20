import { Model, Types } from "mongoose";
import { OptionsDto } from "../../common/dtos/query.dto";
import { PublicScheduleDto, ScheduleResponseDto } from "./schedule.dto";

interface Schedule {
  serviceId: Types.ObjectId;
  scheduleDate: Date;
  startTime: Date;
  endTime: Date;
  status: string;
  capacity: number;
  quota: number;
  registrants: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface ScheduleModel extends Model<Schedule> {
  findAll(query: OptionsDto): Promise<ScheduleResponseDto["findAll"]>;
  findAllPublic(options: {
    serviceId: string;
    minDate: Date;
  }): Promise<PublicScheduleDto[]>;
}

export type { Schedule, ScheduleModel };
