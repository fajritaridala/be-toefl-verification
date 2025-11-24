import { Router } from "express";
import scheduleController from "../controllers/schedule.controller";
import aclMiddleware from "../middlewares/acl.middleware";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middlewares/auth.middleware";
import mediaMiddleware from "../middlewares/media.middleware";
import { ROLES } from "../utils/constants";

const router: Router = Router();

router.get("/", [optionalAuthMiddleware, scheduleController.listSchedules]);

router.post("/", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  scheduleController.createSchedule,
]);

router.get("/:scheduleId/participants", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  scheduleController.listScheduleParticipants,
]);

router.patch("/:scheduleId/participants", [
  authMiddleware,
  aclMiddleware([ROLES.PESERTA]),
  mediaMiddleware.uploadSingle("file"),
  scheduleController.registerParticipant,
]);

router.patch("/:scheduleId/participants/:participantId/scores", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  scheduleController.updateParticipantScore,
]);

export default router;
