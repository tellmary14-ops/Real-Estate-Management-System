import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  name: "golden-eggs-api",
  level: env.nodeEnv === "production" ? "info" : "debug",
  transport:
    env.nodeEnv === "production"
      ? undefined
      : { target: "pino-pretty", options: { colorize: true } },
});
