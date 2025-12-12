import { Router } from "express";
import auth from "../../common/middlewares/auth.middleware";
import roleGuard from "../../common/middlewares/role.middleware";
import { ROLES } from "../../common/utils/constants";
import scheduleController from "./schedule.controller";

const router: Router = Router();
router.post("/", [
  auth.user,
  roleGuard(ROLES.ADMIN),
  scheduleController.create,
]);
router.get("/", auth.optional, scheduleController.findAll);
router.patch("/:scheduleId", [
  auth.user,
  roleGuard(ROLES.ADMIN),
  scheduleController.update,
]);
router.delete("/:scheduleId", [
  auth.user,
  roleGuard(ROLES.ADMIN),
  scheduleController.remove,
]);

export default router;
