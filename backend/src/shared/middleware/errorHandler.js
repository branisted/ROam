export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.message === 'Invalid username or password') {
        return res.status(401).json({ message: err.message });
    }

    if (err.message === 'Email already registered' || err.message === 'Username already taken') {
        return res.status(409).json({ message: err.message });
    }

    if (err.message === 'User not found') {
        return res.status(404).json({ message: err.message });
    }

    // Default error
    res.status(500).json({
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
};

export default errorHandler;