import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";

import { errorMiddleware } from "./api/middleware/error.middleware";
import { notFoundMiddleware } from "./api/middleware/not-found.middleware";
import { requestLogger } from "./api/middleware/request-logger.middleware";
import { apiRouter } from "./api/routes";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.use("/api/v1", apiRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
