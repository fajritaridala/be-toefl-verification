"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToeflModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schemas_1 = __importDefault(require("../utils/schemas"));
exports.ToeflModel = mongoose_1.default.model("toefls", schemas_1.default.toefl);
