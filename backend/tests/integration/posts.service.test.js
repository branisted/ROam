import database from '../../src/config/database.js';
import postsService from '../../src/features/posts/posts.service.js';

describe('PostsService Integration Tests', () => {
    let testGuideId;
    let testExplorerId;

    beforeAll(async () => {
        await database.ready;

        // Create test users
        await database.run(
            `INSERT INTO users (username, password, full_name, city, email, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
            ['guide1', 'password', 'Test Guide', 'Test City', 'guide@test.com', 'guide']
        );
        const guide = await database.get('SELECT id FROM users WHERE username = ?', 'guide1');
        testGuideId = guide.id;

        await database.run(
            `INSERT INTO users (username, password, full_name, city, email, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
            ['explorer1', 'password', 'Test Explorer', 'Test City', 'explorer@test.com', 'explorer']
        );
        const explorer = await database.get('SELECT id FROM users WHERE username = ?', 'explorer1');
        testExplorerId = explorer.id;
    });

    afterAll(async () => {
        await database.close();
    });

    beforeEach(async () => {
        await database.run('DELETE FROM posts');
        await database.run('DELETE FROM adventure_participants');
    });

    describe('createPost', () => {
        it('should create a new post with valid data', async () => {
            const postData = {
                title: 'Test Adventure',
                location: 'Test Location',
                type: 'hike',
                difficulty: 'easy',
                estimated_duration: '2h',
                description: 'Test description',
                starts_on: '2025-06-01T10:00'
            };

            const postId = await postsService.createPost(
                postData,
                null,
                { protocol: 'http', get: () => 'localhost:3001' },
                testGuideId
            );

            const post = await database.get('SELECT * FROM posts WHERE id = ?', postId);
            expect(post.title).toBe('Test Adventure');
            expect(post.author_id).toBe(testGuideId);
            expect(post.starts_on).toBe('2025-06-01 10:00:00');
        });
    });

    describe('updatePost', () => {
        it('should update post details when authorized', async () => {
            // Create test post
            const postId = await createTestPost();

            const updateData = {
                title: 'Updated Adventure',
                location: 'New Location',
                type: 'hike',
                difficulty: 'easy',
                estimated_duration: '3h',
                description: 'Updated description',
                starts_on: '2025-06-02T14:00'
            };

            await postsService.updatePost(postId, updateData, testGuideId);

            const updatedPost = await database.get('SELECT * FROM posts WHERE id = ?', postId);
            expect(updatedPost.title).toBe('Updated Adventure');
            expect(updatedPost.starts_on).toBe('2025-06-02 14:00:00');
        });
    });

    describe('joinAdventure', () => {
        it('should allow explorer to join a valid adventure', async () => {
            const postId = await createTestPost();

            await postsService.joinAdventure(postId, testExplorerId);

            const participants = await database.all(
                'SELECT * FROM adventure_participants WHERE post_id = ?',
                postId
            );
            expect(participants).toHaveLength(1);
        });

        it('should prevent guides from joining adventures', async () => {
            const postId = await createTestPost();

            await expect(postsService.joinAdventure(postId, testGuideId))
                .rejects.toThrow('Only explorers can join adventures');
        });
    });

    // Helper function to create test posts
    async function createTestPost() {
        const postData = {
            title: 'Test Adventure',
            location: 'Test Location',
            type: 'hike',
            difficulty: 'easy',
            estimated_duration: '2h',
            description: 'Test description',
            starts_on: '2025-06-01T10:00'
        };

        return postsService.createPost(
            postData,
            null,
            { protocol: 'http', get: () => 'localhost:3001' },
            testGuideId
        );
    }
});