import sequelize from './config/db.js';
import Floor from './models/Floor.js';
import Table from './models/Table.js';
import Branch from './models/Branch.js';

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Connected to Supabase DB.');

        // Find or create a default branch
        const [branch] = await Branch.findOrCreate({
            where: { name: 'Main Branch' },
            defaults: { name: 'Main Branch', address: '123 Coffee Lane', phone: '1234567890' }
        });
        console.log(`Using branch: ${branch.name} (ID: ${branch.id})`);

        const floorsData = [
            { name: 'Ground Floor', tables: [1, 2, 3, 4, 5, 6] },
            { name: 'First Floor', tables: [11, 12, 13, 14] }
        ];

        for (const f of floorsData) {
            const [floor] = await Floor.findOrCreate({
                where: { name: f.name, branchId: branch.id },
                defaults: { name: f.name, branchId: branch.id }
            });
            console.log(`Floor: ${floor.name}`);

            for (const tNum of f.tables) {
                await Table.findOrCreate({
                    where: { number: tNum, floorId: floor.id },
                    defaults: {
                        number: tNum,
                        seats: 4,
                        status: 'free',
                        floorId: floor.id,
                        branchId: branch.id
                    }
                });
            }
            console.log(`- Ensured ${f.tables.length} tables for ${f.name}`);
        }

        console.log('Seeding completed successfully!');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

seed();
