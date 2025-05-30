import database from '../src/config/database.js';
import postsService from '../src/features/posts/posts.service.js';

describe('PostsService Integration Tests', () => {
    let service;

    beforeAll(async () => {
        await database.ready; // Wait for tables to be created!
        await database.run(
            `INSERT INTO users (username, password, full_name, city, email, bio, role)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['testguide', 'password', 'Test Guide', 'Test City', 'guide@test.com', 'test bio', 'guide']
        );
        service = postsService;
    });

    afterAll(async () => {
        await database.close();
    });

    beforeEach(async () => {
        await database.run('DELETE FROM posts');
        await database.run('DELETE FROM adventure_participants');
    });

    test('createPost inserts valid post into database', async () => {
        const postData = {
            title: 'Test Adventure',
            location: 'Test Location',
            type: 'hike',
            difficulty: 'easy',
            estimated_duration: '2h',
            description: 'Test description',
            starts_on: '2025-06-01 10:00:00'
        };

        const postId = await service.createPost(
            postData,
            null,
            { protocol: 'http', get: () => 'localhost:3001' },
            1 // author_id (matches our test user)
        );

        const post = await database.get('SELECT * FROM posts WHERE id = ?', postId);
        expect(post.title).toBe('Test Adventure');
        expect(post.author_id).toBe(1);
    });
});