import { Router, type IRouter } from "express";
import { notificationController } from "./notification.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

export const notificationRoutes: IRouter = Router();

notificationRoutes.use(authenticate);
notificationRoutes.get("/", notificationController.list);
notificationRoutes.patch("/:id/read", notificationController.markRead);
notificationRoutes.patch("/read-all", notificationController.markAllRead);
