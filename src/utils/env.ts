import dotenv from "dotenv";

dotenv.config();

const PORT: number | null = Number(process.env.PORT) || null;
const DATABASE_URL: string = process.env.DATABASE_URL || "";
const JWT_SECRET: string = process.env.JWT_SECRET || "";

// Pinata
const PINATA_JWT: string = process.env.PINATA_JWT || "";
const PINATA_GATEAWAY: string = process.env.PINATA_GATEAWAY || "";
const PINATA_URL: string = process.env.PINATA_URL || "";
const PINATA_GROUP_PRIVATE: string = process.env.PINATA_GROUP_PRIVATE || "";

export {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  PINATA_GATEAWAY,
  PINATA_JWT,
  PINATA_URL,
  PINATA_GROUP_PRIVATE,
};
