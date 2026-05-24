import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { authService } from "./auth.service.js";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, "Welcome! Your account is ready", result, 201);
    } catch (e) {
      next(e);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendSuccess(res, "Welcome back", result);
    } catch (e) {
      next(e);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refresh(req.body.refreshToken);
      sendSuccess(res, "Session renewed", result);
    } catch (e) {
      next(e);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.body.refreshToken, req.user?.id);
      sendSuccess(res, "Signed out successfully", null);
    } catch (e) {
      next(e);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.me(req.user!.id);
      sendSuccess(res, "Profile loaded", user);
    } catch (e) {
      next(e);
    }
  },
};
