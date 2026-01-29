import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize, { connectWithRetry } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import homeRoutes from './routes/home.routes.js';
import branchRoutes from './routes/branch.routes.js';
import posRoutes from './routes/pos.routes.js';
import sessionRoutes from './routes/session.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import customerRoutes from './routes/customer.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors()); // TODO: Restrict for production if needed
app.use('/public', express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectWithRetry();

        // Sync models
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Failed to connect to database after retries. Starting server anyway (endpoints may fail)...', error);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
