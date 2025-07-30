import mongoose from "mongoose";
import dbSchema from "../schemas/database.schema";
import { IUser, IPeserta } from "../interfaces/auth.interface";
import { ROLES } from "../utils/contant";

const UserModel = mongoose.model<IUser>("users", dbSchema.user);
const PesertaModel = UserModel.discriminator<IPeserta>(
  ROLES.PESERTA,
  dbSchema.peserta
);
const AdminModel = UserModel.discriminator<IUser>(ROLES.ADMIN, dbSchema.user);

export { UserModel, PesertaModel, AdminModel };
