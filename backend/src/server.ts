import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import "./config/cloudinary.js";

async function bootstrap() {
  logger.info({ step: "server:starting", app: env.appName });
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info({
      step: "server:ready",
      port: env.port,
      api: `http://localhost:${env.port}${env.apiPrefix}`,
    });
  });

  const shutdown = async (signal: string) => {
    logger.info({ step: "server:shutdown", signal });
    server.close();
    await disconnectDatabase();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

bootstrap().catch((err) => {
  logger.error({ step: "server:fatal", message: err instanceof Error ? err.message : err });
  process.exit(1);
});
