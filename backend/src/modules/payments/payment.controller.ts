import type { Request, Response, NextFunction } from "express";
import { sendSuccess, sendPaginated } from "../../utils/ApiResponse.js";
import { paymentService } from "./payment.service.js";

export const paymentController = {
  async initialize(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await paymentService.initializePurchase(req.user!.id, req.body.propertyId);
      sendSuccess(res, "Payment started", data, 201);
    } catch (e) {
      next(e);
    }
  },

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await paymentService.verify(req.body.reference, req.body.providerRef);
      sendSuccess(res, "Payment verified", data);
    } catch (e) {
      next(e);
    }
  },

  async webhookSimulate(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await paymentService.webhookSimulate(req.body.reference);
      sendSuccess(res, "Payment completed", data);
    } catch (e) {
      next(e);
    }
  },

  async mine(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await paymentService.listMine(req.user!.id);
      sendSuccess(res, "Payment history loaded", data);
    } catch (e) {
      next(e);
    }
  },

  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { items, meta } = await paymentService.listAll(req.query as { page?: string; limit?: string });
      sendPaginated(res, "Payments loaded", items, meta);
    } catch (e) {
      next(e);
    }
  },
};
