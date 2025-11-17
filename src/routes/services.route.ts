import express, { Router } from "express";
import serviceController from "../controllers/toefl/service.controller";
import aclMiddleware from "../middlewares/acl.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";

const router: Router = express.Router();

router.post("/", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  serviceController.create,
]);

router.get("/", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  serviceController.findAll,
]);

router.put("/:id", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  serviceController.update,
]);

router.delete("/:id", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  serviceController.remove,
]);

export default router;
