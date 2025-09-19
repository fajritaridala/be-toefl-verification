import mongoose from 'mongoose';
import dbSchema from '../utils/schemas';
import { IUser, IPeserta } from '../utils/interfaces';
import { ROLES } from '../utils/constant';

const UserModel = mongoose.model<IUser>('users', dbSchema.user);
const PesertaModel = UserModel.discriminator<IPeserta>(
  ROLES.PESERTA,
  dbSchema.peserta
);
const AdminModel = UserModel.discriminator<IUser>(ROLES.ADMIN, dbSchema.user);

export { UserModel, PesertaModel, AdminModel };
