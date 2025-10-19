import mongoose from "mongoose";
import { ITOEFL } from "../utils/interface";
import dbSchema from "../utils/schema";

export const ToeflModel = mongoose.model<ITOEFL>("toefls", dbSchema.toefl);
