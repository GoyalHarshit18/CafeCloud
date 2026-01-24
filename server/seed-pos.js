import sequelize from './config/db.js';
import Branch from './models/Branch.js';
import Floor from './models/Floor.js';
import Table from './models/Table.js';
import Product from './models/Product.js';
import User from './models/User.js';

const seed = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database cleared and synced');

        // Create a default branch
        const branch = await Branch.create({
            name: 'Main Branch',
            address: '123 Coffee Lane',
            phone: '1234567890'
        });

        // Create floors
        const groundFloor = await Floor.create({ name: 'Ground Floor', branchId: branch.id });
        const firstFloor = await Floor.create({ name: 'First Floor', branchId: branch.id });

        // Create tables for Ground Floor
        const groundTables = [];
        for (let i = 1; i <= 10; i++) {
            groundTables.push({
                number: i,
                seats: i % 2 === 0 ? 4 : 2,
                status: 'free',
                floorId: groundFloor.id
            });
        }
        await Table.bulkCreate(groundTables);

        // Create products
        const products = [
            { name: 'Margherita Pizza', price: 299, category: 'pizza', image: 'http://localhost:5000/public/uploads/pizza.jpg', description: 'Classic tomato, mozzarella & fresh basil' },
            { name: 'Pepperoni Pizza', price: 399, category: 'pizza', image: 'http://localhost:5000/public/uploads/pizza.jpg', description: 'Loaded with spicy pepperoni' },
            { name: 'Classic Cheeseburger', price: 249, category: 'burgers', image: 'http://localhost:5000/public/uploads/burger.jpg', description: 'Beef patty with cheddar & pickles' },
            { name: 'French Fries', price: 99, category: 'sides', image: 'http://localhost:5000/public/uploads/fries.jpg', description: 'Crispy golden fries with seasoning' },
            { name: 'Cappuccino', price: 149, category: 'beverages', image: 'http://localhost:5000/public/uploads/coffee.jpg', description: 'Espresso with steamed milk foam' },
            { name: 'Chocolate Lava Cake', price: 199, category: 'desserts', image: 'http://localhost:5000/public/uploads/dessert.jpg', description: 'Warm cake with molten center' },
        ];
        await Product.bulkCreate(products);

        // Create an admin user
        await User.create({
            username: 'admin',
            email: 'admin@cafe.com',
            password: 'password123',
            role: 'admin',
            verified: true
        });

        console.log('Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
