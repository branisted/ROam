import express from 'express';
import usersController from './users.controller.js';

const router = express.Router();

router.get('/:id/profile', (req, res, next) => usersController.getProfile(req, res, next));
router.get('/:id/created-adventures', (req, res, next) => usersController.getCreatedAdventures(req, res, next));

export default router;