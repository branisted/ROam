import usersService from './users.service.js';

class UsersController {
    async getProfile(req, res, next) {
        try {
            const { id } = req.params;
            // You may want to check the user's role here if needed
            const data = await usersService.getExplorerProfileWithAdventures(id);
            res.json(data);
        } catch (err) {
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