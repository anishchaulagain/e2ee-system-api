import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "../infra/database";
import { config } from "../config";
import { HttpError } from "../utils/http-error";
import type { User, JwtPayload, TokenPair } from "../domain/entities";

const BCRYPT_ROUNDS = 12;

export const AuthService = {
  /**
   * Register a new user.
   * Public key is optional — mobile app sets it after first login.
   */
  async register(
    username: string,
    email: string,
    password: string,
    publicKey?: string,
  ): Promise<TokenPair & { userId: string }> {
    // Check for duplicate username or email
    const existing = await pool.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email],
    );
    if (existing.rows.length > 0) {
      throw HttpError.badRequest("Username or email already taken");
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const result = await pool.query<Pick<User, "id">>(
      `INSERT INTO users (username, email, password_hash, public_key)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [username, email, passwordHash, publicKey || null],
    );

    const userId = result.rows[0].id;
    const tokens = await this.generateTokens({ sub: userId, username });
    return { ...tokens, userId };
  },

  /** Log in with username/email + password */
  async login(identifier: string, password: string): Promise<TokenPair & { userId: string }> {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE username = $1 OR email = $1",
      [identifier],
    );

    if (result.rows.length === 0) {
      throw HttpError.unauthorized("Invalid credentials");
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw HttpError.unauthorized("Invalid credentials");
    }

    const tokens = await this.generateTokens({ sub: user.id, username: user.username });
    return { ...tokens, userId: user.id };
  },

  /** Refresh the access token using a valid refresh token */
  async refresh(refreshToken: string): Promise<TokenPair> {
    // Verify the refresh token signature
    let payload: JwtPayload;
    try {
      payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload;
    } catch {
      throw HttpError.unauthorized("Invalid or expired refresh token");
    }

    // Check if refresh token exists in DB (not revoked)
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const result = await pool.query(
      "SELECT id FROM refresh_tokens WHERE token_hash = $1 AND expires_at > NOW()",
      [tokenHash],
    );

    if (result.rows.length === 0) {
      throw HttpError.unauthorized("Refresh token revoked or expired");
    }

    // Rotate: delete old, issue new
    await pool.query("DELETE FROM refresh_tokens WHERE token_hash = $1", [tokenHash]);

    return this.generateTokens({ sub: payload.sub, username: payload.username });
  },

  /** Revoke a refresh token (logout) */
  async logout(refreshToken: string): Promise<void> {
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await pool.query("DELETE FROM refresh_tokens WHERE token_hash = $1", [tokenHash]);
  },

  /** Generate an access + refresh token pair and persist the refresh token hash */
  async generateTokens(payload: JwtPayload): Promise<TokenPair> {
    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    // Persist hashed refresh token
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + parseDuration(config.jwt.refreshExpiresIn));
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [payload.sub, tokenHash, expiresAt],
    );

    return { accessToken, refreshToken };
  },
};

/** Parse duration strings like "7d", "15m", "1h" to milliseconds */
function parseDuration(dur: string): number {
  const match = dur.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
  const val = parseInt(match[1], 10);
  switch (match[2]) {
    case "s": return val * 1000;
    case "m": return val * 60 * 1000;
    case "h": return val * 60 * 60 * 1000;
    case "d": return val * 24 * 60 * 60 * 1000;
    default:  return 7 * 24 * 60 * 60 * 1000;
  }
}
