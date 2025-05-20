import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();

import db from '../db/db.js';

router.post('/register', async (req, res) => {
    const { username, email, password, role = 'explorer' } = req.body;

    try {
        const existingUser = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
                [username, email, hashedPassword, role],
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