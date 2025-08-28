import express, { Router } from "express";
import authController from "../controllers/authController";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import dashboardController from "../controllers/dashboardController";
import participantController from "../controllers/participantController";

const router: Router = express.Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Dashboad
router.get("/dashboard-overview", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  dashboardController.getDashboardOverview,
]);

// Participant
router.get("/participants", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getAllPeserta,
]);
router.get("/participants/status-pending", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getPending,
]);
router.get("/participants/status-complete", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getComplete,
]);
router.post("/participants/:address", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.create
])

export default router;
