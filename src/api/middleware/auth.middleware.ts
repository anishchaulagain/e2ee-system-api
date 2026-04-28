import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { HttpError } from "../../utils/http-error";
import type { JwtPayload } from "../../domain/entities";

// Extend Express Request to carry authenticated user data
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * JWT authentication middleware.
 * Expects: Authorization: Bearer <access_token>
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw HttpError.unauthorized("Missing or malformed authorization header");
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    throw HttpError.unauthorized("Invalid or expired access token");
  }
}
