import type { Request, Response, NextFunction } from "express";
import { getParam } from "../../utils/params.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { notificationService } from "./notification.service.js";

export const notificationController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await notificationService.list(req.user!.id);
      sendSuccess(res, "Notifications loaded", data);
    } catch (e) {
      next(e);
    }
  },

  async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      await notificationService.markRead(req.user!.id, getParam(req, "id"));
      sendSuccess(res, "Notification marked as read", null);
    } catch (e) {
      next(e);
    }
  },

  async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      await notificationService.markAllRead(req.user!.id);
      sendSuccess(res, "All notifications marked as read", null);
    } catch (e) {
      next(e);
    }
  },
};
