import mongoose from "mongoose";
import { IPeserta, IUser } from "../interfaces/auth.interface";
import { ROLES } from "../utils/constants";

const Schema = mongoose.Schema;

// base collection
const UserSchema = new Schema<IUser>(
  {
    address: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    username: {
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
      enum: [ROLES.ADMIN, ROLES.PESERTA],
      default: ROLES.PESERTA,
    },
  },
  {
    discriminatorKey: "role",
    collection: "users",
    timestamps: true,
  },
);

// collection peserta
const PesertaSchema = new Schema<IPeserta>({
  hash: Schema.Types.String,
  certificate: Schema.Types.String,
  registration_data: {
    _id: false,
    type: {
      fullName: Schema.Types.String,
      gender: Schema.Types.String,
      birth_date: Schema.Types.Date,
      phone_number: Schema.Types.String,
      NIM: Schema.Types.String,
      faculty: Schema.Types.String,
      major: Schema.Types.String,
    },
  },
});

export { UserSchema, PesertaSchema };
