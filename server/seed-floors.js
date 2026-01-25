import sequelize from './config/db.js';
import Floor from './models/Floor.js';
import Table from './models/Table.js';

const seedFloors = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const floors = [
            { name: 'Ground Floor', tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
            { name: 'First Floor', tables: [11, 12, 13, 14, 15, 16] },
            { name: 'Second Floor', tables: [21, 22, 23, 24] }
        ];

        for (const f of floors) {
            const [floor, created] = await Floor.findOrCreate({
                where: { name: f.name },
                defaults: { name: f.name }
            });

            if (created) {
                console.log(`Created ${f.name}`);

                // Create default tables
                for (const tNum of f.tables) {
                    await Table.create({
                        number: tNum,
                        seats: 4,
                        floorId: floor.id,
                        status: 'free'
                    });
                }
                console.log(`- Added ${f.tables.length} tables to ${f.name}`);
            } else {
                console.log(`- ${f.name} already exists`);
            }
        }

    } catch (error) {
        console.error('Seed failed:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

seedFloors();
