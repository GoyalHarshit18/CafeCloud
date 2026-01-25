import sequelize from './config/db.js';
import Table from './models/Table.js';

const freeTable7 = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const count = await Table.update(
            { status: 'free' },
            { where: { number: 7 } }
        );

        console.log(`Table 7 set to free. (${count[0]} record updated)`);
    } catch (error) {
        console.error('Operation failed:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

freeTable7();
