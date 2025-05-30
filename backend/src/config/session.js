import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = createClient({ url: redisURL });

await redisClient.connect(); // Make sure to await connection in top-level async context

export default session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        path: '/',
        sameSite: 'lax', // or 'strict' for more security
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
});