"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PINATA_GROUP_PRIVATE = exports.PINATA_URL = exports.PINATA_JWT = exports.PINATA_GATEAWAY = exports.MAX_PDF_SIZE = exports.JWT_SECRET = exports.DATABASE_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DATABASE_URL = process.env.DATABASE_URL || '';
exports.DATABASE_URL = DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET || '';
exports.JWT_SECRET = JWT_SECRET;
// Pinata
const PINATA_JWT = process.env.PINATA_JWT || '';
exports.PINATA_JWT = PINATA_JWT;
const PINATA_GATEAWAY = process.env.PINATA_GATEAWAY || "";
exports.PINATA_GATEAWAY = PINATA_GATEAWAY;
const PINATA_URL = process.env.PINATA_URL || '';
exports.PINATA_URL = PINATA_URL;
const PINATA_GROUP_PRIVATE = process.env.PINATA_GROUP_PRIVATE || '';
exports.PINATA_GROUP_PRIVATE = PINATA_GROUP_PRIVATE;
const MAX_PDF_SIZE = Number(process.env.MAX_PDF_SIZE) || 3000000;
exports.MAX_PDF_SIZE = MAX_PDF_SIZE;
