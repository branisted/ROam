import express from 'express';
import cors from 'cors';
import authRoutes from './features/auth/auth.routes.js';
import errorHandler from './shared/middleware/errorHandler.js';
import postsRoutes from './features/posts/posts.routes.js';
import usersRoutes from './features/users/users.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

app.use(errorHandler);

export default app;