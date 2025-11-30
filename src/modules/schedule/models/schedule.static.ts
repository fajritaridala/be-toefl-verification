import { type PipelineStage, Types } from "mongoose";
import type { OptionsDto } from "../../../common/dtos/query.dto";
import type { ScheduleModel } from "../schedule.interface";

async function findAll(this: ScheduleModel, options: OptionsDto) {
  const { skip, limit, serviceId, status, month } = options;
  const pipeline: PipelineStage[] = [];

  if (serviceId) {
    pipeline.push({
      $match: { serviceId: new Types.ObjectId(serviceId) },
    });
  }

  if (status) {
    pipeline.push({
      $match: { status },
    });
  }

  if (month) {
    pipeline.push({
      $match: {
        $expr: {
          $eq: [{ $month: "$scheduleDate" }, month],
        },
      },
    });
  }

  pipeline.push({
    $facet: {
      data: [
        {
          $sort: {
            scheduleDate: 1,
          },
        },
        {
          $skip: skip,
        },
        { $limit: limit },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
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
            scheduleDate: 1,
            startTime: 1,
            endTime: 1,
            status: 1,
            quota: 1,
            serviceId: 1,
            serviceName: "$service.name",
            registrants: 1,
          },
        },
      ],
      counts: [{ $count: "count" }],
    },
  });

  const result = await this.aggregate(pipeline);
  const data = result[0].data;
  const total = result[0].counts[0]?.count || 0;

  const current = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      current,
      total,
      totalPages,
    },
  };
}

export default findAll;
