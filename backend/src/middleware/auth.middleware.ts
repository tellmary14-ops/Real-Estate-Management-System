import type { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/generateToken.js";
import { prisma } from "../config/db.js";
import { omitPassword } from "../utils/helpers.js";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized());
  }

  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null, isActive: true },
    });
    if (!user) return next(ApiError.unauthorized());
    req.user = omitPassword(user) as AuthUser;
    next();
  } catch {
    next(ApiError.unauthorized("Your session has expired. Please sign in again"));
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();

  const token = header.slice(7);
  verifyAccessToken(token);
  authenticate(req, _res, next).catch(() => next());
}
