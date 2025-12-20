import { Router } from "express";
import aeController from "../../modules/aeController";
import authRoutes from "../../modules/auth/auth.route";
import enrollmentRoutes from "../../modules/enrollment/enrollment.route";
import scheduleRoutes from "../../modules/schedule/schedule.route";
import serviceRoutes from "../../modules/service/service.route";
import userRoutes from "../../modules/user/user.route";
import verificationRoutes from "../../modules/verification/verify.route";

const router: Router = Router();
router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/verifications", verificationRoutes);
router.use("/users", userRoutes);
router.get("/bdr", aeController.bdr);

export default router;
