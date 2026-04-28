import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { logger } from "../utils/logger";
import { ConversationService } from "../services/conversation.service";
import type { JwtPayload } from "../domain/entities";

let io: Server | null = null;

// Track online users: userId -> Set of socket IDs
const onlineUsers = new Map<string, Set<string>>();

export function getIO(): Server | null {
  return io;
}

export function setupSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: "*", // React Native needs wildcard; tighten in production
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const payload = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
      (socket as Socket & { user: JwtPayload }).user = payload;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const user = (socket as Socket & { user: JwtPayload }).user;
    logger.info({ userId: user.sub, socketId: socket.id }, "Socket connected");

    // Track online status
    if (!onlineUsers.has(user.sub)) {
      onlineUsers.set(user.sub, new Set());
    }
    onlineUsers.get(user.sub)!.add(socket.id);

    // Broadcast online status
    io!.emit("user_online", { userId: user.sub, online: true });

    // Auto-join all conversation rooms this user belongs to
    try {
      const conversations = await ConversationService.listForUser(user.sub);
      for (const conv of conversations) {
        socket.join(`conversation:${conv.id}`);
      }
      logger.info({ userId: user.sub, rooms: conversations.length }, "Joined conversation rooms");
    } catch (err) {
      logger.error(err, "Failed to join conversation rooms");
    }

    // Join a specific conversation room (e.g., after creating a new conversation)
    socket.on("join_conversation", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      logger.debug({ userId: user.sub, conversationId }, "Joined conversation room");
    });

    // Typing indicator
    socket.on("typing", (data: { conversationId: string; isTyping: boolean }) => {
      socket.to(`conversation:${data.conversationId}`).emit("typing", {
        userId: user.sub,
        username: user.username,
        conversationId: data.conversationId,
        isTyping: data.isTyping,
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      logger.info({ userId: user.sub, socketId: socket.id }, "Socket disconnected");

      const userSockets = onlineUsers.get(user.sub);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(user.sub);
          // User is fully offline
          io!.emit("user_online", { userId: user.sub, online: false });
        }
      }
    });
  });

  logger.info("Socket.IO initialized");
  return io;
}
