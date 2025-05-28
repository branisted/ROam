import database from '../../config/database.js';

class UsersRepository {
    async getUserById(id) {
        return await database.get(
            'SELECT id, username, email, role FROM users WHERE id = ?',
            [id]
        );
    }

    async getJoinedPosts(userId) {
        return await database.all(
            `SELECT posts.*
       FROM posts
       INNER JOIN adventure_participants ap ON posts.id = ap.post_id
       WHERE ap.user_id = ?`,
            [userId]
        );
    }

    async getCreatedAdventures(userId) {
        return await database.all(
            `SELECT * FROM posts WHERE author_id = ? ORDER BY created_at DESC`,
            [userId]
        );
    }
}

export default new UsersRepository();