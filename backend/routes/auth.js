import express from 'express';
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    console.log('Received register request:', req.body);

    // Dummy response for now
    return res.status(200).json({ message: 'User registered successfully' });
});


export default router;
