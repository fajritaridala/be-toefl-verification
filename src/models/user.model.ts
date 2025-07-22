import mongoose from "mongoose";
import { UserSchema, PesertaSchema } from "../schemas/UserSchema";
import { IUser, IPeserta } from "../interfaces/IUser";

const UserModel = mongoose.model<IUser>("User", UserSchema);
const PesertaModel = UserModel.discriminator<IPeserta>(
  "peserta",
  PesertaSchema
);

export { UserModel, PesertaModel };
