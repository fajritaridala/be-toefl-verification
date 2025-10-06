"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = exports.PesertaModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schemas_1 = __importDefault(require("../utils/schemas"));
const constant_1 = require("../utils/constant");
const UserModel = mongoose_1.default.model('users', schemas_1.default.user);
exports.UserModel = UserModel;
const PesertaModel = UserModel.discriminator(constant_1.ROLES.PESERTA, schemas_1.default.peserta);
exports.PesertaModel = PesertaModel;
const AdminModel = UserModel.discriminator(constant_1.ROLES.ADMIN, schemas_1.default.user);
exports.AdminModel = AdminModel;
