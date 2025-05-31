// auth.service.test.js
import { jest } from '@jest/globals';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Mock dependencies
jest.unstable_mockModule('bcrypt', () => ({
    default: {
        compare: jest.fn(),
        hash: jest.fn()
    }
}));

jest.unstable_mockModule('../../src/features/auth/auth.repository.js', () => ({
    default: {
        findUserByUsername: jest.fn(),
        findUserByEmail: jest.fn(),
        createUser: jest.fn()
    }
}));

describe('AuthService', () => {
    let authService;
    let authRepository;
    let bcrypt;

    beforeAll(async () => {
        // Dynamically import after mocks are set up
        authService = (await import('../../src/features/auth/auth.service.js')).default;
        authRepository = (await import('../../src/features/auth/auth.repository.js')).default;
        bcrypt = (await import('bcrypt')).default;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        const mockUser = {
            id: 1,
            username: 'testuser',
            password: 'hashedpass',
            email: 'test@example.com',
            role: 'user'
        };

        test('successful login returns user without password', async () => {
            authRepository.findUserByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            const result = await authService.login('testuser', 'password');

            expect(result).toEqual({
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                role: 'user'
            });
            expect(authRepository.findUserByUsername).toHaveBeenCalledWith('testuser');
            expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpass');
        });

        test('throws error for non-existent user', async () => {
            authRepository.findUserByUsername.mockResolvedValue(null);

            await expect(authService.login('invalid', 'pass'))
                .rejects.toThrow('Invalid username or password');
        });

        test('throws error for incorrect password', async () => {
            authRepository.findUserByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.login('testuser', 'wrongpass'))
                .rejects.toThrow('Invalid username or password');
        });
    });

    describe('register', () => {
        const validUser = {
            username: 'newuser',
            password: 'password123',
            full_name: 'New User',
            city: 'Test City',
            email: 'new@example.com',
            bio: 'Test bio',
            role: 'user'
        };

        test('successful registration returns user data', async () => {
            authRepository.findUserByUsername.mockResolvedValue(null);
            authRepository.findUserByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed123');

            const result = await authService.register(validUser);

            expect(result).toEqual({
                username: 'newuser',
                email: 'new@example.com',
                role: 'user'
            });
            expect(authRepository.createUser).toHaveBeenCalledWith({
                username: 'newuser',
                hashedPassword: 'hashed123',
                full_name: 'New User',
                city: 'Test City',
                email: 'new@example.com',
                bio: 'Test bio',
                role: 'user'
            });
        });

        test('throws error for existing username', async () => {
            authRepository.findUserByUsername.mockResolvedValue({ username: 'existing' });

            await expect(authService.register(validUser))
                .rejects.toThrow('Username already registered.');
        });

        test('throws error for existing email', async () => {
            authRepository.findUserByUsername.mockResolvedValue(null);
            authRepository.findUserByEmail.mockResolvedValue({ email: 'existing@test.com' });

            await expect(authService.register(validUser))
                .rejects.toThrow('Email already registered.');
        });

        test('hashes password before storage', async () => {
            authRepository.findUserByUsername.mockResolvedValue(null);
            authRepository.findUserByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed123');

            await authService.register(validUser);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        });
    });
});