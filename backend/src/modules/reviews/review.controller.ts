import type { Request, Response, NextFunction } from "express";
import { getParam } from "../../utils/params.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { reviewService } from "./review.service.js";

export const reviewController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reviewService.list(getParam(req, "propertyId"));
      sendSuccess(res, "Reviews loaded", data);
    } catch (e) {
      next(e);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId, rating, comment } = req.body;
      const data = await reviewService.create(req.user!.id, propertyId, rating, comment);
      sendSuccess(res, "Review posted", data, 201);
    } catch (e) {
      next(e);
    }
  },
};
