import 'dotenv/config';
import fs from 'fs';
import postgres from 'postgres';

const sql = postgres(process.env.DIRECT_URL, { prepare: false });

async function main() {
  try {
    const initSql = fs.readFileSync('init.sql', 'utf8');
    // split the sql file by semi-colons and execute each statement
    // since pgbouncer transaction mode might not like multiple statements in one query
    const statements = initSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of statements) {
      await sql.unsafe(stmt + ';');
    }
    console.log("Schema executed successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
main();
