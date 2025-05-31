import bcrypt from 'bcrypt';

export async function createDemoData(db) {
    const saltRounds = 10;

    // Avoid duplicate seeding
    const userCount = await db.get(`SELECT COUNT(*) as count FROM users`);
    if (userCount.count > 0) {
        console.log("Demo data already exists. Skipping seed.");
        return;
    }

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('admin123', saltRounds);
    await db.run(
        `INSERT INTO users (username, password, full_name, city, email, bio, role)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            'admin',
            hashedAdminPassword,
            'Admin User',
            'Admin City',
            'admin@example.com',
            'I am the admin.',
            'guide'
        ]
    );
    console.log('Admin user created: admin / admin123');

    // Create 50 demo users
    for (let i = 1; i <= 50; i++) {
        const role = i <= 25 ? 'guide' : 'explorer';
        const hashedPassword = await bcrypt.hash('password123', saltRounds);
        await db.run(
            `INSERT INTO users (username, password, full_name, city, email, bio, role)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                `user${i}`,
                hashedPassword,
                `User ${i} Name`,
                i % 2 === 0 ? 'Bucharest' : 'Cluj-Napoca',
                `user${i}@example.com`,
                'This is a test user.',
                role
            ]
        );
    }
    console.log('50 demo users created.');

    // Create demo adventures
    const guides = await db.all("SELECT id FROM users WHERE role = 'guide'");
    for (const guide of guides) {
        for (let i = 0; i < 4; i++) {
            const title = `Adventure by Guide ${guide.id} #${i + 1}`;
            const location = Math.random() > 0.5 ? 'Bucharest' : 'Transylvania';
            const type = ['hike', 'bike ride', 'city exploration'][Math.floor(Math.random() * 3)];
            const difficulty = ['easy', 'moderate', 'hard'][Math.floor(Math.random() * 3)];
            const duration = `${Math.floor(Math.random() * 6) + 1}h`;
            const startsOn = new Date(Date.now() + Math.random() * 30 * 86400000).toISOString();

            await db.run(
                `INSERT INTO posts (title, location, type, difficulty, estimated_duration, description, author_id, starts_on)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    title,
                    location,
                    type,
                    difficulty,
                    duration,
                    'Join me for an amazing adventure!',
                    guide.id,
                    startsOn
                ]
            );
        }
    }
    console.log('Adventures created for guides.');

    // Assign explorers to adventures
    const posts = await db.all("SELECT id FROM posts");
    const explorers = await db.all("SELECT id FROM users WHERE role = 'explorer'");

    for (const post of posts) {
        const participants = [...explorers]
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 11) + 5); // 5–15 participants

        for (const explorer of participants) {
            try {
                await db.run(
                    `INSERT INTO adventure_participants (post_id, user_id)
                     VALUES (?, ?)`,
                    [post.id, explorer.id]
                );
            } catch (err) {
                // Ignore duplicate participant errors
            }
        }
    }

    console.log('Participants added to adventures.');
}