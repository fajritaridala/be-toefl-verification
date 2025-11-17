import mongoose from "mongoose";
import type { PipelineStage, Types } from "mongoose";
import {
  ISchedule,
  IRegistrantScore,
  ScheduleQueryOptions,
  ScheduleRegistrantsQueryOptions,
} from "../interfaces/schedule.interface";
import { ScheduleRegistrantResult } from "../interfaces/result.interface";
import { REGISTER_STATUS } from "../utils/constants";

const Schema = mongoose.Schema;

const registrantScoreSchema = new Schema(
  {
    listening: {
      type: Schema.Types.Number,
      required: true,
    },
    reading: {
      type: Schema.Types.Number,
      required: true,
    },
    writing: {
      type: Schema.Types.Number,
      required: true,
    },
    total: {
      type: Schema.Types.Number,
      required: true,
    },
  },
  { _id: false },
);

const scheduleSchema = new Schema<ISchedule>(
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
          register_date: {
            type: Schema.Types.Date,
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
              admin_id: {
                type: Schema.Types.ObjectId,
                ref: "users",
              },
              date: {
                type: Schema.Types.Date,
              },
            },
          },
          scores: {
            required: false,
            type: registrantScoreSchema,
          },
          cid_certificate: {
            type: Schema.Types.String,
            required: false,
          },
        },
      ],
    },
    is_full: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    statics: {
      getParticipantHistory(participant_id: string) {
        if (!mongoose.Types.ObjectId.isValid(participant_id)) {
          throw new Error("Participant id tidak valid");
        }

        const participantObjectId = new mongoose.Types.ObjectId(participant_id);

        const pipeline: PipelineStage[] = [
          { $match: { "registrants.participant_id": participantObjectId } },
          { $unwind: "$registrants" },
          { $match: { "registrants.participant_id": participantObjectId } },
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
              service_name: "$service_info.name",
              schedule_date: "$schedule_date",
              status: "$registrants.status",
              cid_certificate: "$registrants.cid_certificate",
              scores: {
                listening: "$registrants.scores.listening",
                reading: "$registrants.scores.reading",
                writing: "$registrants.scores.writing",
                total: "$registrants.scores.total",
              },
            },
          },
          { $sort: { schedule_date: -1 } },
        ];

        return this.aggregate(pipeline).exec();
      },
      getSchedule(options: ScheduleQueryOptions = {}) {
        const { service_id, search, skip, limit } = options;
        const pipeline: PipelineStage[] = [];

        if (service_id) pipeline.push({ $match: { service_id: service_id } });
        pipeline.push(
          {
            $lookup: {
              from: "services",
              localField: "service_id",
              foreignField: "_id",
              as: "service_info",
            },
          },
          { $unwind: "$service_info" },
        );

        if (search) {
          pipeline.push(
            {
              $addFields: {
                schedule_date_text: {
                  $dateToString: {
                    date: "$schedule_date",
                    format: "%Y-%m-%d",
                  },
                },
              },
            },
            {
              $match: {
                $or: [
                  {
                    schedule_date_text: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  {
                    "service_info.name": {
                      $regex: search,
                      $options: "i",
                    },
                  },
                ],
              },
            },
          );
        }

        pipeline.push(
          { $sort: { schedule_date: 1 } },
          {
            $addFields: {
              registrants_count: {
                $size: { $ifNull: ["$registrants", []] },
              },
            },
          },
        );

        if (
          typeof skip === "number" &&
          typeof limit === "number" &&
          skip >= 0 &&
          limit > 0
        ) {
          pipeline.push({ $skip: skip });
          pipeline.push({ $limit: limit });
        }

        pipeline.push({
          $project: {
            _id: 1,
            service_name: "$service_info.name",
            service_price: "$service_info.price",
            schedule_date: 1,
            quota: { $ifNull: ["$quota", 0] },
            registrants: "$registrants_count",
            is_full: { $ifNull: ["$is_full", false] },
          },
        });

        return this.aggregate(pipeline).exec();
      },
      getScheduleRegister(options: ScheduleQueryOptions = {}) {
        const { service_id } = options;
        const now = new Date();
        const minDate = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
        );
        minDate.setUTCDate(minDate.getUTCDate() + 7);

        const pipeline: PipelineStage[] = [
          {
            $match: {
              schedule_date: { $gte: minDate },
              service_id: service_id,
            },
          },
        ];

        pipeline.push({
          $addFields: {
            registrants_count: {
              $size: { $ifNull: ["$registrants", []] },
            },
            month_key: {
              $dateToString: {
                date: "$schedule_date",
                format: "%Y-%m",
              },
            },
            month_label: {
              $dateToString: {
                date: "$schedule_date",
                format: "%B %Y",
              },
            },
            month_start: {
              $dateFromParts: {
                year: { $year: "$schedule_date" },
                month: { $month: "$schedule_date" },
                day: 1,
              },
            },
          },
        });

        pipeline.push({ $sort: { schedule_date: 1, _id: 1 } });

        pipeline.push({
          $group: {
            _id: "$month_key",
            month: { $first: "$month_label" },
            startDate: { $first: "$month_start" },
            schedules: {
              $push: {
                _id: "$_id",
                schedule_date: "$schedule_date",
                quota: { $ifNull: ["$quota", 0] },
                registrants: "$registrants_count",
                is_full: { $ifNull: ["$is_full", false] },
              },
            },
          },
        });

        pipeline.push({ $sort: { startDate: 1 } });

        pipeline.push({
          $project: {
            _id: 0,
            month: "$month",
            schedules: 1,
          },
        });

        return this.aggregate(pipeline).exec();
      },
      getAllParticipants(id: string) {
        const pipeline: PipelineStage[] = [];
        if (id && mongoose.Types.ObjectId.isValid(id)) {
          const schedule_id = new mongoose.Types.ObjectId(id);
          pipeline.push({ $match: { _id: schedule_id } });
        }

        pipeline.push(
          { $unwind: "$registrants" },
          {
            $lookup: {
              from: "users",
              localField: "registrants.participant_id",
              foreignField: "_id",
              as: "participant",
            },
          },
          { $unwind: "$participant" },
          { $sort: { "registrants.register_date": 1 } },
          {
            $project: {
              _id: 0,
              register_date: "$registrants.register_date",
              payment: {
                receipt: "$registrants.payment_receipt",
                date: "$registrants.payment_date",
              },
              participant: {
                _id: "$participant._id",
                fullName: "$participant.registration_data.fullName",
                gender: "$participant.registration_data.gender",
                birth_date: "$participant.registration_data.birth_date",
                phone_number: "$participant.registration_data.phone_number",
                NIM: "$participant.registration_data.NIM",
                faculty: "$participant.registration_data.faculty",
                major: "$participant.registration_data.major",
              },
              status: "$registrants.status",
              approved: {
                admin_id: "$registrants.approved.admin_id",
                date: "$registrants.approved.date",
              },
            },
          },
        );
        return this.aggregate(pipeline).exec();
      },
      getRegistrants(options: ScheduleRegistrantsQueryOptions) {
        const { skip, limit, status, search } = options;
        const pipeline: PipelineStage[] = [
          { $unwind: "$registrants" },
          {
            $lookup: {
              from: "users",
              localField: "registrants.participant_id",
              foreignField: "_id",
              as: "participant",
            },
          },
          { $unwind: "$participant" },
          {
            $lookup: {
              from: "services",
              localField: "service_id",
              foreignField: "_id",
              as: "service",
            },
          },
          { $unwind: "$service" },
        ];

        if (status) {
          pipeline.push({ $match: { "registrants.status": status } });
        }

        if (search) {
          pipeline.push({
            $match: {
              $or: [
                {
                  "participant.registration_data.fullName": {
                    $regex: search,
                    $options: "i",
                  },
                },
                {
                  "participant.registration_data.NIM": {
                    $regex: search,
                    $options: "i",
                  },
                },
                {
                  "service.name": {
                    $regex: search,
                    $options: "i",
                  },
                },
              ],
            },
          });
        }

        pipeline.push({ $sort: { "registrants.register_date": -1, _id: 1 } });

        if (skip > 0) {
          pipeline.push({ $skip: skip });
        }

        pipeline.push({ $limit: limit });

        pipeline.push({
          $project: {
            _id: 0,
            schedule_id: "$_id",
            service_name: "$service.name",
            schedule_date: "$schedule_date",
            register_date: "$registrants.register_date",
            payment_receipt: "$registrants.payment_receipt",
            payment_date: "$registrants.payment_date",
            status: "$registrants.status",
            participant_id: "$registrants.participant_id",
            fullName: "$participant.registration_data.fullName",
            gender: "$participant.registration_data.gender",
            birth_date: "$participant.registration_data.birth_date",
            phone_number: "$participant.registration_data.phone_number",
            NIM: "$participant.registration_data.NIM",
            faculty: "$participant.registration_data.faculty",
            major: "$participant.registration_data.major",
            approved: "$registrants.approved",
            scores: {
              listening: "$registrants.scores.listening",
              reading: "$registrants.scores.reading",
              writing: "$registrants.scores.writing",
              total: "$registrants.scores.total",
            },
            cid_certificate: "$registrants.cid_certificate",
          },
        });

        return this.aggregate(pipeline).exec();
      },
      async setRegistrantScores(
        scheduleId: string,
        participantId: string,
        scores: IRegistrantScore,
      ) {
        if (
          !mongoose.Types.ObjectId.isValid(scheduleId) ||
          !mongoose.Types.ObjectId.isValid(participantId)
        ) {
          throw new Error("ID jadwal atau peserta tidak valid");
        }

        const scheduleObjectId = new mongoose.Types.ObjectId(scheduleId);
        const participantObjectId = new mongoose.Types.ObjectId(participantId);

        const result = await this.updateOne(
          {
            _id: scheduleObjectId,
            "registrants.participant_id": participantObjectId,
          },
          {
            $set: {
              "registrants.$.scores": scores,
            },
          },
        ).exec();

        if (!result.matchedCount) {
          throw new Error("Registrasi peserta tidak ditemukan");
        }
      },
      async setRegistrantCidCertificate(
        scheduleId: string,
        participantId: string,
        cid: string,
      ) {
        if (
          !mongoose.Types.ObjectId.isValid(scheduleId) ||
          !mongoose.Types.ObjectId.isValid(participantId)
        ) {
          throw new Error("ID jadwal atau peserta tidak valid");
        }

        const scheduleObjectId = new mongoose.Types.ObjectId(scheduleId);
        const participantObjectId = new mongoose.Types.ObjectId(participantId);

        const result = await this.updateOne(
          {
            _id: scheduleObjectId,
            "registrants.participant_id": participantObjectId,
          },
          {
            $set: {
              "registrants.$.cid_certificate": cid,
            },
          },
        ).exec();

        if (!result.matchedCount) {
          throw new Error("Registrasi peserta tidak ditemukan");
        }
      },
      async getRegistrantDetail(
        scheduleId: string,
        participantId: string,
      ): Promise<ScheduleRegistrantResult | null> {
        if (
          !mongoose.Types.ObjectId.isValid(scheduleId) ||
          !mongoose.Types.ObjectId.isValid(participantId)
        ) {
          throw new Error("ID jadwal atau peserta tidak valid");
        }

        const scheduleObjectId = new mongoose.Types.ObjectId(scheduleId);
        const participantObjectId = new mongoose.Types.ObjectId(participantId);

        const pipeline: PipelineStage[] = [
          { $match: { _id: scheduleObjectId } },
          { $unwind: "$registrants" },
          { $match: { "registrants.participant_id": participantObjectId } },
          {
            $lookup: {
              from: "users",
              localField: "registrants.participant_id",
              foreignField: "_id",
              as: "participant",
            },
          },
          { $unwind: "$participant" },
          {
            $lookup: {
              from: "services",
              localField: "service_id",
              foreignField: "_id",
              as: "service",
            },
          },
          { $unwind: "$service" },
          {
            $project: {
              _id: 0,
              schedule_id: "$_id",
              service_name: "$service.name",
              schedule_date: "$schedule_date",
              register_date: "$registrants.register_date",
              payment_receipt: "$registrants.payment_receipt",
              payment_date: "$registrants.payment_date",
              status: "$registrants.status",
              participant_id: "$registrants.participant_id",
              fullName: "$participant.registration_data.fullName",
              gender: "$participant.registration_data.gender",
              birth_date: "$participant.registration_data.birth_date",
              phone_number: "$participant.registration_data.phone_number",
              NIM: "$participant.registration_data.NIM",
              faculty: "$participant.registration_data.faculty",
              major: "$participant.registration_data.major",
              approved: "$registrants.approved",
              scores: {
                listening: "$registrants.scores.listening",
                reading: "$registrants.scores.reading",
                writing: "$registrants.scores.writing",
                total: "$registrants.scores.total",
              },
              cid_certificate: "$registrants.cid_certificate",
            },
          },
        ];

        const data = await this.aggregate(pipeline).exec();
        return data[0] ?? null;
      },
    },
  },
);

scheduleSchema.index({ service_id: 1, schedule_date: 1 }, { unique: true });

export default scheduleSchema;
