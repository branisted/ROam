import express from 'express';
import postsController from './posts.controller.js';
import upload from './posts.upload.js';

const router = express.Router();

router.post('/', upload.single('photo'), (req, res, next) => postsController.createPost(req, res, next));
router.get('/', (req, res, next) => postsController.getAllPosts(req, res, next));
router.get('/search', (req, res, next) => postsController.searchPosts(req, res, next));
router.get('/:id', (req, res, next) => postsController.getPostById(req, res, next));
router.put('/:id', (req, res, next) => postsController.updatePost(req, res, next));
router.delete('/:id', (req, res, next) => postsController.deletePost(req, res, next));
router.put('/:id/complete', (req, res, next) => postsController.markCompleted(req, res, next));
router.put('/:id/uncomplete', (req, res, next) => postsController.markUncompleted(req, res, next));
router.post('/:id/join', (req, res, next) => postsController.joinAdventure(req, res, next));
router.post('/:id/unjoin', (req, res, next) => postsController.unjoinAdventure(req, res, next));
router.get('/:id/participants', (req, res, next) => postsController.getParticipants(req, res, next));

export default router;