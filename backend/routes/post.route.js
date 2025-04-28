import express from 'express';
import { commentOnPost, createPost, deleteMyComment, deletePost, getAllPosts, getOnePost, likeUnlikePosts, repliesOnComment, updatePost } from '../controllers/post.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';
const router = express.Router();

router.get('/', protectedRoute, getAllPosts);
router.post('/create', protectedRoute,createPost);

router.route('/:id')
    .get(protectedRoute, getOnePost)
    .patch(protectedRoute, updatePost)
    .delete(protectedRoute, deletePost)

router.route('/comment/:id')
    .post(protectedRoute, commentOnPost)
    .delete(protectedRoute, deleteMyComment)

router.post('/replay/:id', protectedRoute, repliesOnComment);

router.post('/like/:id', protectedRoute, likeUnlikePosts);

export default router;