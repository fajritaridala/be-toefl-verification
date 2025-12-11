import mongoose, { PipelineStage } from "mongoose";
import { ENROLLED_STATUS } from "../../../common/utils/constants";
import {
  FindAllEnrollOptionsDto,
  GetScheduleEnrollOptionsDto,
  SubmitEnrollParamsDto,
} from "../dtos/enrollment.req.dto";
import { EnrollModel } from "../enrollment.interface";

const enrollStatic = {
  async findAll(this: EnrollModel, options: FindAllEnrollOptionsDto) {
    const { skip = 0, limit = 10, status, search } = options;
    const pipeline: PipelineStage[] = [];
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      const regex = { $regex: search, $options: "i" };
      const searchConditions = {
        $or: [
          { "candidate.fullName": regex },
          { "candidate.email": regex },
          { "candidate.nim": regex },
        ],
      };
      query.$and = query.$and || [];
      query.$and.push(searchConditions);
    }

    if (Object.keys(query).length > 0) {
      pipeline.push({
        $match: query,
      });
    }

    pipeline.push({
      $facet: {
        rows: [
          {
            $sort: { createdAt: -1 },
          },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "schedules",
              localField: "scheduleId",
              foreignField: "_id",
              as: "schedule",
            },
          },
          {
            $unwind: {
              path: "$schedule",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "services",
              localField: "schedule.serviceId",
              foreignField: "_id",
              as: "service",
            },
          },
          {
            $unwind: {
              path: "$service",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              scheduleId: 1,
              scheduleDate: "$schedule.scheduleDate",
              serviceName: "$service.name",
              paymentProof: 1,
              paymentDate: 1,
              status: 1,
              participantId: 1,
              fullName: "$candidate.fullName",
              gender: "$candidate.gender",
              email: "$candidate.email",
              phoneNumber: "$candidate.phoneNumber",
              nim: "$candidate.nim",
              faculty: "$candidate.faculty",
              major: "$candidate.major",
              registerAt: "$createdAt",
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    });

    const result = await this.aggregate(pipeline).exec();
    const rows = result[0].rows;
    const total = result[0].total[0]?.count || 0;

    const current = Math.floor(skip / limit + 1);
    const totalPages = Math.ceil(total / limit);

    return {
      data: rows,
      pagination: {
        current,
        total,
        totalPages,
      },
    };
  },
  async getScheduleParticipants(
    this: EnrollModel,
    options: GetScheduleEnrollOptionsDto,
  ) {
    const { skip = 0, limit = 10, scheduleId, search } = options;
    const pipeline: PipelineStage[] = [];

    pipeline.push({
      $match: {
        scheduleId: new mongoose.Types.ObjectId(scheduleId),
      },
    });

    if (search) {
      const regex = { $regex: search, $options: "i" };
      pipeline.push({
        $match: {
          $or: [
            { "candidate.fullName": regex },
            { "candidate.email": regex },
            { "candidate.nim": regex },
          ],
        },
      });
    }

    pipeline.push({
      $facet: {
        rows: [
          { $sort: { createdAt: -1 } },
          {
            $skip: skip,
          },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              paymentProof: 1,
              paymentDate: 1,
              status: 1,
              fullName: "$candidate.fullName",
              gender: "$candidate.gender",
              email: "$candidate.email",
              phoneNumber: "$candidate.phoneNumber",
              nim: "$candidate.nim",
              faculty: "$candidate.faculty",
              major: "$candidate.major",
              registerAt: "$createdAt",
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    });

    const result = await this.aggregate(pipeline).exec();
    const rows = result[0].rows;
    const total = result[0].total[0]?.count || 0;

    const current = Math.floor(skip / limit + 1);
    const totalPages = Math.ceil(total / limit);

    return {
      data: rows,
      pagination: {
        current,
        total,
        totalPages,
      },
    };
  },
  async findParticipant(this: EnrollModel, options: SubmitEnrollParamsDto) {
    const pipeline: PipelineStage[] = [];

    pipeline.push(
      {
        $match: {
          _id: new mongoose.Types.ObjectId(options.enrollId),
          participantId: new mongoose.Types.ObjectId(options.participantId),
          status: ENROLLED_STATUS.APPROVED,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participantId",
          foreignField: "_id",
          as: "participant",
        },
      },
      {
        $unwind: {
          path: "$participant",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          user: {
            fullName: "$candidate.fullName",
            gender: "$candidate.gender",
            email: "$candidate.email",
            phoneNumber: "$candidate.phoneNumber",
            nim: "$candidate.nim",
            faculty: "$candidate.faculty",
            major: "$candidate.major",
            registerAt: "$createdAt",
          },
          address: "$participant.address",
        },
      },
    );

    const result = await this.aggregate(pipeline).exec();
    return result[0];
  },
};

export default enrollStatic;
