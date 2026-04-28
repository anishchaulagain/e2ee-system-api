import { type NextFunction, type Request, type Response } from "express";
import { MessageService } from "../../services/message.service";
import { sendMessageSchema, paginationSchema } from "../validators/message.validators";

export const MessageController = {
  /** POST /conversations/:id/messages — send an encrypted message */
  async send(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = sendMessageSchema.parse(req.body);
      const message = await MessageService.send(
        req.params.id as string,
        req.user!.sub,
        body.ciphertext,
        body.nonce,
      );

      // Emit via Socket.IO for real-time delivery (imported at runtime to avoid circular deps)
      const { getIO } = await import("../../socket");
      const io = getIO();
      if (io) {
        // Emit to the conversation room — only participants who are online will receive it
        io.to(`conversation:${req.params.id as string}`).emit("new_message", {
          message,
        });
      }

      res.status(201).json({ data: message });
    } catch (err) {
      next(err);
    }
  },

  /** GET /conversations/:id/messages — get paginated messages */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = paginationSchema.parse(req.query);
      const result = await MessageService.list(
        req.params.id as string,
        req.user!.sub,
        pagination.page,
        pagination.pageSize,
      );
      res.json({
        data: result.messages,
        meta: {
          total: result.total,
          page: pagination.page,
          pageSize: pagination.pageSize,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
