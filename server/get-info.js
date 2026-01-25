import sequelize from './config/db.js';
import Session from './models/Session.js';
import Table from './models/Table.js';
import Product from './models/Product.js';

const getInfo = async () => {
    try {
        await sequelize.authenticate();
        const session = await Session.findOne({ order: [['createdAt', 'DESC']] });
        const tables = await Table.findAll({ limit: 3 });
        const products = await Product.findAll({ limit: 3 });

        console.log(JSON.stringify({
            sessionId: session?.id,
            tables: tables.map(t => ({ id: t.id, number: t.number })),
            products: products.map(p => ({ id: p.id, name: p.name, price: p.price }))
        }, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

getInfo();
