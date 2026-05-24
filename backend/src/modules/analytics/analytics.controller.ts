import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { analyticsService } from "./analytics.service.js";

export const analyticsController = {
  async dashboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.dashboard();
      sendSuccess(res, "Dashboard loaded", data);
    } catch (e) {
      next(e);
    }
  },
};
