import { type Request, type Response } from "express";

export const HealthController = {
  check: (_req: Request, res: Response): void => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  },
};
