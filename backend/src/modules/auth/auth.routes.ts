import { Router, type IRouter } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { registerSchema, loginSchema, refreshSchema } from "./auth.validation.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authRateLimiter } from "../../middleware/rateLimit.middleware.js";

export const authRoutes: IRouter = Router();

authRoutes.post("/register", authRateLimiter, validate(registerSchema), authController.register);
authRoutes.post("/login", authRateLimiter, validate(loginSchema), authController.login);
authRoutes.post("/refresh", validate(refreshSchema), authController.refresh);
authRoutes.post("/logout", authenticate, authController.logout);
authRoutes.get("/me", authenticate, authController.me);
