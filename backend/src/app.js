import express from 'express';
import cors from 'cors';
import session from './config/session.js'; // <--- NEW
import authRoutes from './features/auth/auth.routes.js';
import postsRoutes from './features/posts/posts.routes.js';
import usersRoutes from './features/users/users.routes.js';
import errorHandler from './shared/middleware/errorHandler.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Or your frontend domain
    credentials: true // <--- Allow cookies to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session); // <--- Add session middleware here

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
