import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();

import db from '../db/db.js';

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Get user by username
        db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (!user) return res.status(401).json({ message: 'Invalid username or password' });

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

            // Successful login
            console.log("Login successful: ", user);
            res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email, role: user.role } });
        });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.post('/register', async (req, res) => {
    const { username, password, full_name, city, email, bio, role = 'explorer' } = req.body;

    try {
        const existingUser = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE username = ?", [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username already registered." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO users (username, password, full_name, city, email, bio, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [username, hashedPassword, full_name, city, email, bio, role],
                function (err) {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });

        res.status(201).json({ message: "User registered successfully." });
        console.log("User registered successfully.", username, email, hashedPassword, role);
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;