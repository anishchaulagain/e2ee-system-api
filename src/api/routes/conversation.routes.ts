import { Router } from "express";
import { ConversationController } from "../controllers/conversation.controller";
import { MessageController } from "../controllers/message.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const conversationRouter = Router();

// All conversation routes require authentication
conversationRouter.use(authMiddleware);

conversationRouter.post("/", ConversationController.create);
conversationRouter.get("/", ConversationController.list);
conversationRouter.get("/:id", ConversationController.getById);

// Nested message routes under conversations
conversationRouter.post("/:id/messages", MessageController.send);
conversationRouter.get("/:id/messages", MessageController.list);
