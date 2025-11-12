import express, { Router } from "express";
import authRoutes from "./auth.route";
import toeflRoutes from "./toefl.route";

const router: Router = express.Router();
router.use("/auth", authRoutes);
router.use("/toefl", toeflRoutes);

export default router;
