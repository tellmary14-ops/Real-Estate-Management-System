import type { Request, Response, NextFunction } from "express";
import { getParam } from "../../utils/params.js";
import { sendSuccess, sendPaginated } from "../../utils/ApiResponse.js";
import { reservationService } from "./reservation.service.js";

export const reservationController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reservationService.create(req.user!.id, req.body);
      sendSuccess(res, "Reservation submitted", data, 201);
    } catch (e) {
      next(e);
    }
  },

  async mine(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reservationService.listMine(req.user!.id);
      sendSuccess(res, "Your reservations", data);
    } catch (e) {
      next(e);
    }
  },

  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { items, meta } = await reservationService.listAll(req.query as { page?: string; limit?: string });
      sendPaginated(res, "Reservations loaded", items, meta);
    } catch (e) {
      next(e);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reservationService.updateStatus(getParam(req, "id"), req.body.status);
      sendSuccess(res, "Reservation updated", data);
    } catch (e) {
      next(e);
    }
  },
};
