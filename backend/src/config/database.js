import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database {
    constructor() {
        this.dbPath = path.resolve(__dirname, 'backend.db');
        this.db = null;
        this.connect();
    }

    connect() {
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Failed to connect to database:', err.message);
                throw err;
            } else {
                console.log('Connected to SQLite database');
                this.initializeTables();
            }
        });
    }

    initializeTables() {
        this.db.serialize(() => {
            // Users table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                full_name TEXT NOT NULL,
                city TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                bio TEXT DEFAULT 'No bio.',
                role TEXT CHECK(role IN ('explorer', 'guide')) DEFAULT 'explorer'
                )
            `);

            // Posts table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    location TEXT NOT NULL,
                    type TEXT CHECK(type IN ('hike', 'bike ride', 'urban walk', 'nature tour', 'forest trail', 'mountain climb', 'city exploration', 'river walk', 'wildlife spotting', 'historical tour', 'food tour', 'cycling', 'stargazing', 'camping', 'other')) DEFAULT 'other',
                    difficulty TEXT CHECK(difficulty IN ('easy', 'moderate', 'hard')) DEFAULT 'easy',
                    estimated_duration TEXT NOT NULL,
                    photo BLOB,
                    description TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    author_id INTEGER NOT NULL,
                    starts_on DATETIME NOT NULL,
                    completed BOOLEAN DEFAULT 0,
                    cancelled BOOLEAN DEFAULT 0,
                    CHECK (NOT (completed = 1 AND cancelled = 1)),
                    FOREIGN KEY (author_id) REFERENCES users(id)
                    )
            `);

            // Adventure participants table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS adventure_participants (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    post_id INTEGER NOT NULL,
                    user_id INTEGER NOT NULL,
                    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (post_id) REFERENCES posts(id),
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    UNIQUE(post_id, user_id)
                )
            `);
        });
    }

    // Promisify database methods
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

// Export singleton instance
const database = new Database();
export default database;