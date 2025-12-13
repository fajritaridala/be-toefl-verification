import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

const dbConnect = async () => {
  try {
    // DATABASE_URL is validated at startup in config/env.ts
    await mongoose.connect(DATABASE_URL!, {
      dbName: "toefl_verification_dev",
    });
    return Promise.resolve("Database connected!");
  } catch (error) {
    return Promise.reject(error);
  }
};

export default dbConnect;
