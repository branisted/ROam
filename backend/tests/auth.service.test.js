import database from '../src/config/database.js';
import authService from '../src/features/auth/auth.service.js';
import bcrypt from 'bcrypt';

describe('AuthService Integration Tests', () => {
    beforeAll(async () => {
        await database.ready; // Wait for tables to be created
    });

    afterAll(async () => {
        await database.close();
    });

    beforeEach(async () => {
        // Clear users table before each test
        await database.run('DELETE FROM users');
    });

    describe('register', () => {
        const validUserData = {
            username: 'newuser',
            password: 'password123',
            full_name: 'New User',
            city: 'New City',
            email: 'new@example.com',
            bio: 'Test bio',
            role: 'explorer'
        };

        it('should create user with hashed password in database', async () => {
            const result = await authService.register(validUserData);

            // Verify returned data
            expect(result).toEqual({
                username: 'newuser',
                email: 'new@example.com',
                role: 'explorer'
            });

            // Check database state
            const user = await database.get(
                'SELECT * FROM users WHERE username = ?',
                'newuser'
            );

            expect(user).toBeTruthy();
            expect(user.full_name).toBe('New User');
            expect(user.password).not.toBe('password123');
            expect(await bcrypt.compare('password123', user.password)).toBe(true);
        });

        it('should throw error for duplicate username', async () => {
            // Create first user
            await authService.register(validUserData);

            // Attempt duplicate
            await expect(authService.register(validUserData))
                .rejects.toThrow('Username already registered.');
        });

        it('should throw error for duplicate email', async () => {
            // Create first user
            await authService.register(validUserData);

            // Create second user with same email
            await expect(authService.register({
                ...validUserData,
                username: 'differentuser'
            })).rejects.toThrow('Email already registered.');
        });
    });

    describe('login', () => {
        const testUser = {
            username: 'testuser',
            password: 'testpassword',
            email: 'test@example.com',
            full_name: 'Test User',
            city: 'Test City',
            bio: 'Test bio',
            role: 'explorer'
        };

        beforeEach(async () => {
            // Create test user directly in DB
            const hashedPassword = await bcrypt.hash(testUser.password, 10);
            await database.run(
                `INSERT INTO users 
                (username, password, email, full_name, city, bio, role)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    testUser.username,
                    hashedPassword,
                    testUser.email,
                    testUser.full_name,
                    testUser.city,
                    testUser.bio,
                    testUser.role
                ]
            );
        });

        it('should return user data without password on valid credentials', async () => {
            const result = await authService.login('testuser', 'testpassword');

            expect(result).toEqual({
                id: expect.any(Number),
                username: 'testuser',
                email: 'test@example.com',
                full_name: 'Test User',
                city: 'Test City',
                bio: 'Test bio',
                role: 'explorer'
            });
        });

        it('should throw error for invalid password', async () => {
            await expect(authService.login('testuser', 'wrongpassword'))
                .rejects.toThrow('Invalid username or password');
        });

        it('should throw error for non-existent user', async () => {
            await expect(authService.login('nonexistent', 'testpassword'))
                .rejects.toThrow('Invalid username or password');
        });
    });
});