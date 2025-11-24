import express, { Router } from "express";
import serviceController from "../controllers/service.controller";
import aclMiddleware from "../middlewares/acl.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";

const router: Router = express.Router();

router.post("/", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  serviceController.createService,
]);

router.get("/", serviceController.listServices);

router.patch("/:id", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  serviceController.updateService,
]);

router.delete("/:id", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  serviceController.deleteService,
]);

export default router;
