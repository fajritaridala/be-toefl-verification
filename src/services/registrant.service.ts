import {
  HistoryItemDto,
  PaginatedResponseDto,
  RegistrantItemDto,
  RegistrantListQueryDto,
  ScheduleParticipantsQueryDto,
  ScheduleParticipantsResponseDto,
  ScoreInputBodyDto,
  ScoreInputResponseDto,
} from "../dtos";
import { NotFoundException } from "../exceptions";
import {
  mapHistoryRecordToDto,
  mapParticipantRecordToDto,
  mapRegistrantRecordToDto,
} from "../mappers/registrant.mapper";
import { ScheduleModel } from "../models/schedule.model";
import { scheduleRepository } from "../repositories/schedule.repository";
import { certificateService } from "./certificate.service";
import { scoreService } from "./score.service";

export class RegistrantService {
  async getRegistrants(
    query: RegistrantListQueryDto,
  ): Promise<PaginatedResponseDto<RegistrantItemDto>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;
    const sortDirection = query.sort === "oldest" ? 1 : -1;

    const { data, total } = await scheduleRepository.findRegistrants({
      skip,
      limit,
      status: query.status,
      search: query.search,
      sortDirection,
    });

    return {
      data: data.map(mapRegistrantRecordToDto),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async inputScores(
    scheduleId: string,
    participantId: string,
    scoresInput: ScoreInputBodyDto,
  ): Promise<ScoreInputResponseDto> {
    const convertedScores = scoreService.convertToToeflScores(scoresInput);

    await ScheduleModel.setRegistrantScores(
      scheduleId,
      participantId,
      convertedScores,
    );

    const registrant = await ScheduleModel.getRegistrantDetail(
      scheduleId,
      participantId,
    );

    if (!registrant) {
      throw new NotFoundException("Registrant", participantId);
    }

    const { cid, hash } = await certificateService.generateAndUploadCertificate(
      {
        fullName: registrant.fullName,
        email: "", // Email not available in registrant, would need to fetch from user
        nim: registrant.NIM,
      },
      convertedScores,
      new Date(registrant.schedule_date),
      registrant.service_name,
    );

    await ScheduleModel.setRegistrantCidCertificate(
      scheduleId,
      participantId,
      cid,
    );

    return {
      hash,
      certificateData: {
        participant: {
          fullName: registrant.fullName,
          email: "", // Email not available in registrant
          nim: registrant.NIM,
        },
        scores: convertedScores,
        examDate: new Date(registrant.schedule_date).toISOString(),
        testType: registrant.service_name,
      },
    };
  }

  async getParticipantHistory(
    participantId: string,
  ): Promise<HistoryItemDto[]> {
    const history =
      await scheduleRepository.findParticipantHistory(participantId);
    return history.map((item, index) =>
      mapHistoryRecordToDto(item, index, participantId),
    );
  }

  async getScheduleParticipants(
    scheduleId: string,
    query: ScheduleParticipantsQueryDto,
  ): Promise<ScheduleParticipantsResponseDto> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;
    const sortDirection: 1 | -1 = query.sort === "oldest" ? 1 : -1;

    const { data, total } = await scheduleRepository.findParticipantsBySchedule(
      scheduleId,
      {
        skip,
        limit,
        status: query.status,
        search: query.search,
        sortDirection,
      },
    );

    return {
      data: data.map(mapParticipantRecordToDto),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const registrantService = new RegistrantService();
