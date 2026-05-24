import { prisma } from "../../config/db.js";
import type { ReservationStatus } from "@prisma/client";

export const reservationRepository = {
  create(data: {
    userId: string;
    propertyId: string;
    startDate: Date;
    endDate: Date;
    notes?: string;
  }) {
    return prisma.reservation.create({
      data,
      include: { property: { include: { images: { take: 1 } } } },
    });
  },

  findByUser(userId: string) {
    return prisma.reservation.findMany({
      where: { userId, deletedAt: null },
      include: { property: { include: { images: { take: 1 } } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findAll(skip: number, limit: number) {
    return Promise.all([
      prisma.reservation.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        include: {
          property: true,
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.reservation.count({ where: { deletedAt: null } }),
    ]);
  },

  updateStatus(id: string, status: ReservationStatus) {
    return prisma.reservation.update({ where: { id }, data: { status } });
  },
};
