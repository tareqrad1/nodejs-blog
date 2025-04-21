import express from 'express';
import { commentOnPost, createPost, deleteMyComment, deletePost, getAllPosts, repliesOnComment, updatedViews, updatePost } from '../controllers/post.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';
const router = express.Router();

router.get('/', protectedRoute, getAllPosts);
router.post('/create', protectedRoute,createPost);

router.route('/:id')
    .patch(protectedRoute, updatePost)
    .delete(protectedRoute, deletePost)
    .post(protectedRoute, updatedViews)

router.route('/comment/:id')
    .post(protectedRoute, commentOnPost)
    .delete(protectedRoute, deleteMyComment)

router.post('/replay/:id', protectedRoute, repliesOnComment);

export default router;