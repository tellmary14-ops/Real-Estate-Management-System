import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

type RequestPart = "body" | "query" | "params";

export function validate(schema: ZodSchema, part: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[part]);
    if (!parsed.success) return next(parsed.error);
    req[part] = parsed.data;
    next();
  };
}
