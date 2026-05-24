import { prisma } from "../../config/db.js";

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  },

  findUserById(id: string) {
    return prisma.user.findFirst({ where: { id, deletedAt: null, isActive: true } });
  },

  createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: "ADMIN" | "USER";
  }) {
    return prisma.user.create({ data });
  },

  saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({ data: { userId, token, expiresAt } });
  },

  findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });
  },

  deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({ where: { token } }).catch(() => null);
  },

  deleteUserRefreshTokens(userId: string) {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  },
};
