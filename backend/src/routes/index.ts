import { Router, type IRouter } from "express";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { propertyRoutes } from "../modules/properties/property.routes.js";
import { userRoutes } from "../modules/users/user.routes.js";
import { favoriteRoutes } from "../modules/favorites/favorite.routes.js";
import { reservationRoutes } from "../modules/reservations/reservation.routes.js";
import { reviewRoutes } from "../modules/reviews/review.routes.js";
import { notificationRoutes } from "../modules/notifications/notification.routes.js";
import { paymentRoutes } from "../modules/payments/payment.routes.js";
import { analyticsRoutes } from "../modules/analytics/analytics.routes.js";
import { env } from "../config/env.js";

export const apiRoutes: IRouter = Router();

apiRoutes.get("/", (_req, res) => {
  res.json({
    success: true,
    message: `${env.appName} API v1`,
    data: {
      modules: [
        "auth",
        "properties",
        "users",
        "favorites",
        "reservations",
        "reviews",
        "notifications",
        "payments",
        "analytics",
      ],
    },
  });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/properties", propertyRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/favorites", favoriteRoutes);
apiRoutes.use("/reservations", reservationRoutes);
apiRoutes.use("/reviews", reviewRoutes);
apiRoutes.use("/notifications", notificationRoutes);
apiRoutes.use("/payments", paymentRoutes);
apiRoutes.use("/analytics", analyticsRoutes);
