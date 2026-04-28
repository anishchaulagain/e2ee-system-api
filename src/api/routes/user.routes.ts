import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const userRouter = Router();

// All user routes require authentication
userRouter.use(authMiddleware);

userRouter.get("/me", UserController.me);
userRouter.put("/me/public-key", UserController.updatePublicKey);
userRouter.get("/search", UserController.search);
userRouter.get("/:id/public-key", UserController.getPublicKey);
