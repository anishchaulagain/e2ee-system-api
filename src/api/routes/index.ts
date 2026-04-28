import { Router } from "express";
import { healthRouter } from "./health.routes";
import { homeRouter } from "./home.routes";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.routes";
import { conversationRouter } from "./conversation.routes";

export const apiRouter = Router();

apiRouter.use("/", homeRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/conversations", conversationRouter);
