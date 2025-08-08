import express from "express";
import authController from "../controllers/authController";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/contant";
import dashboardController from "../controllers/dashboardController";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// admin routes
router.get("/admin/dashboard/unprocessed", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  dashboardController.getUnprocessParticipants,
]);
router.get("/admin/dashboard", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  dashboardController.getData,
]);

export default router;
