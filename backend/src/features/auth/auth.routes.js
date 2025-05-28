import express from 'express';
import authController from './auth.controller.js';

const router = express.Router();

router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/register', (req, res, next) => authController.register(req, res, next));

export default router;