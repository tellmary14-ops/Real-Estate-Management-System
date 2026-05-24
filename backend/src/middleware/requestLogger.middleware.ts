import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  logger.info({ step: "request:start", method: req.method, path: req.path });

  res.on("finish", () => {
    logger.info({
      step: "request:complete",
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
    });
  });

  next();
}
