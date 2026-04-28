import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  publicKey: z.string().optional(), // X25519 public key (base64) — can be set later
});

export const loginSchema = z.object({
  identifier: z.string().min(1), // username or email
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
