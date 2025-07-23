import { Types } from "mongoose";

interface IUser {
  address: string;
  fullName: string;
  email: string;
  role: string;
  createdAt?: Date;
  UpdatedAt?: Date;
}

interface IPeserta extends IUser {
  hash_toefl: string;
  cid_certificate: string;
  isActivated: boolean;
}

interface IUserToken
  extends Omit<IUser, "createdAt" | "UpdatedAt"> {
  id?: Types.ObjectId;
}

export { IUser, IPeserta, IUserToken };
