import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

async function checkUsers() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const result = await pool.query("SELECT id, username, email FROM users;");
    console.log("Users in DB:");
    console.table(result.rows);
  } catch (err) {
    console.error("Error checking users:", err);
  } finally {
    await pool.end();
  }
}

checkUsers();
