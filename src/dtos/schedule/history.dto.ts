export interface HistoryItemDto {
  _id: string;
  serviceName: string;
  scheduleDate: string;
  status: string;
  cidCertificate?: string;
  scores?: {
    listening: number;
    reading: number;
    writing: number;
    total: number;
  };
}
