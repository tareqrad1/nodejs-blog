import express from 'express';
import { checkAuth, login, logout, register } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';

const router = express.Router();

router.get('/check-auth', protectedRoute, checkAuth);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;