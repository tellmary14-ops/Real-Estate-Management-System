import { ApiError } from "../../utils/ApiError.js";
import { favoriteRepository } from "./favorite.repository.js";
import { prisma } from "../../config/db.js";

export const favoriteService = {
  list(userId: string) {
    return favoriteRepository.findByUser(userId);
  },

  async add(userId: string, propertyId: string) {
    const property = await prisma.property.findFirst({ where: { id: propertyId, deletedAt: null } });
    if (!property) throw ApiError.notFound("Property not found");
    const existing = await favoriteRepository.exists(userId, propertyId);
    if (existing) throw ApiError.conflict("Already in your favorites");
    return favoriteRepository.create(userId, propertyId);
  },

  async remove(userId: string, propertyId: string) {
    try {
      await favoriteRepository.delete(userId, propertyId);
    } catch {
      throw ApiError.notFound("Favorite not found");
    }
  },
};
