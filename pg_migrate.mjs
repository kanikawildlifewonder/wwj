import 'dotenv/config';
import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected via pg!");
    
    const initSql = fs.readFileSync('init.sql', 'utf16le');
    const statements = initSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    for (let stmt of statements) {
      await client.query(stmt + ';');
    }
    
    console.log("Schema executed successfully via pg!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}
main();
