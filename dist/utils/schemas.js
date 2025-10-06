"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constant_1 = require("../utils/constant");
const Schema = mongoose_1.default.Schema;
// base collection
const UserSchema = new Schema({
    address: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    fullName: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    role: {
        type: Schema.Types.String,
        enum: [constant_1.ROLES.ADMIN, constant_1.ROLES.PESERTA],
        default: constant_1.ROLES.PESERTA,
    },
}, {
    discriminatorKey: "role",
    collection: "users",
    timestamps: true,
});
// collection peserta
const PesertaSchema = new Schema({
    toefl_hash: {
        type: Schema.Types.String,
    },
    certificate: {
        type: Schema.Types.String,
    },
});
// toefl collection
const TOEFLSchema = new Schema({
    address_peserta: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    nama_lengkap: {
        type: Schema.Types.String,
        required: true,
    },
    jenis_kelamin: {
        type: Schema.Types.String,
        required: true,
    },
    tanggal_lahir: {
        type: Schema.Types.String,
        required: true,
    },
    nomor_induk_mahasiswa: {
        type: Schema.Types.String,
        unique: true,
        required: true,
    },
    fakultas: {
        type: Schema.Types.String,
        required: true,
    },
    program_studi: {
        type: Schema.Types.String,
        required: true,
    },
    status: {
        type: Schema.Types.String,
        required: true,
    },
    sesi_tes: {
        type: Schema.Types.String,
        required: true,
    },
    tanggal_tes: {
        type: Schema.Types.String,
        required: true,
    },
}, { timestamps: true });
// Text index to speed up name searches
TOEFLSchema.index({ nama_lengkap: "text" });
exports.default = {
    user: UserSchema,
    peserta: PesertaSchema,
    toefl: TOEFLSchema,
};
