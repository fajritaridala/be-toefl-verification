import express, { Router } from 'express';
import authController from '../controllers/authController';
import authMiddleware from '../middlewares/auth.middleware';
import aclMiddleware from '../middlewares/acl.middleware';
import { ROLES } from '../utils/constant';
import participantController from '../controllers/participantController';
import mediaMiddleware from '../middlewares/upload.middleware';
import toeflController from '../controllers/toeflController';

const router: Router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

// Admin routes
router.get('/participants', [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getAllPeserta,
]);
router.patch('/participants/:address/score', [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.create,
]);
router.patch('/participants/:address/certificate', [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  mediaMiddleware.uploadSingle('file'),
  participantController.uploadCertificateToPinata,
]);
router.get('/participants/overview', [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getOverview,
]);
router.get('/participants/status/pending', [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getPending,
]);
router.get('/participants/status/complete', [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  participantController.getComplete,
]);

// TOEFL router
router.post('/toefls/:address/register', [
  authMiddleware,
  aclMiddleware([ROLES.PESERTA]),
  toeflController.register,
]);
router.get('/toefls', [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN]),
  toeflController.findAll,
]);
export default router;
