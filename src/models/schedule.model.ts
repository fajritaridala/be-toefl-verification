import mongoose from "mongoose";
import { ISchedule, IScheduleStatics } from "../interfaces/schedule.interface";
import scheduleSchema from "../schemas/schedule.schema";

export const ScheduleModel = mongoose.model<ISchedule, IScheduleStatics>(
  "schedules",
  scheduleSchema,
);
