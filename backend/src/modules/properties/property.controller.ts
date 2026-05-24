import type { Request, Response, NextFunction } from "express";
import { sendSuccess, sendPaginated } from "../../utils/ApiResponse.js";
import { getParam } from "../../utils/params.js";
import { logger } from "../../utils/logger.js";
import { propertyService } from "./property.service.js";

export const propertyController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { items, meta } = await propertyService.list(req.query as Record<string, string>);
      sendPaginated(res, "Properties loaded", items, meta);
    } catch (e) {
      next(e);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertyService.getById(getParam(req, "id"));
      sendSuccess(res, "Property details loaded", property);
    } catch (e) {
      next(e);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertyService.create(
        req.user!.id,
        req.body,
        req.files as Express.Multer.File[] | undefined
      );
      sendSuccess(res, "Property listed successfully", property, 201);
    } catch (e) {
      next(e);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      logger.info({
        step: "property:update:request",
        id: getParam(req, "id"),
        bodyKeys: Object.keys(req.body ?? {}),
        fileCount: files?.length ?? 0,
      });
      const property = await propertyService.update(
        getParam(req, "id"),
        req.user!.id,
        req.user!.role,
        req.body,
        files
      );
      sendSuccess(res, "Property updated", property);
    } catch (e) {
      next(e);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await propertyService.remove(getParam(req, "id"), req.user!.id, req.user!.role);
      sendSuccess(res, "Property removed", null);
    } catch (e) {
      next(e);
    }
  },
};
