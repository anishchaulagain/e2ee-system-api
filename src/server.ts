import "dotenv/config";
import http from "http";
import { createApp } from "./app";
import { config } from "./config";
import { logger } from "./utils/logger";
import { connectDatabase, runMigrations } from "./infra/database";
import { seedUsers } from "./infra/seed";
import { setupSocket } from "./socket";

async function bootstrap(): Promise<void> {
  // 1. Connect to PostgreSQL
  await connectDatabase();

  // 2. Run migrations (idempotent — safe to run every startup)
  await runMigrations();

  // 3. Seed users from .env (skips if already exist)
  await seedUsers();

  // 4. Create Express app + HTTP server
  const app = createApp();
  const server = http.createServer(app);

  // 5. Attach Socket.IO for real-time messaging
  setupSocket(server);

  // 6. Start listening
  server.listen(config.port, config.host, () => {
    logger.info(
      { port: config.port, host: config.host, env: config.nodeEnv },
      "Server started",
    );
  });
}

bootstrap().catch((err) => {
  logger.fatal(err, "Failed to start server");
  process.exit(1);
});
