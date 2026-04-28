import { Router } from "express";
import { ConversationController } from "../controllers/conversation.controller";
import { MessageController } from "../controllers/message.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const conversationRouter = Router();

// All conversation routes require authentication
conversationRouter.use(authMiddleware);

conversationRouter.post("/", (req, res, next) => ConversationController.create(req, res, next));
conversationRouter.get("/", (req, res, next) => ConversationController.list(req, res, next));
conversationRouter.get("/:id", (req, res, next) => ConversationController.getById(req, res, next));

// Nested message routes under conversations
conversationRouter.post("/:id/messages", (req, res, next) =>
  MessageController.send(req, res, next),
);
conversationRouter.get("/:id/messages", (req, res, next) => MessageController.list(req, res, next));
