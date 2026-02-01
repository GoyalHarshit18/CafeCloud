import { Sequelize } from 'sequelize';

const url = "postgresql://postgres:%40Harshit%40123@db.ycdgrynuocechmmvyqbz.supabase.co:5432/postgres";
console.log('Testing direct connection to:', url.split('@')[1]);

const sequelize = new Sequelize(url, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        family: 4
    },
    logging: false
});

async function test() {
    try {
        console.log('Authenticating DIRECT (normal user)...');
        await sequelize.authenticate();
        console.log('Direct connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect DIRECT:', error);
        process.exit(1);
    }
}

test();
