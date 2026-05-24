import { Router, type IRouter } from "express";
import { Role } from "@prisma/client";
import { propertyController } from "./property.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import {
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
  propertyIdSchema,
} from "./property.validation.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { uploadImages, uploadImagesOptional } from "../../middleware/upload.middleware.js";

export const propertyRoutes: IRouter = Router();

propertyRoutes.get("/", validate(propertyQuerySchema, "query"), propertyController.list);
propertyRoutes.get("/:id", validate(propertyIdSchema, "params"), propertyController.getOne);

propertyRoutes.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  uploadImages.array("images", 10),
  validate(createPropertySchema),
  propertyController.create
);

propertyRoutes.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  uploadImagesOptional,
  validate(propertyIdSchema, "params"),
  validate(updatePropertySchema),
  propertyController.update
);

propertyRoutes.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(propertyIdSchema, "params"),
  propertyController.remove
);
