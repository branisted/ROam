// users.service.test.js
import { jest } from '@jest/globals';

// Mock the usersRepository module before importing the service
jest.unstable_mockModule('../../src/features/users/users.repository.js', () => ({
    default: {
        getUserById: jest.fn(),
        getJoinedPosts: jest.fn(),
        getCreatedAdventures: jest.fn(),
        getExplorerAdventures: jest.fn(),
    }
}));

describe('UsersService', () => {
    let usersService, usersRepository;

    beforeAll(async () => {
        usersService = (await import('../../src/features/users/users.service.js')).default;
        usersRepository = (await import('../../src/features/users/users.repository.js')).default;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserProfileWithJoinedPosts', () => {
        it('should return user and joined posts', async () => {
            usersRepository.getUserById.mockResolvedValue({ id: 1, username: 'explorer1' });
            usersRepository.getJoinedPosts.mockResolvedValue([{ id: 10, title: 'Adventure 1' }]);

            const result = await usersService.getUserProfileWithJoinedPosts(1);

            expect(usersRepository.getUserById).toHaveBeenCalledWith(1);
            expect(usersRepository.getJoinedPosts).toHaveBeenCalledWith(1);
            expect(result).toEqual({
                user: { id: 1, username: 'explorer1' },
                joinedPosts: [{ id: 10, title: 'Adventure 1' }]
            });
        });

        it('should throw error if user not found', async () => {
            usersRepository.getUserById.mockResolvedValue(null);

            await expect(usersService.getUserProfileWithJoinedPosts(999))
                .rejects.toThrow('User not found');
        });
    });

    describe('getCreatedAdventures', () => {
        it('should return created adventures', async () => {
            usersRepository.getCreatedAdventures.mockResolvedValue([
                { id: 2, title: 'Created Adventure' }
            ]);

            const result = await usersService.getCreatedAdventures(1);

            expect(usersRepository.getCreatedAdventures).toHaveBeenCalledWith(1);
            expect(result).toEqual([{ id: 2, title: 'Created Adventure' }]);
        });
    });

    describe('getExplorerProfileWithAdventures', () => {
        it('should return user and categorized adventures', async () => {
            usersRepository.getUserById.mockResolvedValue({ id: 1, username: 'explorer1' });
            usersRepository.getExplorerAdventures.mockResolvedValue({
                upcoming: [{ id: 1, title: 'Upcoming' }],
                completed: [{ id: 2, title: 'Completed' }],
                cancelled: [{ id: 3, title: 'Cancelled' }]
            });

            const result = await usersService.getExplorerProfileWithAdventures(1);

            expect(usersRepository.getUserById).toHaveBeenCalledWith(1);
            expect(usersRepository.getExplorerAdventures).toHaveBeenCalledWith(1);
            expect(result).toEqual({
                user: { id: 1, username: 'explorer1' },
                upcoming: [{ id: 1, title: 'Upcoming' }],
                completed: [{ id: 2, title: 'Completed' }],
                cancelled: [{ id: 3, title: 'Cancelled' }]
            });
        });

        it('should throw error if user not found', async () => {
            usersRepository.getUserById.mockResolvedValue(null);

            await expect(usersService.getExplorerProfileWithAdventures(999))
                .rejects.toThrow('User not found');
        });
    });
});