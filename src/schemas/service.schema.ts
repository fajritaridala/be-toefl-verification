import mongoose from "mongoose";
import { IService } from "../interfaces/service.interface";

const { Schema } = mongoose;

export const serviceSchema = new Schema<IService>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    price: {
      type: Schema.Types.Number,
      required: true,
    },
    duration: {
      type: Schema.Types.Number,
      required: true,
    },
    notes: {
      type: Schema.Types.String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);
