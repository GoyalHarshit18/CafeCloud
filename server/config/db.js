import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let finalUrl = process.env.DATABASE_URL;
let connectionMethod = "Primary (Pooler)";

// Automatic Failover Logic for Render
const isRender = process.env.RENDER || process.env.RENDER_SERVICE_ID;

if (isRender && finalUrl && finalUrl.includes('pooler.supabase.com')) {
  console.log('[DB] Render detected with Pooler URL. Probing connection...');

  // Quick probe to see if pooler is reachable
  const probeSequelize = new Sequelize(finalUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      connectTimeout: 5000,
      family: 4
    }
  });

  try {
    // Give it 5 seconds to authenticate
    await Promise.race([
      probeSequelize.authenticate(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Probe timeout')), 5000))
    ]);
    console.log('[DB] Pooler is reachable. Using primary connection.');
  } catch (err) {
    console.warn('[DB] Pooler probe failed or timed out:', err.message);
    console.log('[DB] Switching to DIRECT CONNECTION fallback...');

    // Convert Pooler URL to Direct URL
    // Pooler: postgresql://postgres.<id>:<pass>@<host>:6543/postgres
    // Direct: postgresql://postgres:<pass>@db.<id>.supabase.co:5432/postgres
    try {
      const urlMatch = finalUrl.match(/postgresql:\/\/postgres\.([^:]+):([^@]+)@/);
      if (urlMatch) {
        const projectId = urlMatch[1];
        const password = urlMatch[2];
        finalUrl = `postgresql://postgres:${password}@db.${projectId}.supabase.co:5432/postgres`;
        connectionMethod = "Fallback (Direct)";
        console.log('[DB] Failover URL constructed successfully.');
      } else {
        console.error('[DB] Could not parse DATABASE_URL for failover. Using original.');
      }
    } catch (parseErr) {
      console.error('[DB] Critical error parsing failover URL:', parseErr.message);
    }
  } finally {
    await probeSequelize.close().catch(() => { });
  }
}

// Initialize the main Sequelize instance
const sequelize = finalUrl
  ? new Sequelize(finalUrl, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      keepAlive: true,
      connectTimeout: 60000,
      family: 4
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
      evict: 1000
    },
    retry: {
      match: [/Deadlock/i, /SequelizeConnectionError/i, /SequelizeConnectionRefusedError/i, /SequelizeHostNotFoundError/i, /SequelizeHostNotReachableError/i, /SequelizeInvalidConnectionError/i, /SequelizeConnectionTimedOutError/i, /TimeoutError/i],
      max: 3
    }
  })
  : new Sequelize(
    process.env.DB_NAME || 'odoo_cafe_pos',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );

// Test the connection with retries
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log(`[DB] PostgreSQL connected via ${connectionMethod}`);
      return;
    } catch (err) {
      console.error(`[DB] Connection attempt ${i + 1} failed (${connectionMethod}):`, err.message);
      if (i < retries - 1) {
        console.log(`[DB] Retrying in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('[DB] Max retries reached. Exiting.');
        throw err;
      }
    }
  }
};

// Export both sequelize and the connect function
export { connectWithRetry, connectionMethod };
export default sequelize;
