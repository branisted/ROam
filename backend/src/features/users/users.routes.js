import express from 'express';
import usersController from './users.controller.js';
import { requireAuth } from '../../shared/middleware/authSession.js';

const router = express.Router();

router.get('/:id/profile', requireAuth, (req, res, next) => usersController.getProfile(req, res, next));
router.get('/:id/created-adventures', requireAuth, (req, res, next) => usersController.getCreatedAdventures(req, res, next));

export default router;