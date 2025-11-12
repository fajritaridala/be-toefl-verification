import mongoose from "mongoose";
import { IService } from "../../interfaces/toefl.interface";
import { serviceSchema } from "../../schemas/toefl.schema";

export const ServiceModel = mongoose.model<IService>("services", serviceSchema);
