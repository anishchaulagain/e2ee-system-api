import { type NextFunction, type Request, type Response } from "express";
import { AuthService } from "../../services/auth.service";
import { registerSchema, loginSchema, refreshSchema } from "../validators/auth.validators";

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = registerSchema.parse(req.body);
      const result = await AuthService.register(
        body.username,
        body.email,
        body.password,
        body.publicKey,
      );
      res.status(201).json({
        message: "User registered successfully",
        data: {
          userId: result.userId,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = loginSchema.parse(req.body);
      const result = await AuthService.login(body.identifier, body.password);
      res.json({
        message: "Login successful",
        data: {
          userId: result.userId,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = refreshSchema.parse(req.body);
      const tokens = await AuthService.refresh(body.refreshToken);
      res.json({
        message: "Tokens refreshed",
        data: tokens,
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = refreshSchema.parse(req.body);
      await AuthService.logout(body.refreshToken);
      res.json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  },
};
