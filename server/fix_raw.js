import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const seq = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
        family: 4
    },
    logging: console.log
});

async function run() {
    console.log('Starting raw SQL update...');
    try {
        // We skip authenticate() and go straight to query
        const [results, metadata] = await seq.query(
            "UPDATE users SET \"branchId\" = 1 WHERE username IN ('admin1', 'admin2', 'admin3', 'Harshit')"
        );
        console.log('Done! Rows affected:', metadata.rowCount || metadata);
    } catch (e) {
        console.error('Update failed:', e.message);
    } finally {
        await seq.close();
        console.log('Sequential connection closed.');
    }
}
run();
