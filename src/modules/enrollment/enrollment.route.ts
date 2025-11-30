import { Router } from "express";
import auth from "../../common/middlewares/auth.middleware";
import roleGuard from "../../common/middlewares/role.middleware";
import uploadMiddleware from "../../common/middlewares/upload.middleware";
import { ROLES } from "../../common/utils/constants";
import enrollmentController from "./enrollment.controller";

const router: Router = Router();
router.post("/:scheduleId", [
  auth.user,
  uploadMiddleware.single("file"),
  roleGuard(ROLES.PESERTA),
  enrollmentController.register,
]);
router.get("/", [
  auth.user,
  roleGuard(ROLES.ADMIN),
  enrollmentController.findAll,
]);
router.get("/:scheduleId", [
  auth.user,
  roleGuard(ROLES.ADMIN),
  enrollmentController.getScheduleParticipants,
]);
router.patch("/:enrollId/approval", [
  auth.user,
  roleGuard(ROLES.ADMIN),
  enrollmentController.approval,
]);
router.patch("/:participantId/submit-score", [
  auth.user,
  roleGuard(ROLES.ADMIN),
  enrollmentController.submitScore,
]);

export default router;
