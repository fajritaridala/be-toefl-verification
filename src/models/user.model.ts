import mongoose from 'mongoose';
import dbSchema from '../utils/schema';
import { IUser, IPeserta } from '../utils/interface';
import { ROLES } from '../utils/constants';

const UserModel = mongoose.model<IUser>('users', dbSchema.user);
const PesertaModel = UserModel.discriminator<IPeserta>(
  ROLES.PESERTA,
  dbSchema.peserta
);
const AdminModel = UserModel.discriminator<IUser>(ROLES.ADMIN, dbSchema.user);

export { UserModel, PesertaModel, AdminModel };
