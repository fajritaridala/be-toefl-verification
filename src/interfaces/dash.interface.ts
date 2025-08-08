import { Types } from "mongoose";

// Dashboard interfaces
interface IDashboardSummary {
  totalParticipants: number;
  processedParticipants: number;
  unprocessedParticipants: number;
}

interface IUnprocessedParticipant {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  address: string;
  createdAt: Date;
}

interface IDashboardData {
  summary: IDashboardSummary;
  latestUnprocessed: IUnprocessedParticipant[];
}

export { IDashboardSummary, IUnprocessedParticipant, IDashboardData };
