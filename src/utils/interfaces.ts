import { Types, Model } from 'mongoose';
import { Request } from 'express';

// blueprint user untuk di simpan ke database
interface IUser {
  address: string;
  fullName: string;
  email: string;
  role: string;
  createdAt?: Date;
  UpdatedAt?: Date;
}

// blueprint tambahan untuk peserta
interface IPeserta extends IUser {
  hash?: string;
  certificate?: string;
}

// blueprint untuk yg daftar tes TOEFL
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

// blueprint query pagination
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

// blueprint request
interface IReqUser extends Request {
  user?: IUserToken;
}

export { IUser, IPeserta, ITOEFL, IUserToken, IReqUser, IPaginationQuery };
