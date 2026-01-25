import sequelize from './config/db.js';
import Order from './models/Order.js';
import OrderItem from './models/OrderItem.js';
import Table from './models/Table.js';
import Session from './models/Session.js';
import Product from './models/Product.js';
import { v4 as uuidv4 } from 'uuid';

const resetAndSeedT7 = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Reset all tables to free
        await Table.update({ status: 'free' }, { where: {} });
        console.log('All tables reset to free.');

        // 2. Clear active orders (set them to completed or paid so they don't show in KDS)
        // Or just delete them if this is a test environment
        await Order.update({ status: 'completed' }, { where: { status: ['running', 'in-kitchen', 'preparing', 'ready'] } });
        console.log('Existing active orders cleared.');

        // 3. Find/Create Table T-7
        let tableT7 = await Table.findOne({ where: { number: 7 } });
        if (!tableT7) {
            console.log('Table T-7 not found. Creating it...');
            const floor = await sequelize.models.Floor.findOne();
            tableT7 = await Table.create({
                id: uuidv4(),
                number: 7,
                seats: 4,
                floorId: floor?.id || uuidv4(),
                status: 'free'
            });
        }

        // 4. Get latest session
        const session = await Session.findOne({ order: [['createdAt', 'DESC']] });
        if (!session) {
            console.log('No session found. Please open a session in the UI first.');
            return;
        }

        // 5. Get some products
        const products = await Product.findAll({ limit: 2 });

        // 6. Create Order for T-7
        const orderId = uuidv4();
        const subtotal = products.reduce((sum, p) => sum + parseFloat(p.price), 0);

        await Order.create({
            id: orderId,
            tableId: tableT7.id,
            sessionId: session.id,
            subtotal: subtotal,
            tax: subtotal * 0.05,
            total: subtotal * 1.05,
            status: 'in-kitchen', // This will show in TO COOK
            customerName: 'T7 Guest'
        });

        for (const p of products) {
            await OrderItem.create({
                id: uuidv4(),
                orderId: orderId,
                productId: p.id,
                name: p.name,
                price: p.price,
                quantity: 1
            });
        }

        // 7. Mark T-7 as occupied
        await tableT7.update({ status: 'occupied' });
        console.log('Table T-7 is now occupied with a new "TO COOK" order.');

        console.log('Reset and Seeding complete.');
    } catch (error) {
        console.error('Operation failed:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

resetAndSeedT7();
