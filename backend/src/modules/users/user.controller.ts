import type { Request, Response, NextFunction } from "express";
import { getParam } from "../../utils/params.js";
import { sendSuccess, sendPaginated } from "../../utils/ApiResponse.js";
import { userService } from "./user.service.js";

export const userController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { users, meta } = await userService.list(req.query as { page?: string; limit?: string; search?: string });
      sendPaginated(res, "Users loaded", users, meta);
    } catch (e) {
      next(e);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.update(getParam(req, "id"), req.body);
      sendSuccess(res, "User updated", user);
    } catch (e) {
      next(e);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.remove(getParam(req, "id"));
      sendSuccess(res, "User removed", null);
    } catch (e) {
      next(e);
    }
  },
};
