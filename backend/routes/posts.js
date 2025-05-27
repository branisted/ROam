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

// Join an adventure (POST /api/posts/:id/join)
router.post('/:id/join', (req, res) => {
    const { user_id } = req.body;
    const post_id = req.params.id; // Use 'id' from params, not 'postId'
    console.log('Join attempt:', { user_id, post_id });

    if (!user_id || !post_id) {
        console.log('Missing user_id or post_id');
        return res.status(400).json({ message: 'Missing user_id or post_id' });
    }

    // Convert post_id to a number if your DB expects an integer
    const postIdNum = Number(post_id);

    // 1. Verify user role
    db.get(
        `SELECT role FROM users WHERE id = ?`,
        [user_id], // Use user_id, not userId
        (err, user) => {
            if (err || !user) return res.status(403).json({ message: "Unauthorized" });
            if (user.role !== 'explorer') {
                return res.status(403).json({ message: "Only explorers can join adventures" });
            }

            // 2. Check adventure joinability
            db.get(
                `SELECT is_joinable, max_participants, starts_on FROM posts WHERE id = ?`,
                [postIdNum], // Use postIdNum, not postId
                (err, post) => {
                    if (!post || !post.is_joinable) {
                        return res.status(400).json({ message: "Adventure not joinable" });
                    }

                    if (new Date(post.starts_on) <= new Date()) {
                        return res.status(400).json({ message: "Adventure has already started" });
                    }

                    // 3. Check participant count
                    db.get(
                        `SELECT COUNT(*) as count FROM adventure_participants WHERE post_id = ?`,
                        [postIdNum],
                        (err, row) => {
                            if (post.max_participants && row.count >= post.max_participants) {
                                return res.status(400).json({ message: "Adventure is full" });
                            }

                            // 4. Insert participant
                            db.run(
                                `INSERT INTO adventure_participants (user_id, post_id) VALUES (?, ?)`,
                                [user_id, postIdNum],
                                function (err) {
                                    if (err) {
                                        console.error('Join DB error:', err.message);
                                        return res.status(500).json({ message: 'Failed to join adventure' });
                                    }
                                    res.status(201).json({ message: 'Joined successfully' });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

router.get('/:id', (req, res) => {
    const postId = req.params.id;
    db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, post) => {
        if (err) return res.status(500).json({ message: 'DB error' });
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    });
});

export default router;