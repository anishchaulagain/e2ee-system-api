import bcrypt from "bcrypt";
import { pool } from "./database";
import { config } from "../config";
import { logger } from "../utils/logger";

const BCRYPT_ROUNDS = 12;

/**
 * Seeds users from env config on startup.
 * Skips any user that already exists (by username or email).
 */
export async function seedUsers(): Promise<void> {
  if (config.seedUsers.length === 0) {
    logger.info("No seed users configured — skipping");
    return;
  }

  for (const user of config.seedUsers) {
    const existing = await pool.query("SELECT id FROM users WHERE username = $1 OR email = $2", [
      user.username,
      user.email,
    ]);

    if (existing.rows.length > 0) {
      logger.info({ username: user.username }, "Seed user already exists — skipping");
      continue;
    }

    const passwordHash = await bcrypt.hash(user.password, BCRYPT_ROUNDS);

    await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)`,
      [user.username, user.email, passwordHash],
    );

    logger.info({ username: user.username }, "Seed user created");
  }
}
