"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = generateHash;
const crypto_1 = __importDefault(require("crypto"));
// memastikan urutan dari data yg akan dihash
const constantStringify = (obj) => {
    const allKeys = Object.keys(obj).sort();
    const result = {};
    for (const k of allKeys)
        result[k] = obj[k];
    return JSON.stringify(result);
};
function generateHash(input) {
    const data = constantStringify(input);
    return crypto_1.default.createHash("sha256").update(data).digest("hex");
}
