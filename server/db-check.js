import sequelize from './config/db.js';
import Product from './models/Product.js';
import Branch from './models/Branch.js';
import User from './models/User.js';

async function checkDB() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const branches = await Branch.findAll();
        console.log('Found branches:', branches.map(b => ({ id: b.id, name: b.name })));

        const users = await User.findAll({ attributes: ['id', 'username', 'role', 'branchId'] });
        console.log('Users:', users.map(u => ({ id: u.id, name: u.username, role: u.role, branchId: u.branchId })));

        const products = await Product.findAll();
        console.log('Total products in DB:', products.length);
        console.log('Products:', products.map(p => ({
            id: p.id,
            name: p.name,
            branchId: p.branchId,
            category: p.category,
            isAvailable: p.isAvailable
        })));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkDB();
