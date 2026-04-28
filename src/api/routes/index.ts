import { Router } from "express";
import { healthRouter } from "./health.routes";
import { homeRouter } from "./home.routes";

export const apiRouter = Router();

apiRouter.use("/", homeRouter);
apiRouter.use("/health", healthRouter);
