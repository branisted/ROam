const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');
const express = require('express');
const request = require('supertest');

describe('User Routes', function () {
    let dbStub;
    let app;
    let userRoutes;

    beforeEach(function () {
        // Stub DB methods with callback style
        dbStub = {
            get: sinon.stub(),
            all: sinon.stub(),
            run: sinon.stub(),
        };

        userRoutes = proxyquire('../routes/users.js', {
            '../db/db.js': dbStub,
        }).default; // or remove `.default` if your routes export differently

        app = express();
        app.use(express.json());
        app.use('/api/users', userRoutes);
    });

    afterEach(function () {
        sinon.restore();
    });

    describe('GET /api/users/:id/profile', function () {
        it('should return user profile with joined posts', async function () {
            dbStub.get.withArgs(sinon.match.any, sinon.match.func)
                .callsArgWith(1, null, {
                    id: 1,
                    username: 'testuser',
                    full_name: 'Test User',
                    city: 'Test City',
                    email: 'test@example.com',
                    bio: 'No bio.',
                    role: 'explorer',
                });

            dbStub.all.withArgs(sinon.match.any, sinon.match.func)
                .callsArgWith(1, null, [
                    { id: 1, title: 'Post 1', author_id: 1 },
                    { id: 2, title: 'Post 2', author_id: 1 },
                ]);

            const res = await request(app).get('/api/users/1/profile');

            expect(res.status).to.equal(200);
            expect(res.body.user).to.include({ id: 1, username: 'testuser' });
            expect(res.body.posts).to.be.an('array').with.lengthOf(2);
        });

        it('should return 404 when user not found', async function () {
            dbStub.get.withArgs(sinon.match.any, sinon.match.func)
                .callsArgWith(1, null, undefined);

            const res = await request(app).get('/api/users/123/profile');

            expect(res.status).to.equal(404);
            expect(res.body.message).to.match(/not found/i);
        });

        it('should handle database error on user fetch', async function () {
            dbStub.get.withArgs(sinon.match.any, sinon.match.func)
                .callsArgWith(1, new Error('DB failure'));

            const res = await request(app).get('/api/users/1/profile');

            expect(res.status).to.equal(500);
            expect(res.body.message).to.match(/error/i);
        });

        it('should handle database error on posts fetch', async function () {
            dbStub.get.withArgs(sinon.match.any, sinon.match.func)
                .callsArgWith(1, null, {
                    id: 1,
                    username: 'testuser',
                    full_name: 'Test User',
                });

            dbStub.all.withArgs(sinon.match.any, sinon.match.func)
                .callsArgWith(1, new Error('DB posts error'));

            const res = await request(app).get('/api/users/1/profile');

            expect(res.status).to.equal(500);
            expect(res.body.message).to.match(/error/i);
        });
    });

    describe('GET /api/users/:id/created-adventures', function () {
        it('should return created adventures', async function () {
            dbStub.all.withArgs(sinon.match.any, sinon.match.func)
                .callsArgWith(1, null, [
                    { id: 1, title: 'Adventure 1' },
                    { id: 2, title: 'Adventure 2' },
                ]);

            const res = await request(app).get('/api/users/1/created-adventures');

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').with.lengthOf(2);
        });

        it('should handle database error', async function () {
            dbStub.all.withArgs(sinon.match.any, sinon.match.func)
                .callsArgWith(1, new Error('DB error'));

            const res = await request(app).get('/api/users/1/created-adventures');

            expect(res.status).to.equal(500);
            expect(res.body.message).to.match(/error/i);
        });

        it('should return empty array if no adventures', async function () {
            dbStub.all.withArgs(sinon.match.any, sinon.match.func)
                .callsArgWith(1, null, []);

            const res = await request(app).get('/api/users/1/created-adventures');

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').that.is.empty;
        });
    });
});