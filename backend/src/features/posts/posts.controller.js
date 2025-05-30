import postsService from './posts.service.js';

class PostsController {
    async createPost(req, res, next) {
        try {
            const userId = req.session.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const postId = await postsService.createPost(req.body, req.file, req, userId);
            res.status(201).json({ message: 'Post created', postId });
        } catch (err) {
            next(err);
        }
    }

    async getAllPosts(req, res, next) {
        try {
            const posts = await postsService.getAllPosts();
            res.json(posts);
        } catch (err) {
            next(err);
        }
    }

    async searchPosts(req, res, next) {
        try {
            const posts = await postsService.searchPosts(req.query);
            res.json(posts);
        } catch (err) {
            next(err);
        }
    }

    async getPostById(req, res, next) {
        try {
            const post = await postsService.getPostById(req.params.id);
            res.json(post);
        } catch (err) {
            next(err);
        }
    }

    async updatePost(req, res, next) {
        try {
            await postsService.updatePost(req.params.id, req.body, req.session.user.id);
            res.json({ message: 'Post updated successfully' });
        } catch (err) {
            next(err);
        }
    }

    async deletePost(req, res, next) {
        try {
            await postsService.deletePost(req.params.id, req.session.user.id);
            res.json({ message: 'Post deleted successfully' });
        } catch (err) {
            next(err);
        }
    }

    async markCompleted(req, res, next) {
        try {
            await postsService.markCompleted(req.params.id, req.body.user_id, true);
            res.json({ message: 'Adventure marked as completed' });
        } catch (err) {
            next(err);
        }
    }

    async markCancelled(req, res, next) {
        try {
            await postsService.markCancelled(req.params.id, req.session.user.id, true);
            res.json({ message: 'Adventure marked as cancelled' });
        } catch (err) {
            next(err);
        }
    }

    async markUncompleted(req, res, next) {
        try {
            await postsService.markCompleted(req.params.id, req.body.user_id, false);
            res.json({ message: 'Adventure marked as uncompleted' });
        } catch (err) {
            next(err);
        }
    }

    async joinAdventure(req, res, next) {
        try {
            await postsService.joinAdventure(req.params.id, req.session.user.id);
            res.status(201).json({ message: 'Joined successfully' });
        } catch (err) {
            next(err);
        }
    }

    async unjoinAdventure(req, res, next) {
        try {
            await postsService.unjoinAdventure(req.params.id, req.session.user.id);
            res.json({ message: 'Unjoined successfully' });
        } catch (err) {
            next(err);
        }
    }

    async getParticipants(req, res, next) {
        try {
            const participants = await postsService.getParticipants(req.params.id);
            res.json(participants);
        } catch (err) {
            next(err);
        }
    }
}

export default new PostsController();