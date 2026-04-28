// ─── User ──────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  public_key: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserPublic {
  id: string;
  username: string;
  email: string;
  public_key: string | null;
  created_at: Date;
}

// ─── Conversation ──────────────────────────────────────
export interface Conversation {
  id: string;
  title: string | null;
  is_group: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ConversationWithParticipants extends Conversation {
  participants: UserPublic[];
}

// ─── Message (encrypted blob — server never decrypts) ──
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  ciphertext: string; // AES-256-GCM encrypted (base64)
  nonce: string; // 12-byte IV (base64)
  created_at: Date;
}

// ─── Auth / JWT ────────────────────────────────────────
export interface JwtPayload {
  sub: string; // user id
  username: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshToken {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
}
