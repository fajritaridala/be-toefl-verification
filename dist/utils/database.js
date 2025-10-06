"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(env_1.DATABASE_URL, {
            dbName: "Toefl_Verification",
        });
        return Promise.resolve("Database connected!");
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.default = connectDB;
