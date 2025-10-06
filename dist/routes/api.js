"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const toeflController_1 = __importDefault(require("../controllers/toeflController"));
const acl_middleware_1 = __importDefault(require("../middlewares/acl.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const constant_1 = require("../utils/constant");
const router = express_1.default.Router();
// Auth routes
router.post("/auth/register", authController_1.default.register);
router.post("/auth/login", authController_1.default.login);
router.get("/auth/me", auth_middleware_1.default, authController_1.default.me);
// TOEFL router
router.get("/toefls", [
    auth_middleware_1.default,
    (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN]),
    toeflController_1.default.findAll,
]);
router.post("/toefls/:address_peserta/register", [
    auth_middleware_1.default,
    (0, acl_middleware_1.default)([constant_1.ROLES.PESERTA]),
    toeflController_1.default.register,
]);
router.patch("/toefls/:address_peserta/input", [
    auth_middleware_1.default,
    (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN]),
    toeflController_1.default.input,
]);
router.patch("/toefls/:address_peserta/upload-certificate", [
    auth_middleware_1.default,
    (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN]),
    upload_middleware_1.default.uploadSingle("file"),
    toeflController_1.default.uploadCertificate,
]);
exports.default = router;
