import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";

export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
  ],
});

prisma.$on("query", (e) => {
  logger.debug({ step: "prisma:query", durationMs: e.duration, query: e.query });
});

prisma.$on("error", (e) => {
  logger.error({ step: "prisma:error", message: e.message });
});

export async function connectDatabase(): Promise<void> {
  logger.info({ step: "db:connecting" });
  await prisma.$connect();
  logger.info({ step: "db:connected" });
}

export async function disconnectDatabase(): Promise<void> {
  logger.info({ step: "db:disconnecting" });
  await prisma.$disconnect();
  logger.info({ step: "db:disconnected" });
}
