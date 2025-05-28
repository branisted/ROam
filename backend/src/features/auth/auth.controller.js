import authService from './auth.service.js';

class AuthController {
    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required.' });
            }
            const user = await authService.login(username, password);
            res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
            if (error.message === 'Invalid username or password') {
                return res.status(401).json({ message: error.message });
            }
            next(error);
        }
    }

    async register(req, res, next) {
        try {
            const { username, password, full_name, city, email, bio, role } = req.body;
            if (!username || !password || !full_name || !city || !email) {
                return res.status(400).json({ message: 'All required fields must be provided.' });
            }
            await authService.register({ username, password, full_name, city, email, bio, role });
            res.status(201).json({ message: 'User registered successfully.' });
        } catch (error) {
            if (
                error.message === 'Username already registered.' ||
                error.message === 'Email already registered.'
            ) {
                return res.status(400).json({ message: error.message });
            }
            next(error);
        }
    }
}

export default new AuthController();