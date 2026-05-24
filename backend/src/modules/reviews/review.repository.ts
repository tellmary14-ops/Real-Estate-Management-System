import { prisma } from "../../config/db.js";

export const reviewRepository = {
  create(data: { userId: string; propertyId: string; rating: number; comment?: string }) {
    return prisma.review.create({
      data,
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });
  },

  findByProperty(propertyId: string) {
    return prisma.review.findMany({
      where: { propertyId, deletedAt: null },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  softDelete(id: string) {
    return prisma.review.update({ where: { id }, data: { deletedAt: new Date() } });
  },
};
