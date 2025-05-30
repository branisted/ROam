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

    async getExplorerAdventures(userId) {
        // Upcoming: not completed, not cancelled, starts_on in the future
        const upcoming = await database.all(
            `SELECT posts.* FROM posts
         INNER JOIN adventure_participants ap ON posts.id = ap.post_id
         WHERE ap.user_id = ?
           AND posts.completed = 0
           AND posts.cancelled = 0
           AND datetime(posts.starts_on) > datetime('now')
         ORDER BY posts.starts_on ASC`,
            [userId]
        );

        // Completed: completed = 1
        const completed = await database.all(
            `SELECT posts.* FROM posts
         INNER JOIN adventure_participants ap ON posts.id = ap.post_id
         WHERE ap.user_id = ?
           AND posts.completed = 1
         ORDER BY posts.starts_on DESC`,
            [userId]
        );

        // Cancelled: cancelled = 1
        const cancelled = await database.all(
            `SELECT posts.* FROM posts
         INNER JOIN adventure_participants ap ON posts.id = ap.post_id
         WHERE ap.user_id = ?
           AND posts.cancelled = 1
         ORDER BY posts.starts_on DESC`,
            [userId]
        );

        return { upcoming, completed, cancelled };
    }
}

export default new UsersRepository();