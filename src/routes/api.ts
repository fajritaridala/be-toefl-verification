import express from "express";
import authController from "../controllers/authController";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/contant";
import dashboardController from "../controllers/dashboardController";

const router = express.Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Admin routes
router.get("/admin/participants", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  dashboardController.getParticipants,
]);
router.get("/admin/participants/unprocessed", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  dashboardController.getUnprocessedParticipants,
]);
router.get("/admin/dashboard", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  dashboardController.getDashboard,
]);

export default router;
