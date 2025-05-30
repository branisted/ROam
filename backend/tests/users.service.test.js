import database from '../src/config/database.js';
import usersService from '../src/features/users/users.service.js';

describe('UsersService Integration Tests', () => {
    let testUserId;
    let testGuideId;

    beforeAll(async () => {
        await database.ready;

        // Create test users
        await database.run(
            `INSERT INTO users (username, password, full_name, city, email, role)
             VALUES (?, ?, ?, ?, ?, ?)`,
            ['explorer1', 'password', 'Test Explorer', 'Test City', 'explorer@test.com', 'explorer']
        );
        const explorer = await database.get('SELECT id FROM users WHERE username = ?', 'explorer1');
        testUserId = explorer.id;

        await database.run(
            `INSERT INTO users (username, password, full_name, city, email, role)
             VALUES (?, ?, ?, ?, ?, ?)`,
            ['guide1', 'password', 'Test Guide', 'Test City', 'guide@test.com', 'guide']
        );
        const guide = await database.get('SELECT id FROM users WHERE username = ?', 'guide1');
        testGuideId = guide.id;
    });

    afterAll(async () => {
        await database.close();
    });

    beforeEach(async () => {
        // Clear posts and participants between tests
        await database.run('DELETE FROM posts');
        await database.run('DELETE FROM adventure_participants');
    });

    describe('getUserProfileWithJoinedPosts', () => {
        it('should return user profile with joined adventures', async () => {
            // Create test adventure (all required fields!)
            await database.run(
                `INSERT INTO posts (title, location, type, difficulty, estimated_duration, description, author_id, starts_on)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    'Test Adventure',
                    'Test Location',
                    'hike',
                    'easy',
                    '2h',
                    'Test description',
                    testGuideId,
                    '2025-01-01 10:00:00'
                ]
            );
            const post = await database.get('SELECT id FROM posts WHERE title = ?', 'Test Adventure');

            // Join adventure
            await database.run(
                `INSERT INTO adventure_participants (post_id, user_id)
                 VALUES (?, ?)`,
                [post.id, testUserId]
            );

            const result = await usersService.getUserProfileWithJoinedPosts(testUserId);

            expect(result.user).toMatchObject({
                username: 'explorer1',
                role: 'explorer'
            });
            expect(result.joinedPosts).toHaveLength(1);
            expect(result.joinedPosts[0]).toMatchObject({
                title: 'Test Adventure',
                type: 'hike'
            });
        });

        it('should throw error for non-existent user', async () => {
            await expect(usersService.getUserProfileWithJoinedPosts(9999))
                .rejects.toThrow('User not found');
        });
    });

    describe('getCreatedAdventures', () => {
        it('should return adventures created by the guide', async () => {
            // Create test adventures (all required fields!)
            await database.run(
                `INSERT INTO posts (title, location, type, difficulty, estimated_duration, description, author_id, starts_on)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    'Guide Adventure 1',
                    'Test Location',
                    'hike',
                    'easy',
                    '2h',
                    'Test description',
                    testGuideId,
                    '2025-02-01 10:00:00'
                ]
            );
            await database.run(
                `INSERT INTO posts (title, location, type, difficulty, estimated_duration, description, author_id, starts_on)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    'Guide Adventure 2',
                    'Test Location',
                    'hike',
                    'easy',
                    '2h',
                    'Test description',
                    testGuideId,
                    '2025-03-01 10:00:00'
                ]
            );

            const result = await usersService.getCreatedAdventures(testGuideId);
            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                title: 'Guide Adventure 1',
                author_id: testGuideId
            });
        });

        it('should return empty array for user with no created adventures', async () => {
            const result = await usersService.getCreatedAdventures(testUserId);
            expect(result).toEqual([]);
        });
    });

    describe('getExplorerProfileWithAdventures', () => {
        it('should categorize adventures into upcoming, completed and cancelled', async () => {
            // Create test adventures in different states (all required fields!)
            await database.run(
                `INSERT INTO posts (title, location, type, difficulty, estimated_duration, description, author_id, starts_on, completed, cancelled)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    'Upcoming Adventure',
                    'Test Location',
                    'hike',
                    'easy',
                    '2h',
                    'Test description',
                    testGuideId,
                    '2025-06-01 10:00:00', // <-- in the future!
                    0,
                    0
                ]
            );
            await database.run(
                `INSERT INTO posts (title, location, type, difficulty, estimated_duration, description, author_id, starts_on, completed, cancelled)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    'Completed Adventure',
                    'Test Location',
                    'hike',
                    'easy',
                    '2h',
                    'Test description',
                    testGuideId,
                    '2024-01-01 10:00:00',
                    1,
                    0
                ]
            );
            await database.run(
                `INSERT INTO posts (title, location, type, difficulty, estimated_duration, description, author_id, starts_on, completed, cancelled)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    'Cancelled Adventure',
                    'Test Location',
                    'hike',
                    'easy',
                    '2h',
                    'Test description',
                    testGuideId,
                    '2025-05-01 10:00:00',
                    0,
                    1
                ]
            );

            // Join all adventures
            const posts = await database.all('SELECT id FROM posts');
            for (const post of posts) {
                await database.run(
                    `INSERT INTO adventure_participants (post_id, user_id)
                     VALUES (?, ?)`,
                    [post.id, testUserId]
                );
            }

            const result = await usersService.getExplorerProfileWithAdventures(testUserId);

            expect(result.user).toMatchObject({
                username: 'explorer1',
                role: 'explorer'
            });
            expect(result.upcoming).toHaveLength(1);
            expect(result.completed).toHaveLength(1);
            expect(result.cancelled).toHaveLength(1);

            expect(result.upcoming[0].title).toBe('Upcoming Adventure');
            expect(result.completed[0].title).toBe('Completed Adventure');
            expect(result.cancelled[0].title).toBe('Cancelled Adventure');
        });
    });
});
