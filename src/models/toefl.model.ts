import mongoose from "mongoose";
import { ITOEFL } from "../utils/interfaces";
import dbSchema from "../utils/schemas";

export const ToeflModel = mongoose.model<ITOEFL>("toefls", dbSchema.toefl);
