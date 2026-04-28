import { type NextFunction, type Request, type Response } from "express";
import { ConversationService } from "../../services/conversation.service";
import { createConversationSchema } from "../validators/message.validators";

export const ConversationController = {
  /** POST /conversations — create a 1-to-1 conversation */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = createConversationSchema.parse(req.body);
      const conversation = await ConversationService.createDirect(
        req.user!.sub,
        body.participantId,
      );
      res.status(201).json({ data: conversation });
    } catch (err) {
      next(err);
    }
  },

  /** GET /conversations — list all conversations for the current user */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const conversations = await ConversationService.listForUser(req.user!.sub);
      res.json({ data: conversations });
    } catch (err) {
      next(err);
    }
  },

  /** GET /conversations/:id — get a single conversation */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const conversation = await ConversationService.getById(
        req.params.id as string,
        req.user!.sub,
      );
      res.json({ data: conversation });
    } catch (err) {
      next(err);
    }
  },
};
