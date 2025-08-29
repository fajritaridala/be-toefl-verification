import express, { Router } from "express";
import authController from "../controllers/authController";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import participantController from "../controllers/participantController";
import mediaMiddleware from "../middlewares/upload.middleware";

const router: Router = express.Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Admin routes
router.get("/participants", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getAllPeserta,
]);
router.patch("/participants/:address/score", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.create,
]);
router.patch("/participants/:address/certificate", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  mediaMiddleware.uploadSingle("file"),
  participantController.uploadCertificateToPinata
])
router.get("/participants/overview", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getOverview,
]);
router.get("/participants/status/pending", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getPending,
]);
router.get("/participants/status/complete", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getComplete,
]);

export default router;
