import { prisma } from "../../config/db.js";
import { parsePagination } from "../../utils/pagination.js";

export const userRepository = {
  findMany(skip: number, limit: number, search?: string) {
    const where = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" as const } },
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    return Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);
  },

  update(id: string, data: { firstName?: string; lastName?: string; phone?: string; isActive?: boolean; role?: "ADMIN" | "USER" }) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true },
    });
  },

  softDelete(id: string) {
    return prisma.user.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  },
};
