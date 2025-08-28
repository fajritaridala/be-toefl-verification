import { Types, Model } from "mongoose";
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
  hashToefl?: string;
  cidCertificate?: string;
  isActivated?: boolean;
}

interface IPesertaModel extends Model<IPeserta> {
  getAllPeserta(): Promise<{
    address: string;
    fullName: string;
    email: string;
    isActivated: boolean;
  }>;
  getPesertaByActivated(isActivated: boolean): Promise<{
    address: string;
    fullName: string;
    email: string;
    isActivated: boolean;
  }>;
  getOverview(): Promise<{
    statistics: {
      totalPeserta: number;
      activatedPeserta: number;
      notActivatedPeserta: number;
    };
    latestNotActivatedPeserta: {
      address: string;
      fullName: string;
      email: string;
      isActivated: boolean;
    };
  }>;
}

// Token jwt
interface IUserToken extends Omit<IUser, "createdAt" | "UpdatedAt"> {
  id?: Types.ObjectId;
}

interface IReqUser extends Request {
  user?: IUserToken;
}

export { IUser, IPeserta, IPesertaModel, IUserToken, IReqUser };
