import express from 'express';
import cors from 'cors';
import { Database } from './src/config/database.js'; // Adjust path if needed
import { createDemoData } from './seed-demo-data.js';

const app = express();
app.use(express.json());
app.use(cors());

async function start() {
    try {
        // Use file-based SQLite for persistence:
        const db = new Database('./demo.sqlite'); // <--- Change is here
        await db.connect();
        await createDemoData(db);

        // Example route to test posts
        app.get('/api/posts', async (req, res) => {
            const posts = await db.all('SELECT * FROM posts');
            res.json(posts);
        });

        app.listen(3001, () => {
            console.log('Demo backend running on http://localhost:3001');
            console.log('Admin credentials: admin/admin123');
            console.log('SQLite file: ./demo.sqlite');
        });
    } catch (err) {
        console.error('Startup failed:', err);
    }
}

start();
