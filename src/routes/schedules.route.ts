import { Router } from "express";
import scheduleController from "../controllers/toefl/schedule.controller";
import aclMiddleware from "../middlewares/acl.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";
import mediaMiddleware from "../middlewares/media.middleware";

const router: Router = Router();

router.get("/", [authMiddleware, scheduleController.findAllSchedule]);

router.post("/", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  scheduleController.create,
]);

router.get("/registrants", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  scheduleController.findRegistrants,
]);

router.get("/history", [
  authMiddleware,
  aclMiddleware([ROLES.PESERTA]),
  scheduleController.getHistory,
]);

router.patch("/:schedule_id/registrants/:participant_id", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  scheduleController.setRegistrantScore,
]);

router.get("/:id/participants", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  scheduleController.findParticipantsByScheduleId,
]);

router.patch("/:id/register", [
  authMiddleware,
  aclMiddleware([ROLES.PESERTA]),
  mediaMiddleware.uploadSingle("file"),
  scheduleController.register,
]);

export default router;
