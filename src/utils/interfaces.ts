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
  toefl_hash?: string;
  certificate?: string;
}

// blueprint untuk yg daftar tes TOEFL
interface ITOEFL {
  address_peserta: string;
  nama_lengkap: string;
  email: string;
  nomor_induk_mahasiswa: string;
  jurusan: string;
  sesi_tes: string;
  status: string;
  tanggal_tes: Date;
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
