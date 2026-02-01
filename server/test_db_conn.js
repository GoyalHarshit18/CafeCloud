import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const url = "postgresql://postgres.ycdgrynuocechmmvyqbz:%40Harshit%40123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";
console.log('Testing connection to:', url.split('@')[1]); // Log only host for security

const sequelize = new Sequelize(url, {
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

async function test() {
    try {
        console.log('Authenticating...');
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        console.log('Querying users...');
        const [results] = await sequelize.query("SELECT COUNT(*) FROM users");
        console.log('User count:', results[0].count);

        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

test();
