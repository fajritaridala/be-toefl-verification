import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import pinata from "../../config/pinata";

const checkHealth = {
  database: () => {
    return mongoose.connection.readyState === 1;
  },
  pinata: async () => {
    try {
      const auth = await pinata.testAuthentication();
      return auth;
    } catch (error) {
      return false;
    }
  },
  claudinary: async () => {
    try {
      const result = await cloudinary.api.ping();
      return result;
    } catch (error) {
      return false;
    }
  },
};

export default checkHealth;
