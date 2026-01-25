import sequelize from './config/db.js';
import Order from './models/Order.js';
import OrderItem from './models/OrderItem.js';
import Table from './models/Table.js';
import Session from './models/Session.js';
import Product from './models/Product.js';
import { v4 as uuidv4 } from 'uuid';

const seedOrders = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const session = await Session.findOne({ order: [['createdAt', 'DESC']] });
        if (!session) {
            console.log('No session found. Create a session first.');
            return;
        }

        const tables = await Table.findAll({ limit: 3 });
        const products = await Product.findAll({ limit: 5 });

        if (tables.length < 3 || products.length < 3) {
            console.log('Not enough tables or products to seed.');
            return;
        }

        const orderData = [
            { table: tables[0], items: [products[0], products[1]], status: 'in-kitchen' },
            { table: tables[1], items: [products[2]], status: 'preparing' },
            { table: tables[2], items: [products[3], products[4]], status: 'running' }
        ];

        for (const data of orderData) {
            const orderId = uuidv4();
            const subtotal = data.items.reduce((sum, p) => sum + parseFloat(p.price), 0);
            const total = subtotal * 1.05; // 5% tax

            await Order.create({
                id: orderId,
                tableId: data.table.id,
                sessionId: session.id,
                subtotal: subtotal,
                tax: subtotal * 0.05,
                total: total,
                status: data.status,
                customerName: 'Default Guest'
            });

            for (const p of data.items) {
                await OrderItem.create({
                    id: uuidv4(),
                    orderId: orderId,
                    productId: p.id,
                    name: p.name,
                    price: p.price,
                    quantity: 1
                });
            }

            await data.table.update({ status: 'occupied' });
            console.log(`Created order for Table ${data.table.number} with status ${data.status}`);
        }

        console.log('Successfully seeded 3 default orders.');
    } catch (error) {
        console.error('Failed to seed orders:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

seedOrders();
