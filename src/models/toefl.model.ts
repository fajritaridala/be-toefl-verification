import mongoose from 'mongoose';
import dbSchema from '../utils/schemas';
import { ITOEFL } from '../utils/interfaces';

export const ToeflModel = mongoose.model<ITOEFL>('toefl', dbSchema.toefl);
