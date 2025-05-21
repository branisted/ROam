import express from 'express';
import db from '../db/db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage });

// Add post
router.post('/', upload.single('photo'), (req, res) => {
    const {
        title,
        location,
        type,
        difficulty,
        estimated_duration,
        description,
        author_id,
        is_joinable,
        max_participants,
        starts_on
    } = req.body;

    // Validate required fields
    if (!starts_on) {
        return res.status(400).json({ message: 'Start date is required' });
    }

    const photo = req.file
        ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        : null;
    const created_at = new Date().toISOString();

    // Format datetime to SQLite-compatible format (YYYY-MM-DD HH:mm:ss)
    const startsOn = starts_on.replace('T', ' ') + ':00';

    // Parse joinable fields
    const joinable = typeof is_joinable !== "undefined" ? Number(is_joinable) : 0;
    const maxParts = max_participants ? Number(max_participants) : null;

    db.run(
        `INSERT INTO posts (
            title, location, type, difficulty, estimated_duration,
            photo, description, created_at, author_id,
            starts_on, is_joinable, max_participants
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            title,
            location,
            type,
            difficulty,
            estimated_duration,
            photo,
            description,
            created_at,
            author_id,
            startsOn,
            joinable,
            maxParts
        ],
        function (err) {
            if (err) return res.status(500).json({ message: 'Failed to add post' });
            res.status(201).json({ message: 'Post created', postId: this.lastID });
        }
    );
});

// Get all posts
router.get('/', (req, res) => {
    db.all(`SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error fetching posts' });
        res.json(rows);
    });
});

export default router;