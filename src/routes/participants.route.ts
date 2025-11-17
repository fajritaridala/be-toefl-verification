import { Router } from "express";
import participantController from "../controllers/participant.controller";
import aclMiddleware from "../middlewares/acl.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";

const router: Router = Router();

router.get("/history", [
  authMiddleware,
  aclMiddleware([ROLES.PESERTA]),
  participantController.listParticipantHistory,
]);

export default router;
