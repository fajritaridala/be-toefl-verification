import express, { Router } from "express";
import authController from "../controllers/authController";
import toeflController from "../controllers/toeflController";
import aclMiddleware from "../middlewares/acl.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import mediaMiddleware from "../middlewares/upload.middleware";
import { ROLES } from "../utils/constant";

const router: Router = express.Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);

// TOEFL router
router.get("/toefls", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  toeflController.findAll,
]);
router.post("/toefls/:address_peserta/register", [
  authMiddleware,
  aclMiddleware([ROLES.PESERTA]),
  toeflController.register,
]);
router.patch("/toefls/:address_peserta/input", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  toeflController.input,
]);
router.patch("/toefls/:address_peserta/upload-certificate", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  mediaMiddleware.uploadSingle("file"),
  toeflController.uploadCertificate,
]);
export default router;
