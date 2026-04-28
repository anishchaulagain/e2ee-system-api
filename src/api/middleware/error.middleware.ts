import { type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../../utils/http-error";
import { logger } from "../../utils/logger";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation error", details: err.flatten().fieldErrors });
    return;
  }

  logger.error(err, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
}
