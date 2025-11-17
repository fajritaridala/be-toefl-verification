import mongoose from "mongoose";
import { IService, IServiceSchedule } from "../interfaces/toefl.interface";
import { REGISTER_STATUS } from "../utils/constants";

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
      _id: false,
      default: [],
      type: [
        {
          participant_id: {
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
            enum: REGISTER_STATUS,
            default: REGISTER_STATUS.PENDING,
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
    statics: {
      getParticipantHistory(participant_id: string) {
        const p_id = new mongoose.Types.ObjectId(participant_id);
        return this.aggregate([
          { $match: { "registrants.participant_id": p_id } },
          {
            $lookup: {
              from: "services",
              localField: "service_id",
              foreignField: "_id",
              as: "service_info",
            },
          },
          { $unwind: "$service_info" },
          {
            $project: {
              _id: 0,
              schedule_date: 1,
              service_name: "$service_info.name",
              registration: {
                $filter: {
                  input: "$registrants",
                  as: "reg",
                  cond: { $eq: ["$$reg.participant_id", p_id] },
                },
              },
            },
          },
          {
            $project: {
              service: "$service_name",
              date: "$schedule_date",
              status: { $arrayElemAt: ["$registration.status", 0] },
            },
          },
        ]);
      },
    },
  },
);

export { serviceSchema, scheduleSchema };
