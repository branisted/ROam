import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'backend.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Failed to connect to database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create tables
db.serialize(() => {
    db.run(`
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
});

db.serialize(() => {
    db.run(`
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
            likes INTEGER DEFAULT 0,
            is_joinable BOOLEAN DEFAULT 0,
            max_participants INTEGER DEFAULT NULL,
            FOREIGN KEY (author_id) REFERENCES users(id)
            )
    `);
});

export default db;