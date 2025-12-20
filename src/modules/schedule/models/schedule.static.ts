import { type PipelineStage, Types } from "mongoose";
import type { OptionsDto } from "../../../common/dtos/query.dto";
import type { ScheduleModel } from "../schedule.interface";

async function findAll(this: ScheduleModel, options: OptionsDto) {
  const {
    skip,
    limit,
    serviceId,
    status,
    month,
    minDate,
    excludeDeleted,
    includeDeleted,
  } = options;
  const pipeline: PipelineStage[] = [];

  // Default: exclude deleted records unless includeDeleted is true
  if (excludeDeleted || !includeDeleted) {
    pipeline.push({
      $match: { deletedAt: null },
    });
  }

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

  if (minDate) {
    pipeline.push({
      $match: {
        scheduleDate: { $gte: minDate },
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
            _id: 0,
            scheduleId: "$_id",
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
    pagination: {
      current,
      total,
      totalPages,
    },
  };
}

interface FindAllPublicOptions {
  serviceId: string;
  minDate: Date;
}

async function findAllPublic(
  this: ScheduleModel,
  options: FindAllPublicOptions,
) {
  const { serviceId, minDate } = options;
  const pipeline: PipelineStage[] = [];

  // Exclude deleted records
  pipeline.push({
    $match: { deletedAt: null },
  });

  // Filter by serviceId
  pipeline.push({
    $match: { serviceId: new Types.ObjectId(serviceId) },
  });

  // Filter by minDate (H+7)
  pipeline.push({
    $match: {
      scheduleDate: { $gte: minDate },
    },
  });

  // Sort by scheduleDate ascending
  pipeline.push({
    $sort: { scheduleDate: 1 },
  });

  // Lookup service info
  pipeline.push({
    $lookup: {
      from: "services",
      localField: "serviceId",
      foreignField: "_id",
      as: "service",
    },
  });

  pipeline.push({
    $unwind: {
      path: "$service",
      preserveNullAndEmptyArrays: true,
    },
  });

  // Project final fields
  pipeline.push({
    $project: {
      _id: 1,
      scheduleDate: 1,
      serviceName: "$service.name",
      quota: 1,
      registrants: 1,
      status: 1,
    },
  });

  const result = await this.aggregate(pipeline);
  return result;
}

export { findAll, findAllPublic };
