import express, { Router } from "express";
import authRoutes from "./auth.route";
import schedulesRoutes from "./schedules.route";
import servicesRoutes from "./services.route";
import toeflRoutes from "./toefl.route";

const router: Router = express.Router();
router.use("/auth", authRoutes);
router.use("/toefl", toeflRoutes);
router.use("/services", servicesRoutes);
router.use("/schedules", schedulesRoutes);

export default router;
