import dotenv from "dotenv";

dotenv.config();

const PORT: number | null = Number(process.env.PORT) || null;
const DATABASE_URL: string = process.env.DATABASE_URL || "";
const JWT_SECRET: string = process.env.JWT_SECRET || "";
const ADMIN_TOKEN: string = process.env.ADMIN_TOKEN || "";

// Pinata
const PINATA_JWT: string = process.env.PINATA_JWT || "";
const PINATA_GATEAWAY: string = process.env.PINATA_GATEAWAY || "";
const PINATA_URL: string = process.env.PINATA_URL || "";
const PINATA_GROUP_PRIVATE: string = process.env.PINATA_GROUP_PRIVATE || "";

// Cloudinary
const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "";
const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || "";
const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || "";

export {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  ADMIN_TOKEN,
  PINATA_GATEAWAY,
  PINATA_JWT,
  PINATA_URL,
  PINATA_GROUP_PRIVATE,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
};
