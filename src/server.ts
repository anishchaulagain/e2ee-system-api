import "dotenv/config";
import { createApp } from "./app";
import { config } from "./config";
import { logger } from "./utils/logger";

const app = createApp();

app.listen(config.port, config.host, () => {
  logger.info({ port: config.port, host: config.host, env: config.nodeEnv }, "Server started");
});
