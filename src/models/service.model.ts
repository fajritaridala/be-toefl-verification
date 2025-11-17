import mongoose from "mongoose";
import { IService } from "../interfaces/service.interface";
import { serviceSchema } from "../schemas/service.schema";

export const ServiceModel = mongoose.model<IService>("services", serviceSchema);
