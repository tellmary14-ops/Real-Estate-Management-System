import { Router, type IRouter } from "express";
import { Role } from "@prisma/client";
import { z } from "zod";
import { reservationController } from "./reservation.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";

const createSchema = z.object({
  propertyId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  notes: z.string().optional(),
});

const statusSchema = z.object({ status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]) });

export const reservationRoutes: IRouter = Router();

reservationRoutes.post("/", authenticate, validate(createSchema), reservationController.create);
reservationRoutes.get("/mine", authenticate, reservationController.mine);
reservationRoutes.get("/", authenticate, authorize(Role.ADMIN), reservationController.listAll);
reservationRoutes.patch("/:id/status", authenticate, authorize(Role.ADMIN), validate(statusSchema), reservationController.updateStatus);
