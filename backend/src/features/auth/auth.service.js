import bcrypt from 'bcrypt';
import authRepository from './auth.repository.js';

class AuthService {
    async login(username, password) {
        const user = await authRepository.findUserByUsername(username);
        if (!user) {
            throw new Error('Invalid username or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid username or password');
        }
        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async register({ username, password, full_name, city, email, bio, role }) {
        // Check if username or email already exists
        const existingUser = await authRepository.findUserByUsername(username);
        if (existingUser) {
            throw new Error('Username already registered.');
        }
        const existingEmail = await authRepository.findUserByEmail(email);
        if (existingEmail) {
            throw new Error('Email already registered.');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await authRepository.createUser({
            username,
            hashedPassword,
            full_name,
            city,
            email,
            bio,
            role,
        });
        return { username, email, role };
    }
}

export default new AuthService();