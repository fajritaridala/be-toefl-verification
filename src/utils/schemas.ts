import mongoose from "mongoose";
import { ROLES } from "../utils/constant";
import { IPeserta, ITOEFL, IUser } from "./interfaces";

const Schema = mongoose.Schema;

// base collection
const UserSchema = new Schema<IUser>(
  {
    address: {
      type: Schema.Types.String,
      required: true,
      unique: true,
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
  toefl_hash: {
    type: Schema.Types.String,
  },
  certificate: {
    type: Schema.Types.String,
  },
});

// toefl collection
const TOEFLSchema = new Schema<ITOEFL>(
  {
    address_peserta: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    nama_lengkap: {
      type: Schema.Types.String,
      required: true,
    },
    jenis_kelamin: {
      type: Schema.Types.String,
      required: true,
    },
    tanggal_lahir: {
      type: Schema.Types.String,
      required: true,
    },
    nomor_induk_mahasiswa: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    fakultas: {
      type: Schema.Types.String,
      required: true,
    },
    program_studi: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      required: true,
    },
    sesi_tes: {
      type: Schema.Types.String,
      required: true,
    },
    tanggal_tes: {
      type: Schema.Types.String,
      required: true,
    },
  },
  { timestamps: true },
);

export default {
  user: UserSchema,
  peserta: PesertaSchema,
  toefl: TOEFLSchema,
};
