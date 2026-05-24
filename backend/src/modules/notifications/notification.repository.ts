import type { NotificationType } from "@prisma/client";
import { prisma } from "../../config/db.js";

export const notificationRepository = {
  create(userId: string, title: string, message: string, type: NotificationType = "INFO") {
    return prisma.notification.create({ data: { userId, title, message, type } });
  },

  findByUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  },

  markRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  },

  markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },
};
