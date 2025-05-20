import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();

// 🔧 Allow only frontend origin and credentials
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(3001, () => {
    console.log('Backend running on http://localhost:3001');
});
