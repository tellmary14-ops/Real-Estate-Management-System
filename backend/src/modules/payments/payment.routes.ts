import { Router, type IRouter } from "express";
import { Role } from "@prisma/client";
import { z } from "zod";
import { paymentController } from "./payment.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";

const initSchema = z.object({ propertyId: z.string() });
const verifySchema = z.object({ reference: z.string(), providerRef: z.string() });
const simSchema = z.object({ reference: z.string() });

export const paymentRoutes: IRouter = Router();

paymentRoutes.post("/initialize", authenticate, validate(initSchema), paymentController.initialize);
paymentRoutes.post("/verify", authenticate, validate(verifySchema), paymentController.verify);
paymentRoutes.post("/simulate", authenticate, validate(simSchema), paymentController.webhookSimulate);
paymentRoutes.get("/mine", authenticate, paymentController.mine);
paymentRoutes.get("/", authenticate, authorize(Role.ADMIN), paymentController.listAll);
