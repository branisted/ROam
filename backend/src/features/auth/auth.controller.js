import authService from './auth.service.js';

class AuthController {

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required.' });
            }
            const user = await authService.login(username, password);

            // Regenerate session ID to prevent fixation
            req.session.regenerate(err => {
                if (err) return next(err);
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    role: user.role
                };
                res.status(200).json({ message: 'Login successful', user: req.session.user });
            });
        } catch (error) {
            if (error.message === 'Invalid username or password') {
                return res.status(401).json({ message: error.message });
            }
            next(error);
        }
    }

    async logout(req, res, next) {
        req.session.destroy(err => {
            if (err) return next(err);
            res.clearCookie('connect.sid'); // Default cookie name
            res.json({ message: 'Logged out' });
        });
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

    async session(req, res) {
        if (req.session && req.session.user) {
            res.json({ user: req.session.user });
        } else {
            res.status(401).json({ user: null });
        }
    }

}

export default new AuthController();