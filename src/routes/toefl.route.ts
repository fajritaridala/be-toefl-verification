import express, { Router } from "express";
import scheduleController from "../controllers/toefl/schedule.controller";
// import toeflController from "../controllers/toefl.controller";
import serviceController from "../controllers/toefl/service.controller";
import aclMiddleware from "../middlewares/acl.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import uploadMiddleware from "../middlewares/media.middleware";
import { ROLES } from "../utils/constants";
import mediaMiddleware from "../middlewares/media.middleware";

const router: Router = express.Router();

// route layanan
router.post("/service", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  serviceController.create,
]);
router.get("/service", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  serviceController.findAll,
]);
router.put("/service/:id", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  serviceController.update,
]);
router.delete("/service/:id", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  serviceController.remove,
]);
// route peserta

// router.get("/", [
//   authMiddleware,
//   aclMiddleware([ROLES.ADMIN]),
//   toeflController.findAll,
// ]);

// router.post("/schedule", [
//   authMiddleware,
//   aclMiddleware([ROLES.ADMIN]),
//   toeflController.addSchedule,
// ]);
// router.post("/layanan", [
//   authMiddleware,
//   aclMiddleware([ROLES.ADMIN]),
//   toeflController.addLayanan,
// ]);
// router.post("/:address_peserta/register", [
//   authMiddleware,
//   aclMiddleware([ROLES.PESERTA]),
//   toeflController.register,
// ]);
// router.patch("/:address_peserta/input", [
//   authMiddleware,
//   aclMiddleware([ROLES.ADMIN]),
//   toeflController.input,
// ]);
// router.patch("/:address_peserta/upload-certificate", [
//   authMiddleware,
//   aclMiddleware([ROLES.ADMIN]),
//   uploadMiddleware.uploadSingle("file"),
//   toeflController.uploadCertificate,
// ]);

export default router;
