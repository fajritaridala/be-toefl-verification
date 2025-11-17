import {
  HistoryItemDto,
  RegistrantItemDto,
  ScheduleParticipantItemDto,
} from "../dtos";
import {
  HistoryAggregateRecord,
  RegistrantAggregateRecord,
} from "../repositories/schedule.repository";

const formatDate = (value?: Date): string | undefined =>
  value ? value.toISOString() : undefined;

export const mapRegistrantRecordToDto = (
  record: RegistrantAggregateRecord,
): RegistrantItemDto => ({
  id: `${record.scheduleId.toString()}-${record.participantId.toString()}`,
  scheduleId: record.scheduleId.toString(),
  serviceName: record.serviceName,
  scheduleDate: formatDate(record.scheduleDate) ?? "",
  registrationDate: formatDate(record.registrationDate) ?? "",
  status: record.status,
  paymentReceipt: record.paymentReceipt,
  paymentDate: formatDate(record.paymentDate) ?? "",
  participantId: record.participantId.toString(),
  fullName: record.participant.fullName ?? "",
  gender: record.participant.gender ?? undefined,
  birthDate: formatDate(record.participant.birthDate),
  phoneNumber: record.participant.phoneNumber ?? undefined,
  nim: record.participant.nim ?? undefined,
  faculty: record.participant.faculty ?? undefined,
  major: record.participant.major ?? undefined,
  approved: record.approved
    ? {
        adminId: record.approved.adminId?.toString(),
        date: formatDate(record.approved.date),
      }
    : undefined,
  scores: record.scores
    ? {
        listening: record.scores.listening,
        reading: record.scores.reading,
        writing: record.scores.writing,
        total: record.scores.total,
      }
    : undefined,
  cidCertificate: record.cidCertificate ?? undefined,
});

export const mapParticipantRecordToDto = (
  record: RegistrantAggregateRecord,
): ScheduleParticipantItemDto =>
  mapRegistrantRecordToDto(record) as ScheduleParticipantItemDto;

export const mapHistoryRecordToDto = (
  record: HistoryAggregateRecord,
  index: number,
  participantId: string,
): HistoryItemDto => ({
  _id: `${participantId}-${index}`,
  serviceName: record.serviceName,
  scheduleDate: formatDate(record.scheduleDate) ?? "",
  status: record.status,
  cidCertificate: record.cidCertificate ?? undefined,
  scores: record.scores,
});
