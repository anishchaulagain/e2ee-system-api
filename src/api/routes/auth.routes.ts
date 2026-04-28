import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import rateLimit from "express-rate-limit";

export const authRouter = Router();

// Rate limit auth endpoints to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  message: { error: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post("/register", authLimiter, (req, res, next) =>
  AuthController.register(req, res, next),
);
authRouter.post("/login", authLimiter, (req, res, next) => AuthController.login(req, res, next));
authRouter.post("/refresh", (req, res, next) => AuthController.refresh(req, res, next));
authRouter.post("/logout", (req, res, next) => AuthController.logout(req, res, next));
