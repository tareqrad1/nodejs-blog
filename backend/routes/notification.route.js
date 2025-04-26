import express from 'express';
import { getAllNotifications } from '../controllers/notification.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';

const router = express.Router();

router.get('/', protectedRoute, getAllNotifications);

export default router;