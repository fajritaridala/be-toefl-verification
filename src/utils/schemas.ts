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
  hash: {
    type: Schema.Types.String,
  },
  certificate: {
    type: Schema.Types.String,
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

export default {
  user: UserSchema,
  peserta: PesertaSchema,
  toefl: TOEFLSchema,
};
