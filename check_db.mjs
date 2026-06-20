import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DIRECT_URL });

async function main() {
  const client = await pool.connect();
  try {
    // Check tables
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    console.log('\n=== TABLES IN DATABASE ===');
    if (tables.rows.length === 0) {
      console.log('❌ NO TABLES FOUND - migrations never ran!');
    } else {
      tables.rows.forEach(r => console.log('✅', r.table_name));
    }

    // Check product count
    if (tables.rows.some(r => r.table_name === 'Product')) {
      const count = await client.query('SELECT COUNT(*) FROM "Product"');
      console.log(`\n=== PRODUCT COUNT: ${count.rows[0].count} ===`);
    }

    // Check events
    if (tables.rows.some(r => r.table_name === 'events')) {
      const evCount = await client.query('SELECT COUNT(*) FROM "events"');
      console.log(`=== EVENT COUNT: ${evCount.rows[0].count} ===`);
    }

  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
