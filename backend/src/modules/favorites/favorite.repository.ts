import { prisma } from "../../config/db.js";

export const favoriteRepository = {
  findByUser(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  create(userId: string, propertyId: string) {
    return prisma.favorite.create({
      data: { userId, propertyId },
      include: { property: { include: { images: true } } },
    });
  },

  delete(userId: string, propertyId: string) {
    return prisma.favorite.delete({ where: { userId_propertyId: { userId, propertyId } } });
  },

  exists(userId: string, propertyId: string) {
    return prisma.favorite.findUnique({ where: { userId_propertyId: { userId, propertyId } } });
  },
};
