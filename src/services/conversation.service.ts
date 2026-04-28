import { pool } from "../infra/database";
import { HttpError } from "../utils/http-error";
import type { Conversation, ConversationWithParticipants, UserPublic } from "../domain/entities";

export const ConversationService = {
  /**
   * Create a 1-to-1 conversation between two users.
   * Returns existing conversation if one already exists between them.
   */
  async createDirect(
    currentUserId: string,
    otherUserId: string,
  ): Promise<ConversationWithParticipants> {
    // Check if a direct conversation already exists between these two users
    const existing = await pool.query<{ conversation_id: string }>(
      `SELECT cp1.conversation_id
       FROM conversation_participants cp1
       JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
       JOIN conversations c ON c.id = cp1.conversation_id
       WHERE cp1.user_id = $1 AND cp2.user_id = $2 AND c.is_group = FALSE`,
      [currentUserId, otherUserId],
    );

    if (existing.rows.length > 0) {
      return this.getById(existing.rows[0].conversation_id, currentUserId);
    }

    // Verify the other user exists
    const otherUser = await pool.query("SELECT id FROM users WHERE id = $1", [otherUserId]);
    if (otherUser.rows.length === 0) {
      throw HttpError.notFound("User not found");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const convResult = await client.query<Conversation>(
        `INSERT INTO conversations (is_group) VALUES (FALSE) RETURNING *`,
      );
      const conversation = convResult.rows[0];

      await client.query(
        `INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)`,
        [conversation.id, currentUserId, otherUserId],
      );

      await client.query("COMMIT");

      return this.getById(conversation.id, currentUserId);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  /** List all conversations for the current user */
  async listForUser(userId: string): Promise<ConversationWithParticipants[]> {
    const result = await pool.query<Conversation>(
      `SELECT c.*
       FROM conversations c
       JOIN conversation_participants cp ON cp.conversation_id = c.id
       WHERE cp.user_id = $1
       ORDER BY c.updated_at DESC`,
      [userId],
    );

    const conversations: ConversationWithParticipants[] = [];
    for (const conv of result.rows) {
      const participants = await this.getParticipants(conv.id);
      conversations.push({ ...conv, participants });
    }

    return conversations;
  },

  /** Get a single conversation by ID (verifies user is a participant) */
  async getById(conversationId: string, userId: string): Promise<ConversationWithParticipants> {
    const result = await pool.query<Conversation>(
      `SELECT c.*
       FROM conversations c
       JOIN conversation_participants cp ON cp.conversation_id = c.id
       WHERE c.id = $1 AND cp.user_id = $2`,
      [conversationId, userId],
    );

    if (result.rows.length === 0) {
      throw HttpError.notFound("Conversation not found");
    }

    const participants = await this.getParticipants(conversationId);
    return { ...result.rows[0], participants };
  },

  /** Get participants of a conversation */
  async getParticipants(conversationId: string): Promise<UserPublic[]> {
    const result = await pool.query<UserPublic>(
      `SELECT u.id, u.username, u.email, u.public_key, u.created_at
       FROM users u
       JOIN conversation_participants cp ON cp.user_id = u.id
       WHERE cp.conversation_id = $1`,
      [conversationId],
    );
    return result.rows;
  },

  /** Verify that a user is a participant in a conversation */
  async verifyParticipant(conversationId: string, userId: string): Promise<boolean> {
    const result = await pool.query(
      "SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2",
      [conversationId, userId],
    );
    return result.rows.length > 0;
  },
};
