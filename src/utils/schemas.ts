import * as Yup from "yup";
import mongoose from "mongoose";
import { ROLES } from "../utils/constant";
import { IUser, IPeserta, IToeflScore, IDataToefl } from "./interfaces";

const Schema = mongoose.Schema;

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
  }
);

// collection peserta
const ToeflScore = new Schema<IToeflScore>(
  {
    listening: {
      type: Schema.Types.Number,
      required: true,
      default: 0,
    },
    reading: {
      type: Schema.Types.Number,
      required: true,
      default: 0,
    },
    writing: {
      type: Schema.Types.Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const DataToefl = new Schema<IDataToefl>({
  nim: {
    type: Schema.Types.String,
    required: true,
  },
  major: {
    type: Schema.Types.String,
    required: true,
  },
  sessionTest: {
    type: Schema.Types.Number,
    required: true,
  },
  score: {
    type: ToeflScore,
    requred: true,
  },
});

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
  dataToefl: {
    type: DataToefl,
    required: false,
  },
});

PesertaSchema.statics = {
  getAllPeserta() {
    return this.find({}).select("address fullName email isActivated -_id");
  },
  getPesertaByActivated(isActivated: boolean) {
    return this.aggregate([
      { $match: { isActivated } },
      {
        $project: {
          address: "$address",
          fullName: "$fullName",
          email: "$email",
          isActivated: "$isActivated",
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
    ]);
  },
  getOverview() {
    return this.aggregate([
      {
        $group: {
          _id: null,
          pesertaTotal: { $sum: 1 },
          activatedPeserta: { $sum: { $cond: ["$isActivated", 1, 0] } },
          notActivatedPeserta: { $sum: { $cond: ["$isActivated", 0, 1] } },
        },
      },
      {
        $project: {
          statistics: {
            pesertaTotal: "$pesertaTotal",
            activatedPeserta: "$activatedPeserta",
            notActivatedPeserta: "$notActivatedPeserta",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          let: {},
          pipeline: [
            { $match: { isActivated: false } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $project: {
                _id: 0,
                address: "$address",
                fullName: "$fullName",
                email: "$email",
                isActivated: "$isActivated",
              },
            },
          ],
          as: "latestNotActivatedPeserta",
        },
      },
    ]);
  },
};

export default {
  user: UserSchema,
  peserta: PesertaSchema,
  register: registerValidateSchema,
  login: loginValidateSchema,
};
