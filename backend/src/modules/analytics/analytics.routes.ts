import { Router, type IRouter } from "express";
import { Role } from "@prisma/client";
import { analyticsController } from "./analytics.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

export const analyticsRoutes: IRouter = Router();

analyticsRoutes.get("/dashboard", authenticate, authorize(Role.ADMIN), analyticsController.dashboard);
