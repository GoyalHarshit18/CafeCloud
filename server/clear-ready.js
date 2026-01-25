import sequelize from './config/db.js';
import Order from './models/Order.js';

const clearReadyOrders = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Move all 'ready' and 'completed' orders to 'paid' so they disappear from KDS
        const count = await Order.update(
            { status: 'paid' },
            { where: { status: ['ready', 'completed'] } }
        );

        console.log(`${count[0]} orders moved from Ready/Completed to Paid.`);
        console.log('Ready section cleared.');
    } catch (error) {
        console.error('Operation failed:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

clearReadyOrders();
