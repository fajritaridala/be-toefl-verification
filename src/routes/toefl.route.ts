import express, { Router } from "express";
import toeflController from "../controllers/toefl.controller";
import aclMiddleware from "../middlewares/acl.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import uploadMiddleware from "../middlewares/media.middleware";
import { ROLES } from "../utils/constants";

const router: Router = express.Router();

router.get("/", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  toeflController.findAll,
]);
router.post("/:address_peserta/register", [
  authMiddleware,
  aclMiddleware([ROLES.PESERTA]),
  toeflController.register,
]);
router.patch("/:address_peserta/input", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  toeflController.input,
]);
router.patch("/:address_peserta/upload-certificate", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  uploadMiddleware.uploadSingle("file"),
  toeflController.uploadCertificate,
]);

export default router;
