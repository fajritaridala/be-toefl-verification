"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Replaced heavy moment with native date helpers in utils/date
const toefl_model_1 = require("../models/toefl.model");
const user_model_1 = require("../models/user.model");
const constant_1 = require("../utils/constant");
const date_1 = __importDefault(require("../utils/date"));
const hashes_1 = require("../utils/hashes");
const uploader_1 = __importDefault(require("../utils/uploader"));
const validates_1 = require("../utils/validates");
exports.default = {
    async findAll(req, res) {
        const { page, limit, search } = req.query;
        // sanitize pagination values
        const safeLimit = Math.max(1, Math.min(Number(limit) || 10, 100));
        const safePage = Math.max(1, Number(page) || 1);
        try {
            const query = {};
            if (search) {
                Object.assign(query, {
                    $text: { $search: search },
                });
            }
            const [result, count] = await Promise.all([
                toefl_model_1.ToeflModel.find(query)
                    .limit(safeLimit)
                    .skip((safePage - 1) * safeLimit)
                    .sort({ createdAt: -1 })
                    .lean() // reduce memory and skip hydration
                    .exec(),
                toefl_model_1.ToeflModel.countDocuments(query),
            ]);
            const pagination = {
                total: count,
                totalPages: Math.ceil(count / safeLimit),
                current: safePage,
            };
            res.status(200).json({
                message: "data successfully received",
                data: result,
                pagination: pagination,
            });
        }
        catch (error) {
            const err = error;
            res.status(500).json({
                message: err.message,
                data: null,
            });
        }
    },
    async register(req, res) {
        try {
            const { address_peserta } = req.params;
            const { nama_lengkap, jenis_kelamin, tanggal_lahir, nomor_induk_mahasiswa, fakultas, program_studi, sesi_tes, } = req.body;
            const result = {
                address_peserta,
                nama_lengkap,
                jenis_kelamin,
                tanggal_lahir,
                nomor_induk_mahasiswa,
                fakultas,
                program_studi,
                sesi_tes,
                tanggal_tes: Math.floor(Date.now() / 1000),
                status: constant_1.STATUS.BELUM_SELESAI,
            };
            await validates_1.toeflValidateSchema.validate(result);
            const existingAddress = await toefl_model_1.ToeflModel.findOne({ address_peserta });
            const existingNIM = await toefl_model_1.ToeflModel.findOne({ nomor_induk_mahasiswa });
            if (existingAddress)
                throw new Error("address peserta telah terdaftar");
            if (existingNIM)
                throw new Error("NIM telah terdaftar");
            // ubah Date() ke string
            const tanggalTes = date_1.default.numberToString(result.tanggal_tes);
            // ubah string ke Date()
            const tanggalLahir = date_1.default.stringToNumber(result.tanggal_lahir);
            const sendToDb = {
                ...result,
                tanggal_tes: tanggalTes,
            };
            await toefl_model_1.ToeflModel.create(sendToDb);
            res.status(201).json({
                message: "toefl register successfully",
                data: {
                    ...result,
                    tanggal_lahir: tanggalLahir,
                },
            });
        }
        catch (error) {
            const err = error;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    },
    async input(req, res) {
        try {
            const { address_peserta } = req.params;
            const { nilai_listening, nilai_structure, nilai_reading } = req.body;
            const peserta = await toefl_model_1.ToeflModel.findOne({ address_peserta }).lean();
            if (!peserta) {
                return res.status(404).json({
                    message: "peserta not found",
                    data: null,
                });
            }
            const nilai_total = 300 + nilai_listening + nilai_structure + nilai_reading;
            const result = {
                address_peserta,
                nama_lengkap: peserta.nama_lengkap,
                jenis_kelamin: peserta.jenis_kelamin,
                tanggal_lahir: peserta.tanggal_lahir,
                nomor_induk_mahasiswa: peserta.nomor_induk_mahasiswa,
                fakultas: peserta.fakultas,
                program_studi: peserta.program_studi,
                sesi_tes: peserta.sesi_tes,
                tanggal_tes: peserta.tanggal_tes,
                nilai_listening,
                nilai_structure,
                nilai_reading,
                nilai_total,
            };
            await validates_1.inputValidateSchema.validate(result);
            const hash = (0, hashes_1.generateHash)(result);
            const toefl_hash = "0x" + hash;
            await user_model_1.PesertaModel.findOneAndUpdate({ address: address_peserta }, {
                $set: { toefl_hash },
            });
            const tanggalLahir = date_1.default.stringToNumber(result.tanggal_lahir);
            const tanggalTes = date_1.default.stringToNumber(result.tanggal_tes);
            res.status(201).json({
                message: "success input data",
                data: {
                    peserta: {
                        ...result,
                        tanggal_tes: tanggalTes,
                        tanggal_lahir: tanggalLahir,
                    },
                    toefl_hash,
                },
            });
        }
        catch (error) {
            const err = error;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    },
    async uploadCertificate(req, res) {
        if (!req.file) {
            res.status(400).json({
                message: "file not found",
                data: null,
            });
        }
        try {
            const { address_peserta } = req.params;
            const peserta = await toefl_model_1.ToeflModel.findOne({ address_peserta }).lean();
            if (!peserta) {
                res.status(404).json({
                    message: "peserta not found",
                    data: null,
                });
            }
            const upload = await uploader_1.default.uploadCertificate(req.file);
            const { cid, url, size } = upload;
            await toefl_model_1.ToeflModel.findOneAndUpdate({ address_peserta }, {
                $set: { status: "selesai" },
            });
            await user_model_1.PesertaModel.findOneAndUpdate({ address: address_peserta }, { $set: { certificate: cid } });
            const result = {
                cid,
                url,
                size,
            };
            res.status(201).json({
                message: "success upload certificate",
                data: result,
            });
        }
        catch (error) {
            const err = error;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    },
};
