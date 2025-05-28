import express from 'express';
import dbInstance from '../db/db.js';

const router = express.Router();

// Get user profile and joined posts
router.get('/:id/profile', (req, res) => {
    const userId = req.params.id;

    // Get user info
    dbInstance.get('SELECT id, username, email, role FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) return res.status(404).json({ message: 'User not found' });

        // Get posts the user has joined
        dbInstance.all(
            `SELECT posts.* 
             FROM posts 
             INNER JOIN adventure_participants ap ON posts.id = ap.post_id 
             WHERE ap.user_id = ?`,
            [userId],
            (err, joinedPosts) => {
                if (err) return res.status(500).json({ message: 'DB error' });

                res.json({
                    user,
                    joinedPosts
                });
            }
        );
    });
});

router.get('/:id/created-adventures', (req, res) => {
    const userId = req.params.id;

    // Optionally, check if the user is a guide first
    // db.get('SELECT role FROM users WHERE id = ?', [userId], (err, user) => { ... })

    dbInstance.all(
        `SELECT * FROM posts WHERE author_id = ? ORDER BY created_at DESC`,
        [userId],
        (err, posts) => {
            if (err) return res.status(500).json({ message: 'DB error' });
            res.json(posts);
        }
    );
});

export default router;