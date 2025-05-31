// posts.service.test.js
import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../../src/features/posts/posts.repository.js', () => ({
    default: {
        createPost: jest.fn(),
        getAllPosts: jest.fn(),
        searchPosts: jest.fn(),
        getPostById: jest.fn(),
        getAuthorId: jest.fn(),
        updatePost: jest.fn(),
        deletePost: jest.fn(),
        markCompleted: jest.fn(),
        getJoinableInfo: jest.fn(),
        addParticipant: jest.fn(),
        removeParticipant: jest.fn(),
        getParticipants: jest.fn(),
        markCancelled: jest.fn()
    }
}));

jest.unstable_mockModule('../../src/config/database.js', () => ({
    default: {
        get: jest.fn()
    }
}));

describe('PostsService', () => {
    let postsService;
    let postsRepository;
    let database;
    const mockUserId = 1;
    const mockPostId = 100;

    beforeAll(async () => {
        postsService = (await import('../../src/features/posts/posts.service.js')).default;
        postsRepository = (await import('../../src/features/posts/posts.repository.js')).default;
        database = (await import('../../src/config/database.js')).default;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createPost', () => {
        const mockPostData = {
            title: 'Test Post',
            starts_on: '2025-06-01T10:00',
            location: 'Test Location'
        };

        test('creates post with valid data', async () => {
            postsRepository.createPost.mockResolvedValue(mockPostId);

            const result = await postsService.createPost(
                mockPostData,
                { filename: 'test.jpg' },
                { protocol: 'http', get: () => 'localhost:3000' },
                mockUserId
            );

            expect(result).toBe(mockPostId);
            expect(postsRepository.createPost).toHaveBeenCalledWith({
                title: 'Test Post',
                starts_on: '2025-06-01 10:00:00',
                location: 'Test Location',
                author_id: mockUserId,
                photo: 'http://localhost:3000/uploads/test.jpg',
                created_at: expect.any(String)
            });
        });

        test('throws error when missing start date', async () => {
            await expect(postsService.createPost(
                { ...mockPostData, starts_on: null },
                null,
                {},
                mockUserId
            )).rejects.toThrow('Start date is required');
        });
    });

    describe('updatePost', () => {
        test('updates post when authorized', async () => {
            postsRepository.getAuthorId.mockResolvedValue(mockUserId);

            await postsService.updatePost(
                mockPostId,
                { title: 'Updated', starts_on: '2025-06-02T14:00' },
                mockUserId
            );

            expect(postsRepository.updatePost).toHaveBeenCalledWith(mockPostId, {
                title: 'Updated',
                starts_on: '2025-06-02 14:00:00'
            });
        });

        test('throws error when unauthorized', async () => {
            postsRepository.getAuthorId.mockResolvedValue(999);

            await expect(postsService.updatePost(mockPostId, {}, mockUserId))
                .rejects.toThrow('Unauthorized');
        });
    });

    describe('deletePost', () => {
        test('deletes post when authorized', async () => {
            postsRepository.getAuthorId.mockResolvedValue(mockUserId);
            await postsService.deletePost(mockPostId, mockUserId);
            expect(postsRepository.deletePost).toHaveBeenCalledWith(mockPostId);
        });
    });

    describe('joinAdventure', () => {
        const mockPost = {
            id: mockPostId,
            starts_on: '2025-06-01 10:00:00',
            completed: false,
            cancelled: false
        };

        test('allows valid explorer to join', async () => {
            database.get.mockResolvedValue({ role: 'explorer' });
            postsRepository.getJoinableInfo.mockResolvedValue(mockPost);

            await postsService.joinAdventure(mockPostId, mockUserId);

            expect(postsRepository.addParticipant)
                .toHaveBeenCalledWith(mockUserId, mockPostId);
        });

        test('prevents guides from joining', async () => {
            database.get.mockResolvedValue({ role: 'guide' });

            await expect(postsService.joinAdventure(mockPostId, mockUserId))
                .rejects.toThrow('Only explorers can join adventures');
        });

        test('prevents joining completed adventure', async () => {
            database.get.mockResolvedValue({ role: 'explorer' });
            postsRepository.getJoinableInfo.mockResolvedValue({
                ...mockPost,
                completed: true
            });

            await expect(postsService.joinAdventure(mockPostId, mockUserId))
                .rejects.toThrow('Adventure not joinable');
        });

        test('prevents joining started adventure', async () => {
            database.get.mockResolvedValue({ role: 'explorer' });
            postsRepository.getJoinableInfo.mockResolvedValue({
                ...mockPost,
                starts_on: '2020-01-01 10:00:00'
            });

            await expect(postsService.joinAdventure(mockPostId, mockUserId))
                .rejects.toThrow('Adventure has already started');
        });
    });

    describe('markCompleted', () => {
        test('marks post completed when authorized', async () => {
            postsRepository.getAuthorId.mockResolvedValue(mockUserId);
            await postsService.markCompleted(mockPostId, mockUserId, true);
            expect(postsRepository.markCompleted).toHaveBeenCalledWith(mockPostId, true);
        });
    });

});