import session from 'express-session';

const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'your-very-secret-key', // Use env var in production!
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

export default session(sessionOptions);