import mongoose from "mongoose";
import { IService, IServiceSchedule } from "../interfaces/toefl.interface";

const Schema = mongoose.Schema;

// service
const serviceSchema = new Schema<IService>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    price: {
      type: Schema.Types.Number,
      required: true,
    },
    duration: {
      type: Schema.Types.Number,
      required: true,
    },
    notes: {
      type: Schema.Types.String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const scheduleSchema = new Schema<IServiceSchedule>(
  {
    service_id: {
      type: Schema.Types.ObjectId,
      ref: "services",
      required: true,
    },
    schedule_date: {
      type: Schema.Types.Date,
      required: true,
    },
    quota: {
      type: Schema.Types.Number,
      default: 100,
    },
    registrants: {
      default: [],
      type: [
        {
          peserta_id: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
          },
          payment_receipt: {
            type: Schema.Types.String,
            required: true,
          },
          payment_date: {
            type: Schema.Types.Date,
            required: true,
          },
          status: {
            type: Schema.Types.String,
            required: true,
          },
          approved: {
            required: false,
            type: {
              by: {
                type: Schema.Types.ObjectId,
                ref: "users",
              },
              date: {
                type: Schema.Types.Date,
              },
            },
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

export { serviceSchema, scheduleSchema };
