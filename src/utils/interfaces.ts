import { Types, Model } from 'mongoose';
import { Request } from 'express';

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

interface ITOEFL {
  address: string;
  fullName: string;
  email: string;
  nim: string;
  major: string;
  sessionTest: string;
  status: string;
  testDate: Date;
}

interface IPesertaModel extends Model<IPeserta> {
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
  findToeflHashByAddress(address: string): Promise<{
    hashToefl: string;
  }>;
}
interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
}

// Token jwt
interface IUserToken
  extends Omit<IUser, 'createdAt' | 'UpdatedAt' | 'fullName' | 'email'> {
  id?: Types.ObjectId;
}

interface IReqUser extends Request {
  user?: IUserToken;
}

export {
  IUser,
  IPeserta,
  ITOEFL,
  IPesertaModel,
  IUserToken,
  IReqUser,
  IPaginationQuery,
};
