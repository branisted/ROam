import usersRepository from './users.repository.js';

class UsersService {
    async getUserProfileWithJoinedPosts(userId) {
        const user = await usersRepository.getUserById(userId);
        if (!user) throw new Error('User not found');
        const joinedPosts = await usersRepository.getJoinedPosts(userId);
        return { user, joinedPosts };
    }

    async getCreatedAdventures(userId) {
        return await usersRepository.getCreatedAdventures(userId);
    }

    async getExplorerProfileWithAdventures(userId) {
        const user = await usersRepository.getUserById(userId);
        if (!user) throw new Error('User not found');
        const adventures = await usersRepository.getExplorerAdventures(userId);
        return { user, ...adventures };
    }
}

export default new UsersService();