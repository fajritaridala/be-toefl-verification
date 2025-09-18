import mongoose from 'mongoose';
import { ROLES } from '../utils/constant';
import { IUser, IPeserta, ITOEFL } from './interfaces';

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
    discriminatorKey: 'role',
    collection: 'users',
    timestamps: true,
  }
);

// collection peserta
const PesertaSchema = new Schema<IPeserta>({
  hashToefl: {
    type: Schema.Types.String,
  },
  cidCertificate: {
    type: Schema.Types.String,
  },
  isActivated: {
    type: Schema.Types.Boolean,
    default: false,
  },
});

// toefl collection
const TOEFLSchema = new Schema<ITOEFL>(
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
    nim: {
      type: Schema.Types.String,
      required: true,
    },
    major: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      required: true,
    },
    sessionTest: {
      type: Schema.Types.String,
      required: true,
    },
    testDate: {
      type: Schema.Types.Date,
      required: true,
    },
  },
  { timestamps: true }
);

// statics
PesertaSchema.statics = {
  getPesertaByActivated(isActivated: boolean) {
    return this.aggregate([
      { $match: { isActivated } },
      {
        $project: {
          address: '$address',
          fullName: '$fullName',
          email: '$email',
          isActivated: '$isActivated',
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
          activatedPeserta: { $sum: { $cond: ['$isActivated', 1, 0] } },
          notActivatedPeserta: { $sum: { $cond: ['$isActivated', 0, 1] } },
        },
      },
      {
        $project: {
          statistics: {
            pesertaTotal: '$pesertaTotal',
            activatedPeserta: '$activatedPeserta',
            notActivatedPeserta: '$notActivatedPeserta',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {},
          pipeline: [
            { $match: { isActivated: false } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $project: {
                _id: 0,
                address: '$address',
                fullName: '$fullName',
                email: '$email',
                isActivated: '$isActivated',
              },
            },
          ],
          as: 'latestNotActivatedPeserta',
        },
      },
    ]);
  },
  findToeflHashByAddress(address: string) {
    return this.find({}).select('hashToefl -_id');
  },
};

export default {
  user: UserSchema,
  peserta: PesertaSchema,
  toefl: TOEFLSchema,
};
