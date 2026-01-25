import sequelize from './config/db.js';

const fixSchema = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Add updated_at if missing
        try {
            await sequelize.query('ALTER TABLE order_items ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();');
            console.log('Added updated_at column.');
        } catch (e) {
            console.log('updated_at check: ' + e.message);
        }

        // Add created_at if missing
        try {
            await sequelize.query('ALTER TABLE order_items ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();');
            console.log('Added created_at column.');
        } catch (e) {
            console.log('created_at check: ' + e.message);
        }

        console.log('Schema Fix Finished!');
    } catch (error) {
        console.error('Fix failed:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

fixSchema();
