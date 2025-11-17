import { Request } from "express";
import { Types } from "mongoose";

interface IUser {
  address: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IPeserta extends IUser {
  hash?: string;
  certificate?: string;
  registration_data?: DataPendaftaran;
}

interface DataPendaftaran {
  fullName: string;
  gender: string;
  birth_date: number;
  phone_number: string;
  NIM: string;
  faculty: string;
  major: string;
}

// blueprint query pagination
interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
  service_id?: string;
}

// Token jwt
interface IUserToken {
  _id: Types.ObjectId;
  address: string;
  role: string;
}

// blueprint request
interface IReqUser extends Request {
  user?: IUserToken;
}

export { IUser, IPeserta, DataPendaftaran, IUserToken, IReqUser, IPaginationQuery };
