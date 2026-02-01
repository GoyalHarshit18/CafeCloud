import { Sequelize } from 'sequelize';
import User from './models/User.js';
import Branch from './models/Branch.js';
import dotenv from 'dotenv';

dotenv.config();

const testSequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        family: 4
    },
    logging: console.log
});

async function fixBranches() {
    console.log('Starting branch fix script with standalone Sequelize...');
    try {
        console.log('Attempting to authenticate (10s timeout)...');
        // Manual timeout for authenticate
        const authenticatePromise = testSequelize.authenticate();
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Auth Timeout')), 10000));

        await Promise.race([authenticatePromise, timeoutPromise]);
        console.log('Connected!');

        // 1. Verify branch 1 exists
        const branch1 = await Branch.findByPk(1);
        if (!branch1) {
            console.log('Branch 1 not found! Creating it or checking existing branches...');
            const allBranches = await Branch.findAll();
            console.log('All branches:', allBranches.map(b => `${b.id}: ${b.name}`));
            if (allBranches.length === 0) {
                console.error('No branches exist in database. Cannot fix user assignments.');
                return;
            }
        }

        // 2. Fix users
        const usernames = ['admin1', 'admin2', 'admin3', 'Harshit'];

        for (const username of usernames) {
            const user = await User.findOne({ where: { username } });
            if (user) {
                console.log(`Updating ${username}: Branch ${user.branchId} -> 1`);
                user.branchId = 1;
                await user.save();
            } else {
                console.log(`User ${username} not found.`);
            }
        }

        console.log('Branch fix complete.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

fixBranches();
