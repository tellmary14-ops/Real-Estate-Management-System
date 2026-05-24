import { Router, type IRouter } from "express";
import { prisma } from "../../config/db.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { sendSuccess } from "../../utils/ApiResponse.js";

export const purchaseRoutes: IRouter = Router();

purchaseRoutes.get("/mine", authenticate, async (req, res, next) => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId: req.user!.id },
      include: { property: { include: { images: { take: 1 } } }, payment: true },
      orderBy: { createdAt: "desc" },
    });
    sendSuccess(res, "Purchase history loaded", purchases);
  } catch (e) {
    next(e);
  }
});
