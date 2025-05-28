import usersService from './users.service.js';

class UsersController {
    async getProfile(req, res, next) {
        try {
            const { id } = req.params;
            const data = await usersService.getUserProfileWithJoinedPosts(id);
            res.json(data);
        } catch (err) {
            if (err.message === 'User not found') {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    }

    async getCreatedAdventures(req, res, next) {
        try {
            const { id } = req.params;
            const posts = await usersService.getCreatedAdventures(id);
            res.json(posts);
        } catch (err) {
            next(err);
        }
    }
}

export default new UsersController();