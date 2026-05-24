import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { uploadsRootPath } from "./utils/imageStorage.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";
import { apiRateLimiter } from "./middleware/rateLimit.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { propertyRoutes } from "./modules/properties/property.routes.js";
import { userRoutes } from "./modules/users/user.routes.js";
import { favoriteRoutes } from "./modules/favorites/favorite.routes.js";
import { reservationRoutes } from "./modules/reservations/reservation.routes.js";
import { reviewRoutes } from "./modules/reviews/review.routes.js";
import { notificationRoutes } from "./modules/notifications/notification.routes.js";
import { paymentRoutes } from "./modules/payments/payment.routes.js";
import { purchaseRoutes } from "./modules/purchases/purchase.routes.js";
import { analyticsRoutes } from "./modules/analytics/analytics.routes.js";

export function createApp(): Express {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin: env.frontendUrl,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(requestLogger);
  app.use(apiRateLimiter);

  app.get("/", (_req, res) => {
    res.json({
      success: true,
      message: `${env.appName} API`,
      data: { version: "v1", docs: `${env.apiPrefix}/health` },
    });
  });

  app.get(`${env.apiPrefix}/health`, async (_req, res) => {
    const { prisma } = await import("./config/db.js");
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ success: true, message: "API healthy", data: { database: "connected" } });
    } catch {
      res.status(503).json({ success: false, message: "Database unavailable", data: { database: "disconnected" } });
    }
  });

  const api = express.Router();
  api.use("/auth", authRoutes);
  api.use("/properties", propertyRoutes);
  api.use("/users", userRoutes);
  api.use("/favorites", favoriteRoutes);
  api.use("/reservations", reservationRoutes);
  api.use("/reviews", reviewRoutes);
  api.use("/notifications", notificationRoutes);
  api.use("/payments", paymentRoutes);
  api.use("/purchases", purchaseRoutes);
  api.use("/analytics", analyticsRoutes);

  app.use(env.apiPrefix, api);
  app.use(
    `${env.apiPrefix}/uploads`,
    express.static(uploadsRootPath(), {
      setHeaders(res) {
        res.setHeader("Cache-Control", "no-store, max-age=0");
      },
    })
  );
  app.use(errorMiddleware);

  return app;
}
