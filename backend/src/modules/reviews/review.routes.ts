import { Router, type IRouter } from "express";
import { z } from "zod";
import { reviewController } from "./review.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";

const createSchema = z.object({
  propertyId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const reviewRoutes: IRouter = Router();

reviewRoutes.get("/property/:propertyId", reviewController.list);
reviewRoutes.post("/", authenticate, validate(createSchema), reviewController.create);
