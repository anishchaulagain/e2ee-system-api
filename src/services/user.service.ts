import { pool } from "../infra/database";
import { HttpError } from "../utils/http-error";
import type { User, UserPublic } from "../domain/entities";

/** Strip sensitive fields from a user row */
function toPublic(row: User): UserPublic {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    public_key: row.public_key,
    created_at: row.created_at,
  };
}

export const UserService = {
  /** Get the current authenticated user's profile */
  async getById(userId: string): Promise<UserPublic> {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE id = $1",
      [userId],
    );
    if (result.rows.length === 0) {
      throw HttpError.notFound("User not found");
    }
    return toPublic(result.rows[0]);
  },

  /** Fetch another user's public key (for E2EE key exchange) */
  async getPublicKey(userId: string): Promise<{ id: string; username: string; public_key: string }> {
    const result = await pool.query<Pick<User, "id" | "username" | "public_key">>(
      "SELECT id, username, public_key FROM users WHERE id = $1",
      [userId],
    );
    if (result.rows.length === 0) {
      throw HttpError.notFound("User not found");
    }
    const user = result.rows[0];
    if (!user.public_key) {
      throw HttpError.badRequest("User has not registered their encryption key yet");
    }
    return { id: user.id, username: user.username, public_key: user.public_key };
  },

  /** Update the current user's public key (called by mobile app on first setup) */
  async updatePublicKey(userId: string, publicKey: string): Promise<void> {
    await pool.query(
      "UPDATE users SET public_key = $1, updated_at = NOW() WHERE id = $2",
      [publicKey, userId],
    );
  },

  /** Search users by username (for starting new conversations) */
  async search(query: string, currentUserId: string): Promise<UserPublic[]> {
    const result = await pool.query<User>(
      `SELECT * FROM users
       WHERE username ILIKE $1 AND id != $2
       ORDER BY username
       LIMIT 20`,
      [`%${query}%`, currentUserId],
    );
    return result.rows.map(toPublic);
  },
};
