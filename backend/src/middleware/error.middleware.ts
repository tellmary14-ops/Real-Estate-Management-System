import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
import { sendError } from "../utils/ApiResponse.js";
import { formatValidationErrors } from "../utils/formatValidationErrors.js";
import { logger } from "../utils/logger.js";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    logger.warn({ step: "api:error", status: err.statusCode, message: err.message });
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  if (err instanceof ZodError) {
    const { errors, message } = formatValidationErrors(err);
    logger.warn({ step: "validation:error", errors });
    return sendError(res, message, 400, errors);
  }

  if (err instanceof multer.MulterError) {
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "Each image must be 5 MB or smaller"
        : err.code === "LIMIT_FILE_COUNT"
          ? "You can upload up to 10 images"
          : "Could not upload images — please try again";
    return sendError(res, msg, 400, [{ field: "images", label: "Images", message: msg }]);
  }

  if (err instanceof Error && err.message === "Only image files are allowed") {
    return sendError(res, err.message, 400, [{ field: "images", label: "Images", message: err.message }]);
  }

  const message = err instanceof Error ? err.message : "Something went wrong";
  logger.error({ step: "unhandled:error", message });
  return sendError(res, "Something went wrong. Please try again later", 500);
}
