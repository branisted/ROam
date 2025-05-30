import database from '../../config/database.js';

class PostsRepository {
    async createPost(post) {
        const {
            title, location, type, difficulty, estimated_duration,
            photo, description, created_at, author_id,
            starts_on, is_joinable, max_participants
        } = post;

        const result = await database.run(
            `INSERT INTO posts (
                title, location, type, difficulty, estimated_duration,
                photo, description, created_at, author_id,
                starts_on, is_joinable, max_participants
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, location, type, difficulty, estimated_duration,
                photo, description, created_at, author_id,
                starts_on, is_joinable, max_participants
            ]
        );
        return result.id;
    }

    async getAllPosts() {
        return await database.all(
            `SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id`
        );
    }

    async searchPosts({ title, type, difficulty }) {
        let query = `SELECT * FROM posts WHERE 1=1`;
        const params = [];
        if (title) {
            query += ` AND LOWER(title) LIKE ?`;
            params.push(`%${title.toLowerCase()}%`);
        }
        if (type) {
            query += ` AND type = ?`;
            params.push(type);
        }
        if (difficulty) {
            query += ` AND difficulty = ?`;
            params.push(difficulty);
        }
        return await database.all(query, params);
    }

    async getPostById(id) {
        return await database.get(`SELECT * FROM posts WHERE id = ?`, [id]);
    }

    async updatePost(id, post) {
        const {
            title, location, type, difficulty, estimated_duration,
            description, max_participants, starts_on
        } = post;
        return await database.run(
            `UPDATE posts SET
        title = ?, location = ?, type = ?, difficulty = ?,
        estimated_duration = ?, description = ?, max_participants = ?, starts_on = ?
      WHERE id = ?`,
            [
                title, location, type, difficulty, estimated_duration,
                description, max_participants, starts_on, id
            ]
        );
    }

    async deletePost(id) {
        return await database.run(`DELETE FROM posts WHERE id = ?`, [id]);
    }

    async getAuthorId(postId) {
        const row = await database.get(`SELECT author_id FROM posts WHERE id = ?`, [postId]);
        return row ? row.author_id : null;
    }

    // posts.repository.js

    async markCompleted(id, completed) {
        // If marking as completed, set cancelled to 0
        if (completed) {
            return await database.run(
                `UPDATE posts SET completed = 1, cancelled = 0 WHERE id = ?`,
                [id]
            );
        } else {
            return await database.run(
                `UPDATE posts SET completed = 0 WHERE id = ?`,
                [id]
            );
        }
    }

    async markCancelled(id, cancelled) {
        // If marking as cancelled, set completed to 0
        if (cancelled) {
            return await database.run(
                `UPDATE posts SET cancelled = 1, completed = 0 WHERE id = ?`,
                [id]
            );
        } else {
            return await database.run(
                `UPDATE posts SET cancelled = 0 WHERE id = ?`,
                [id]
            );
        }
    }

    // Adventure participants
    async countParticipants(postId) {
        const row = await database.get(
            `SELECT COUNT(*) as count FROM adventure_participants WHERE post_id = ?`,
            [postId]
        );
        return row.count;
    }

    async addParticipant(userId, postId) {
        return await database.run(
            `INSERT INTO adventure_participants (user_id, post_id) VALUES (?, ?)`,
            [userId, postId]
        );
    }

    async removeParticipant(userId, postId) {
        return await database.run(
            `DELETE FROM adventure_participants WHERE user_id = ? AND post_id = ?`,
            [userId, postId]
        );
    }

    async getParticipants(postId) {
        return await database.all(
            `SELECT users.id, users.username, users.email
      FROM adventure_participants
      JOIN users ON users.id = adventure_participants.user_id
      WHERE adventure_participants.post_id = ?`,
            [postId]
        );
    }

    async getJoinableInfo(postId) {
        return await database.get(
            `SELECT is_joinable, max_participants, starts_on FROM posts WHERE id = ?`,
            [postId]
        );
    }
}

export default new PostsRepository();