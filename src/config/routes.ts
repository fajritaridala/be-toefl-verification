import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import enrollmentRoutes from "../modules/enrollment/enrollment.route";
import scheduleRoutes from "../modules/schedule/schedule.route";
import serviceRoutes from "../modules/service/service.route";

const router: Router = Router();
router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/enrollments", enrollmentRoutes);

export default router;
