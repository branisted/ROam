import postsRepository from './posts.repository.js';
import database from '../../config/database.js';

class PostsService {
    async createPost(post, file, req) {
        if (!post.starts_on) throw new Error('Start date is required');
        const photo = file
            ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            : null;
        const created_at = new Date().toISOString();
        const startsOn = post.starts_on.replace('T', ' ') + ':00';
        const is_joinable = typeof post.is_joinable !== "undefined" ? Number(post.is_joinable) : 0;
        const max_participants = post.max_participants ? Number(post.max_participants) : null;

        const postId = await postsRepository.createPost({
            ...post,
            photo,
            created_at,
            starts_on: startsOn,
            is_joinable,
            max_participants
        });
        return postId;
    }

    async getAllPosts() {
        return await postsRepository.getAllPosts();
    }

    async searchPosts(query) {
        return await postsRepository.searchPosts(query);
    }

    async getPostById(id) {
        const post = await postsRepository.getPostById(id);
        if (!post) throw new Error('Post not found');
        return post;
    }

    async updatePost(id, post, user_id) {
        const authorId = await postsRepository.getAuthorId(id);
        if (!authorId) throw new Error('Post not found');
        if (authorId !== user_id) throw new Error('Unauthorized');
        const startsOn = post.starts_on.replace('T', ' ') + ':00';
        await postsRepository.updatePost(id, { ...post, starts_on: startsOn });
    }

    async deletePost(id, user_id) {
        const authorId = await postsRepository.getAuthorId(id);
        if (!authorId) throw new Error('Post not found');
        if (authorId !== user_id) throw new Error('Unauthorized');
        await postsRepository.deletePost(id);
    }

    async markCompleted(id, user_id, completed) {
        const authorId = await postsRepository.getAuthorId(id);
        if (!authorId) throw new Error('Post not found');
        if (authorId !== user_id) throw new Error('Unauthorized');
        await postsRepository.markCompleted(id, completed);
    }

    async joinAdventure(postId, user_id) {
        // 1. Verify user role
        const user = await database.get(`SELECT role FROM users WHERE id = ?`, [user_id]);
        if (!user || user.role !== 'explorer') throw new Error('Only explorers can join adventures');

        // 2. Check adventure joinability
        const post = await postsRepository.getJoinableInfo(postId);
        if (!post || !post.is_joinable) throw new Error('Adventure not joinable');
        if (new Date(post.starts_on) <= new Date()) throw new Error('Adventure has already started');

        // 3. Check participant count
        const count = await postsRepository.countParticipants(postId);
        if (post.max_participants && count >= post.max_participants)
            throw new Error('Adventure is full');

        // 4. Insert participant
        try {
            await postsRepository.addParticipant(user_id, postId);
        } catch (err) {
            throw new Error('Failed to join adventure');
        }
    }

    async unjoinAdventure(postId, user_id) {
        await postsRepository.removeParticipant(user_id, postId);
    }

    async getParticipants(postId) {
        return await postsRepository.getParticipants(postId);
    }
}

export default new PostsService();