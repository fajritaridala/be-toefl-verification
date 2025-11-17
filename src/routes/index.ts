import express, { Router } from "express";
import authRoutes from "./auth.route";
import participantsRoutes from "./participants.route";
import registrantsRoutes from "./registrants.route";
import schedulesRoutes from "./schedules.route";
import servicesRoutes from "./services.route";

const router: Router = express.Router();
router.use("/auth", authRoutes);
router.use("/services", servicesRoutes);
router.use("/schedules", schedulesRoutes);
router.use("/registrants", registrantsRoutes);
router.use("/participants", participantsRoutes);

export default router;
