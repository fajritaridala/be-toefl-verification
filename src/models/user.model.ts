import mongoose from "mongoose";
import { UserSchema, PesertaSchema } from "../schemas/UserSchema";
import { IUser, IPeserta } from "../interfaces/auth.interface";
import { ROLES } from "../utils/contant";

const UserModel = mongoose.model<IUser>("User", UserSchema);
const PesertaModel = UserModel.discriminator<IPeserta>(
  ROLES.PESERTA,
  PesertaSchema
);
const AdminModel = UserModel.discriminator<IUser>(ROLES.ADMIN, UserSchema);

export { UserModel, PesertaModel, AdminModel };
