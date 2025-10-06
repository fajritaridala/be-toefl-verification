"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidateSchema = exports.toeflValidateSchema = exports.loginValidateSchema = exports.registerValidateSchema = void 0;
const Yup = __importStar(require("yup"));
const constant_1 = require("./constant");
// register schema
const registerValidateSchema = Yup.object({
    address: Yup.string().required(),
    fullName: Yup.string().required(),
    email: Yup.string().email().required(),
    roleToken: Yup.string().notRequired(),
});
exports.registerValidateSchema = registerValidateSchema;
const loginValidateSchema = Yup.object({
    address: Yup.string().required(),
});
exports.loginValidateSchema = loginValidateSchema;
const inputValidateSchema = Yup.object({
    address_peserta: Yup.string().required(),
    nama_lengkap: Yup.string().required(),
    jenis_kelamin: Yup.string().required(),
    tanggal_lahir: Yup.string().required(),
    nomor_induk_mahasiswa: Yup.string().required(),
    fakultas: Yup.string().required(),
    program_studi: Yup.string().required(),
    sesi_tes: Yup.string().required(),
    tanggal_tes: Yup.string().required(),
    nilai_listening: Yup.number().required(),
    nilai_reading: Yup.number().required(),
    nilai_structure: Yup.number().required(),
    nilai_total: Yup.number().required(),
});
exports.inputValidateSchema = inputValidateSchema;
const toeflValidateSchema = Yup.object({
    address_peserta: Yup.string().required(),
    nama_lengkap: Yup.string().required(),
    jenis_kelamin: Yup.string().required(),
    tanggal_lahir: Yup.string().required(),
    nomor_induk_mahasiswa: Yup.string().required(),
    fakultas: Yup.string().required(),
    program_studi: Yup.string().required(),
    sesi_tes: Yup.string().required(),
    tanggal_tes: Yup.string().required(),
    status: Yup.string().default(constant_1.STATUS.BELUM_SELESAI).required(),
});
exports.toeflValidateSchema = toeflValidateSchema;
