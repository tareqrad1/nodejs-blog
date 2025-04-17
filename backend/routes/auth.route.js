import express from 'express';
import { checkAuth, login, logout, register, verifyEmail } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';

const router = express.Router();

router.get('/check-auth', protectedRoute, checkAuth);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.post('/verify-email', verifyEmail);

export default router;