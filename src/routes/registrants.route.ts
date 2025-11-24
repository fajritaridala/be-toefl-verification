import { Router } from "express";
import registrantController from "../controllers/registrant.controller";
import aclMiddleware from "../middlewares/acl.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";

const router: Router = Router();

router.get("/", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  registrantController.listRegistrants,
]);

export default router;
