import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import homeRoutes from './routes/home.routes.js';
import sessionRoutes from './routes/session.routes.js';
import posRoutes from './routes/pos.routes.js';
import orderRoutes from './routes/order.routes.js';

connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', orderRoutes); // Reusing order routes for payments as they are linked
app.use('/api/floors', posRoutes); // Also mapping /api/floors to posRoutes
app.use('/api/tables', posRoutes); // Also mapping /api/tables to posRoutes


app.get('/', (req, res) => {
    res.send('Odoo Cafe POS API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
