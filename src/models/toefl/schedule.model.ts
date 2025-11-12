import mongoose from "mongoose";
import { IServiceSchedule } from "../../interfaces/toefl.interface";
import { scheduleSchema } from "../../schemas/toefl.schema";

export const ScheduleModel = mongoose.model<IServiceSchedule>(
  "schedules",
  scheduleSchema,
);
