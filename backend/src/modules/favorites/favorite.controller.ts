import type { Request, Response, NextFunction } from "express";
import { getParam } from "../../utils/params.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { favoriteService } from "./favorite.service.js";

export const favoriteController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await favoriteService.list(req.user!.id);
      sendSuccess(res, "Favorites loaded", data);
    } catch (e) {
      next(e);
    }
  },

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await favoriteService.add(req.user!.id, getParam(req, "propertyId"));
      sendSuccess(res, "Saved to favorites", data, 201);
    } catch (e) {
      next(e);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await favoriteService.remove(req.user!.id, getParam(req, "propertyId"));
      sendSuccess(res, "Removed from favorites", null);
    } catch (e) {
      next(e);
    }
  },
};
