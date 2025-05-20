import express from 'express';
import db from '../db/db.js';

const router = express.Router();

// Add post
router.post('/', (req, res) => {
    const { title, content, author_id } = req.body;
    db.run(
        `INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)`,
        [title, content, author_id],
        function(err) {
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