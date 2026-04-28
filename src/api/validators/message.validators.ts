import { z } from "zod";

export const sendMessageSchema = z.object({
  ciphertext: z.string().min(1, "Ciphertext is required"),
  nonce: z.string().min(1, "Nonce is required"),
});

export const createConversationSchema = z.object({
  participantId: z.string().uuid("Invalid participant ID"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
});

export const updatePublicKeySchema = z.object({
  publicKey: z.string().min(1, "Public key is required"),
});

export const searchUsersSchema = z.object({
  q: z.string().min(1, "Search query is required"),
});
