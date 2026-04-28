import { pool } from "../infra/database";
import { HttpError } from "../utils/http-error";
import { ConversationService } from "./conversation.service";
import type { Message } from "../domain/entities";

export const MessageService = {
  /**
   * Store an encrypted message.
   * The server NEVER decrypts — it only stores the ciphertext blob.
   */
  async send(
    conversationId: string,
    senderId: string,
    ciphertext: string,
    nonce: string,
  ): Promise<Message> {
    // Verify sender is a participant
    const isParticipant = await ConversationService.verifyParticipant(conversationId, senderId);
    if (!isParticipant) {
      throw HttpError.forbidden("You are not a participant of this conversation");
    }

    const result = await pool.query<Message>(
      `INSERT INTO messages (conversation_id, sender_id, ciphertext, nonce)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [conversationId, senderId, ciphertext, nonce],
    );

    // Update conversation's updated_at timestamp
    await pool.query("UPDATE conversations SET updated_at = NOW() WHERE id = $1", [conversationId]);

    return result.rows[0];
  },

  /** Get paginated messages for a conversation (newest first) */
  async list(
    conversationId: string,
    userId: string,
    page: number = 1,
    pageSize: number = 50,
  ): Promise<{ messages: Message[]; total: number }> {
    // Verify user is a participant
    const isParticipant = await ConversationService.verifyParticipant(conversationId, userId);
    if (!isParticipant) {
      throw HttpError.forbidden("You are not a participant of this conversation");
    }

    const offset = (page - 1) * pageSize;

    const [messagesResult, countResult] = await Promise.all([
      pool.query<Message>(
        `SELECT * FROM messages
         WHERE conversation_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [conversationId, pageSize, offset],
      ),
      pool.query<{ count: string }>("SELECT COUNT(*) FROM messages WHERE conversation_id = $1", [
        conversationId,
      ]),
    ]);

    return {
      messages: messagesResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  },
};
