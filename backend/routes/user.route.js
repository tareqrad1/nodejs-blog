import express from 'express';
import { deleteMyAccount, getAllUsers, updateMyProfile } from '../controllers/user.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { adminRole } from '../middleware/role.js';

const router = express.Router();

router.post('/update-profile', protectedRoute, updateMyProfile)
router.get('/all-users', protectedRoute, adminRole, getAllUsers);
router.delete('/delete-account', protectedRoute, deleteMyAccount);

export default router;