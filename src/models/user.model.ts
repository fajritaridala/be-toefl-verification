import mongoose from "mongoose";
import { IPeserta, IUser } from "../interfaces/auth.interface";
import { PesertaSchema, UserSchema } from "../schemas/auth.schema";
import { ROLES } from "../utils/constants";

const UserModel = mongoose.model<IUser>("users", UserSchema);
const PesertaModel = UserModel.discriminator<IPeserta>(
  ROLES.PESERTA,
  PesertaSchema,
);
const AdminModel = UserModel.discriminator<IUser>(ROLES.ADMIN, UserSchema);

export { UserModel, PesertaModel, AdminModel };
