import { Types } from "mongoose";
import { Request } from "express";

interface IUser {
  address: string;
  fullName: string;
  email: string;
  role: string;
  createdAt?: Date;
  UpdatedAt?: Date;
}

// Interface tambahan untuk peserta
interface IPeserta extends IUser {
  hash_toefl: string;
  cid_certificate: string;
  isActivated: boolean;
}

// Token jwt
interface IUserToken extends Omit<IUser, "createdAt" | "UpdatedAt"> {
  id?: Types.ObjectId;
}

interface IReqUser extends Request {
  user?: IUserToken;
}

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

export {
  IUser,
  IPeserta,
  IUserToken,
  IReqUser,
  IDashboardSummary,
  IUnprocessedParticipant,
  IDashboardData,
};
