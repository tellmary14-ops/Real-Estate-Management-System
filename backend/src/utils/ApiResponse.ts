import type { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendPaginated<T>(
  res: Response,
  message: string,
  data: T[],
  meta: { page: number; limit: number; total: number; totalPages: number }
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta,
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors: unknown[] = []
) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
