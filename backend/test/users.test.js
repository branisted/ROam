import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';

describe('GET /api/users/:id/profile', () => {
    it('should return 404 for a non-existent user', async () => {
        const res = await request(app).get('/api/users/9999/profile');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'User not found');
    });

    // You can add more tests for valid users, error handling, etc.
});