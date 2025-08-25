import express from "express";
import authController from "../controllers/authController";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import dashboardController from "../controllers/dashboardController";
import participantController from "../controllers/participantController";

const router = express.Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Dashboad
router.get("/dashboard", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  dashboardController.Overview,
]);

// Participant
router.get("/participants", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getAll,
]);
router.get("/participants/unprocessed", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getUnprocessed,
]);
router.get("/participants/processed", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getProcessed,
]);

export default router;
