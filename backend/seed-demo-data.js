// seed-demo-data.js
import bcrypt from 'bcrypt';
import { Database } from './src/config/database.js';

export async function createDemoData(db) {
    const saltRounds = 10;

    // Create admin (id 1)
    await db.run(
        `INSERT INTO users (id, username, password, full_name, city, email, bio, role)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            1,
            'admin',
            await bcrypt.hash('admin123', saltRounds),
            'Admin User',
            'Admin City',
            'admin@example.com',
            'test',
            'guide'
        ]
    );

    // Create 50 demo users (25 guides, 25 explorers)
    for (let i = 2; i <= 50; i++) {
        const role = i <= 25 ? 'guide' : 'explorer';
        await db.run(
            `INSERT INTO users (username, password, full_name, city, email, bio, role)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                `user${i}`,
                await bcrypt.hash('password123', saltRounds),
                `User ${i} Name`,
                i % 2 === 0 ? 'Bucharest' : 'Cluj-Napoca',
                `user${i}@example.com`,
                'test',
                role
            ]
        );
    }

    // Create 100 demo adventures (4 per guide)
    const guides = await db.all("SELECT id FROM users WHERE role = 'guide'");
    for (const guide of guides) {
        for (let i = 0; i < 4; i++) {
            await db.run(
                `INSERT INTO posts (title, location, type, difficulty, estimated_duration, description, author_id, starts_on)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    `Adventure ${guide.id}-${i}`,
                    Math.random() > 0.5 ? 'Bucharest' : 'Transylvania',
                    ['hike', 'bike ride', 'city exploration'][Math.floor(Math.random() * 3)],
                    ['easy', 'moderate', 'hard'][Math.floor(Math.random() * 3)],
                    `${Math.floor(Math.random() * 6) + 1}h`,
                    'Join me for an amazing adventure!',
                    guide.id,
                    new Date(Date.now() + (Math.random() * 30 * 86400000)).toISOString() // Next 30 days
                ]
            );
        }
    }

    // Create participants
    const posts = await db.all("SELECT id FROM posts");
    const explorers = await db.all("SELECT id FROM users WHERE role = 'explorer'");
    for (const post of posts) {
        const participants = explorers
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 10) + 5); // 5-15 participants

        for (const explorer of participants) {
            await db.run(
                `INSERT INTO adventure_participants (post_id, user_id)
                 VALUES (?, ?)`,
                [post.id, explorer.id]
            );
        }
    }
}

const db = new Database(':memory:');
await db.connect();
await createDemoData(db)