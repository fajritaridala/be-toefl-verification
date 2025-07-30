import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "Toefl_Verification",
    });
    return Promise.resolve("Database connected!");
  } catch (error) {
    return Promise.reject(error);
  }
};

export default connectDB;
