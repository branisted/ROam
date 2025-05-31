import express from 'express';
import cors from 'cors';
import { Database } from './src/config/database.js'; // Fixed import path
import { createDemoData } from './seed-demo-data.js';

const app = express();
app.use(express.json());
app.use(cors());

async function start() {
    try {
        const db = new Database(':memory:');
        await db.connect();
        await createDemoData(db);

        // Import routes after database initialization
        const routes = await import('./src/app.js');
        app.use('/api', routes.default); // routes.default must be a function (the router)

        app.listen(3001, () => {
            console.log('Demo backend running on http://localhost:3001');
            console.log('Admin credentials: admin/admin123');
        });
    } catch (err) {
        console.error('Startup failed:', err);
    }
}

start();