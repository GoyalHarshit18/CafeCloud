import sequelize from './config/db.js';
import Floor from './models/Floor.js';
import Table from './models/Table.js';
import { v4 as uuidv4 } from 'uuid';

const fixAndAddTables = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const floorsData = [
            { name: 'Ground Floor', count: 12, start: 1 },
            { name: 'First Floor', count: 12, start: 13 },
            { name: 'Second Floor', count: 12, start: 25 }
        ];

        for (const fData of floorsData) {
            const [floor] = await Floor.findOrCreate({
                where: { name: fData.name },
                defaults: { id: uuidv4(), name: fData.name }
            });

            console.log(`Processing ${floor.name} (${floor.id})`);

            for (let i = 0; i < fData.count; i++) {
                const num = fData.start + i;
                const existing = await Table.findOne({ where: { number: num, floorId: floor.id } });

                if (!existing) {
                    await Table.create({
                        id: uuidv4(),
                        number: num,
                        seats: 4,
                        floorId: floor.id,
                        status: 'free'
                    });
                    console.log(`- Created T-${num}`);
                }
            }
        }

        console.log('Tables setup complete.');
    } catch (error) {
        console.error('Operation failed:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

fixAndAddTables();
