import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const userRouter = Router();

// All user routes require authentication
userRouter.use(authMiddleware);

userRouter.get("/me", (req, res, next) => UserController.me(req, res, next));
userRouter.put("/me/public-key", (req, res, next) =>
  UserController.updatePublicKey(req, res, next),
);
userRouter.get("/search", (req, res, next) => UserController.search(req, res, next));
userRouter.get("/:id/public-key", (req, res, next) => UserController.getPublicKey(req, res, next));
