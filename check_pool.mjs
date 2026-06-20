// Test with pooled URL (what Vercel uses at runtime)
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('Testing DATABASE_URL (pooled)...');
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1
});

async function main() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT COUNT(*) FROM "Product"');
    console.log('✅ Pooled connection works. Product count:', res.rows[0].count);
    client.release();
  } catch (err) {
    console.error('❌ Pooled connection FAILED:', err.message);
  } finally {
    await pool.end();
  }
}

main();
