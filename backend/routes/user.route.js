import express from 'express';
import { deleteMyAccount, getAllUsers, updateMyProfile } from '../controllers/user.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { adminRole } from '../middleware/role.js';

const router = express.Router();

router.post('/update', protectedRoute, updateMyProfile)
router.get('/', protectedRoute, adminRole, getAllUsers);
router.delete('/delete', protectedRoute, deleteMyAccount);

export default router;