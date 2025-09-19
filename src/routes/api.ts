import express, { Router } from 'express';
import authController from '../controllers/authController';
import authMiddleware from '../middlewares/auth.middleware';
import aclMiddleware from '../middlewares/acl.middleware';
import { ROLES } from '../utils/constant';
import mediaMiddleware from '../middlewares/upload.middleware';
import toeflController from '../controllers/toeflController';

const router: Router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

// TOEFL router
router.get('/toefls', [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  toeflController.findAll,
]);
router.post('/toefls/:address/register', [
  authMiddleware,
  aclMiddleware([ROLES.PESERTA]),
  toeflController.register,
]);
router.patch('/toefls/:address/input', [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  toeflController.input,
]);
router.patch('/toefls/:address/upload-certificate', [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  mediaMiddleware.uploadSingle('file'),
  toeflController.uploadCertificate,
]);
export default router;
