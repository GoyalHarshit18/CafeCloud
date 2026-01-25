import sequelize from './config/db.js';
import Order from './models/Order.js';
import OrderItem from './models/OrderItem.js';
import Table from './models/Table.js';
import Product from './models/Product.js';
import { v4 as uuidv4 } from 'uuid';

const updateT7Order = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Find Table T-7
        const tableT7 = await Table.findOne({ where: { number: 7 } });
        if (!tableT7) {
            console.log('Table T-7 not found.');
            return;
        }

        // 2. Find the active order for T7
        const order = await Order.findOne({
            where: { tableId: tableT7.id, status: ['running', 'in-kitchen', 'preparing', 'ready'] },
            order: [['createdAt', 'DESC']]
        });

        if (!order) {
            console.log('No active order found for Table T-7.');
            return;
        }

        // 3. Find or Create specific products with "Pizza Prices" (approx 299)
        const productsToSet = [
            { name: 'Chocolate Lava Cake', price: 299, category: 'desserts', image: 'http://localhost:5000/public/uploads/dessert.jpg' },
            { name: 'Iced Latte', price: 199, category: 'beverages', image: 'http://localhost:5000/public/uploads/coffee.jpg' }
        ];

        const productIds = [];
        for (const pData of productsToSet) {
            let p = await Product.findOne({ where: { name: pData.name } });
            if (!p) {
                p = await Product.create({
                    id: uuidv4(),
                    ...pData
                });
            } else {
                // Update price and image to match request
                await p.update({ price: pData.price, image: pData.image });
            }
            productIds.push(p);
        }

        // 4. Remove previous items
        await OrderItem.destroy({ where: { orderId: order.id } });
        console.log('Previous items removed from T-7 order.');

        // 5. Add new items
        let subtotal = 0;
        for (const p of productIds) {
            await OrderItem.create({
                id: uuidv4(),
                orderId: order.id,
                productId: p.id,
                name: p.name,
                price: p.price,
                quantity: 1
            });
            subtotal += parseFloat(p.price);
        }

        // 6. Update order total
        const tax = subtotal * 0.05;
        await order.update({
            subtotal: subtotal,
            tax: tax,
            total: subtotal + tax
        });

        console.log('Table T-7 order updated with Chocolate Lava Cake and Iced Latte.');
    } catch (error) {
        console.error('Update failed:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

updateT7Order();
