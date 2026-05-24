import { Router, type IRouter } from "express";
import { Role } from "@prisma/client";
import { userController } from "./user.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

export const userRoutes: IRouter = Router();

userRoutes.use(authenticate, authorize(Role.ADMIN));
userRoutes.get("/", userController.list);
userRoutes.patch("/:id", userController.update);
userRoutes.delete("/:id", userController.remove);
