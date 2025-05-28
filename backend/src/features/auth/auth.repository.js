import database from '../../config/database.js';

class AuthRepository {
    async findUserByUsername(username) {
        return await database.get(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
    }

    async findUserByEmail(email) {
        return await database.get(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
    }

    async createUser({ username, hashedPassword, full_name, city, email, bio, role }) {
        return await database.run(
            'INSERT INTO users (username, password, full_name, city, email, bio, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, full_name, city, email, bio || 'No bio.', role || 'explorer']
        );
    }
}

export default new AuthRepository();