import { type Request, type Response } from "express";

export const HomeController = {
  index: (_req: Request, res: Response): void => {
    res.json({
      name: "End To End Encryption Chat Application",
      version: "0.1.0",
      docs: "/api/v1/docs",
    });
  },
};
