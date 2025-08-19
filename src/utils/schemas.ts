import * as Yup from "yup";
import mongoose from "mongoose";
import { ROLES } from "../utils/constant";
import { IUser, IPeserta } from "./interfaces";

// register schema
const registerValidateSchema = Yup.object({
  address: Yup.string().required(),
  fullName: Yup.string().required(),
  email: Yup.string().email().required(),
  roleToken: Yup.string().notRequired(),
});

const loginValidateSchema = Yup.object({
  address: Yup.string().required(),
});

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

PesertaSchema.statics.getAllParticipant = function () {
  return this.find({}).select("address fullName email isActivated -_id").lean();
};

PesertaSchema.statics.getProcessedParticipant = function () {
  return this.find({ isActivated: true })
    .select("address fullName email createdAt -_id")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
};

PesertaSchema.statics.getUnprocessedParticipants = function () {
  return this.find({ isActivated: false })
    .select("fullName email address createdAt -_id")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
};

PesertaSchema.statics.getOverview = async function () {
  const [
    participants,
    activatedParticipant,
    notActivatedParticipant,
    latestNotActivatedParticipant,
  ] = await Promise.all([
    this.countDocuments({}),
    this.countDocuments({ isActivated: true }),
    this.countDocuments({ isActivated: false }),
    this.find({ isActivated: false })
      .select("fullName email address createdAt -_id")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  return {
    statistics: {
      participants,
      activatedParticipant,
      notActivatedParticipant,
    },
    latestNotActivatedParticipant,
  };
};

export default {
  user: UserSchema,
  peserta: PesertaSchema,
  register: registerValidateSchema,
  login: loginValidateSchema,
};
