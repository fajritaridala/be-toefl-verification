import mongoose from "mongoose";
import { STATUS } from "../../../common/utils/constants";
import type { Schedule, ScheduleModel } from "../schedule.interface";
import findAll from "./schedule.static";

const Schema = mongoose.Schema;

const ScheduleSchema = new Schema<Schedule, ScheduleModel>(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "services",
    },
    scheduleDate: {
      type: Schema.Types.Date,
      required: true,
      index: true,
    },
    startTime: {
      type: Schema.Types.Date,
      required: true,
    },
    endTime: {
      type: Schema.Types.Date,
      required: true,
    },
    capacity: {
      type: Schema.Types.Number,
    },
    quota: {
      type: Schema.Types.Number,
    },
    status: {
      type: Schema.Types.String,
      enum: [STATUS.ACTIVE, STATUS.INACTIVE],
      default: STATUS.ACTIVE,
    },
    registrants: {
      type: Schema.Types.Number,
      default: 0,
    },
  },
  {
    statics: {
      findAll,
    },
    timestamps: true,
  },
);

ScheduleSchema.index({ serviceId: 1, scheduleDate: 1 }, { unique: true });

const ScheduleModel = mongoose.model<Schedule, ScheduleModel>(
  "schedules",
  ScheduleSchema,
);

export default ScheduleModel;
