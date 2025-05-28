import { jest } from '@jest/globals';
import request from 'supertest';

// 1. Mock the db module (must be before importing app)
const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', role: 'explorer' };
const mockPosts = [{ id: 101, title: 'Joined Adventure 1' }];

await jest.unstable_mockModule('../../db/db.js', () => ({
    default: {
        get: (sql, params, cb) => {
            // Simulate user found for profile route
            if (sql.startsWith('SELECT id, username')) cb(null, mockUser);
            else cb(null, null);
        },
        all: (sql, params, cb) => {
            // Simulate posts for joined adventures
            cb(null, mockPosts);
        }
    }
}));

// 2. Dynamically import app AFTER mocking
const { default: app } = await import('../../app.js');

describe('GET /api/users/:id/profile', () => {
    it('should return user profile with joined posts', async () => {
        const res = await request(app).get('/api/users/1/profile');
        expect(res.statusCode).toBe(200);
        expect(res.body.user).toEqual(mockUser);
        expect(res.body.joinedPosts).toEqual(mockPosts);
    });
});
