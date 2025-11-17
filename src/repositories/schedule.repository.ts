import mongoose, { PipelineStage, Types } from "mongoose";
import { ScheduleModel } from "../models/schedule.model";

type SortDirection = 1 | -1;

interface RegistrantAggregateOptions {
  scheduleId?: Types.ObjectId;
  participantId?: Types.ObjectId;
  status?: string;
  search?: string;
  skip: number;
  limit: number;
  sortDirection: SortDirection;
}

export interface RegistrantAggregateRecord {
  scheduleId: Types.ObjectId;
  serviceName: string;
  scheduleDate: Date;
  registrationDate: Date;
  paymentReceipt: string;
  paymentDate: Date;
  status: string;
  participantId: Types.ObjectId;
  participant: {
    fullName?: string;
    gender?: string;
    birthDate?: Date;
    phoneNumber?: string;
    nim?: string;
    faculty?: string;
    major?: string;
    email?: string;
  };
  approved?: {
    adminId?: Types.ObjectId;
    date?: Date;
  };
  scores?: {
    listening: number;
    reading: number;
    writing: number;
    total: number;
  };
  cidCertificate?: string;
}

interface RegistrantAggregateResult {
  data: RegistrantAggregateRecord[];
  total: number;
}

export interface HistoryAggregateRecord {
  serviceName: string;
  scheduleDate: Date;
  status: string;
  cidCertificate?: string;
  scores?: {
    listening: number;
    reading: number;
    writing: number;
    total: number;
  };
}

const buildParticipantLookup = (): PipelineStage => ({
  $lookup: {
    from: "users",
    let: { participantId: "$registrants.participant_id" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$participantId"] },
        },
      },
      {
        $project: {
          email: 1,
          profile: {
            fullName: "$registration_data.fullName",
            gender: "$registration_data.gender",
            birthDate: "$registration_data.birth_date",
            phoneNumber: "$registration_data.phone_number",
            nim: "$registration_data.NIM",
            faculty: "$registration_data.faculty",
            major: "$registration_data.major",
          },
        },
      },
    ],
    as: "participant",
  },
});

const buildServiceLookup = (): PipelineStage => ({
  $lookup: {
    from: "services",
    let: { serviceId: "$service_id" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$serviceId"] },
        },
      },
      {
        $project: {
          name: 1,
        },
      },
    ],
    as: "service",
  },
});

const buildProjectionStage = (): PipelineStage => ({
  $project: {
    scheduleId: "$_id",
    serviceName: { $ifNull: ["$service.name", ""] },
    scheduleDate: "$schedule_date",
    registrationDate: "$registrants.register_date",
    paymentReceipt: "$registrants.payment_receipt",
    paymentDate: "$registrants.payment_date",
    status: "$registrants.status",
    participantId: "$registrants.participant_id",
    participant: {
      fullName: {
        $ifNull: [
          "$registrants.participantProfile.fullName",
          { $ifNull: ["$participant.profile.fullName", ""] },
        ],
      },
      gender: {
        $ifNull: [
          "$registrants.participantProfile.gender",
          "$participant.profile.gender",
        ],
      },
      birthDate: {
        $ifNull: [
          "$registrants.participantProfile.birthDate",
          "$participant.profile.birthDate",
        ],
      },
      phoneNumber: {
        $ifNull: [
          "$registrants.participantProfile.phoneNumber",
          "$participant.profile.phoneNumber",
        ],
      },
      nim: {
        $ifNull: [
          "$registrants.participantProfile.nim",
          "$participant.profile.nim",
        ],
      },
      faculty: {
        $ifNull: [
          "$registrants.participantProfile.faculty",
          "$participant.profile.faculty",
        ],
      },
      major: {
        $ifNull: [
          "$registrants.participantProfile.major",
          "$participant.profile.major",
        ],
      },
      email: {
        $ifNull: [
          "$registrants.participantProfile.email",
          "$participant.email",
        ],
      },
    },
    approved: {
      adminId: "$registrants.approved.admin_id",
      date: "$registrants.approved.date",
    },
    scores: {
      listening: "$registrants.scores.listening",
      reading: "$registrants.scores.reading",
      writing: "$registrants.scores.writing",
      total: "$registrants.scores.total",
    },
    cidCertificate: "$registrants.cid_certificate",
  },
});

class ScheduleRepository {
  private buildRegistrantPipeline(
    options: RegistrantAggregateOptions,
  ): PipelineStage[] {
    const pipeline: PipelineStage[] = [];

    if (options.scheduleId) {
      pipeline.push({ $match: { _id: options.scheduleId } });
    }

    pipeline.push({ $unwind: "$registrants" });

    if (options.participantId) {
      pipeline.push({
        $match: {
          "registrants.participant_id": options.participantId,
        },
      });
    }

    if (options.status) {
      pipeline.push({ $match: { "registrants.status": options.status } });
    }

    pipeline.push(buildParticipantLookup());
    pipeline.push({
      $unwind: {
        path: "$participant",
        preserveNullAndEmptyArrays: true,
      },
    });
    pipeline.push(buildServiceLookup());

    pipeline.push({ $unwind: "$service" });

    if (options.search) {
      const regex = { $regex: options.search, $options: "i" };
      pipeline.push({
        $match: {
          $or: [
            { "registrants.participantProfile.fullName": regex },
            { "registrants.participantProfile.nim": regex },
            { "participant.profile.fullName": regex },
            { "participant.profile.nim": regex },
            { "service.name": regex },
          ],
        },
      });
    }

    return pipeline;
  }

  private buildFacetStages(
    options: RegistrantAggregateOptions,
  ): PipelineStage[] {
    const sortStage: PipelineStage = {
      $sort: {
        "registrants.register_date": options.sortDirection,
        _id: options.sortDirection,
      },
    };

    const dataPipeline: PipelineStage[] = [sortStage];
    if (options.skip > 0) {
      dataPipeline.push({ $skip: options.skip });
    }
    dataPipeline.push({ $limit: options.limit });
    dataPipeline.push(buildProjectionStage());

    return [
      {
        $facet: {
          data: dataPipeline,
          total: [{ $count: "count" }],
        },
      } as PipelineStage,
      {
        $project: {
          data: 1,
          total: {
            $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0],
          },
        },
      } as PipelineStage,
    ];
  }

  private async aggregateRegistrants(
    options: RegistrantAggregateOptions,
  ): Promise<RegistrantAggregateResult> {
    const pipeline = [
      ...this.buildRegistrantPipeline(options),
      ...this.buildFacetStages(options),
    ];

    const [result] =
      await ScheduleModel.aggregate<RegistrantAggregateResult>(pipeline).exec();

    return {
      data: result?.data ?? [],
      total: result?.total ?? 0,
    };
  }

  async findRegistrants(
    options: Omit<RegistrantAggregateOptions, "scheduleId" | "participantId">,
  ): Promise<RegistrantAggregateResult> {
    return this.aggregateRegistrants(options);
  }

  async findParticipantsBySchedule(
    scheduleId: string,
    options: Omit<RegistrantAggregateOptions, "scheduleId" | "participantId">,
  ): Promise<RegistrantAggregateResult> {
    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
      throw new Error("Invalid schedule id");
    }

    return this.aggregateRegistrants({
      ...options,
      scheduleId: new mongoose.Types.ObjectId(scheduleId),
    });
  }

  async findParticipantHistory(
    participantId: string,
  ): Promise<HistoryAggregateRecord[]> {
    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      throw new Error("Invalid participant id");
    }

    const participantObjectId = new mongoose.Types.ObjectId(participantId);

    const pipeline: PipelineStage[] = [
      { $match: { "registrants.participant_id": participantObjectId } },
      { $unwind: "$registrants" },
      { $match: { "registrants.participant_id": participantObjectId } },
      buildServiceLookup(),
      { $unwind: "$service" },
      {
        $project: {
          serviceName: "$service.name",
          scheduleDate: "$schedule_date",
          status: "$registrants.status",
          cidCertificate: "$registrants.cid_certificate",
          scores: {
            listening: "$registrants.scores.listening",
            reading: "$registrants.scores.reading",
            writing: "$registrants.scores.writing",
            total: "$registrants.scores.total",
          },
        },
      },
      { $sort: { scheduleDate: -1 } },
    ];

    return ScheduleModel.aggregate<HistoryAggregateRecord>(pipeline).exec();
  }
}

export const scheduleRepository = new ScheduleRepository();
