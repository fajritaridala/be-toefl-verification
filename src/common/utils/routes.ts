import { Router } from "express";
import authRoutes from "../../modules/auth/auth.route";
import enrollmentRoutes from "../../modules/enrollment/enrollment.route";
import scheduleRoutes from "../../modules/schedule/schedule.route";
import serviceRoutes from "../../modules/service/service.route";
import verificationRoutes from "../../modules/verification/verify.route";

const router: Router = Router();
router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/verifications", verificationRoutes);

export default router;
