import mongoose from "mongoose";
import { IUser, IPeserta } from "../interfaces/IUser";

const options = {
  discriminatorKey: "role",
  collection: "users",
  timestamps: true,
};

const Schema = mongoose.Schema;

// base database
const UserSchema = new Schema<IUser>(
  {
    address: {
      type: Schema.Types.String,
      required: true,
    },
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    role: {
      type: Schema.Types.String,
      enum: ["peserta", "admin"],
      default: "peserta",
    },
  },
  options
);

// tambahan untuk peserta
const PesertaSchema = new Schema<IPeserta>({
  hash_toefl: {
    type: Schema.Types.String,
  },
  cid_certificate: {
    type: Schema.Types.String,
  },
  isActivated: {
    type: Schema.Types.Boolean,
    default: false,
  },
});

export { UserSchema, PesertaSchema };
