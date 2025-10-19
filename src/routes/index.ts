import express, { Router } from "express";
import authRoutes from "./auth.route";
import toeflRoutes from "./toefl.route";

const router: Router = express.Router();
console.log("hit");
router.use("/auth", authRoutes);
router.use("/toefls", toeflRoutes);

export default router;
