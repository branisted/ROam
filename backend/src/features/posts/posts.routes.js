import express from 'express';
import postsController from './posts.controller.js';
import upload from './posts.upload.js';
import { requireAuth } from '../../shared/middleware/authSession.js';

const router = express.Router();

router.post('/', upload.single('photo'), requireAuth, (req, res, next) => postsController.createPost(req, res, next));
router.get('/', (req, res, next) => postsController.getAllPosts(req, res, next));
router.get('/search', requireAuth, (req, res, next) => postsController.searchPosts(req, res, next));
router.get('/:id', (req, res, next) => postsController.getPostById(req, res, next));
router.put('/:id', (req, res, next) => postsController.updatePost(req, res, next));
router.delete('/:id', (req, res, next) => postsController.deletePost(req, res, next));
router.put('/:id/complete', requireAuth, (req, res, next) => postsController.markCompleted(req, res, next));
router.put('/:id/uncomplete', requireAuth, (req, res, next) => postsController.markUncompleted(req, res, next));
router.put('/:id/cancel', requireAuth, (req, res, next) => postsController.markCancelled(req, res, next));
router.post('/:id/join', requireAuth, (req, res, next) => postsController.joinAdventure(req, res, next));
router.post('/:id/unjoin', requireAuth, (req, res, next) => postsController.unjoinAdventure(req, res, next));
router.get('/:id/participants', requireAuth, (req, res, next) => postsController.getParticipants(req, res, next));

export default router;