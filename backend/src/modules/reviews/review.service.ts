import { ApiError } from "../../utils/ApiError.js";
import { reviewRepository } from "./review.repository.js";

export const reviewService = {
  list(propertyId: string) {
    return reviewRepository.findByProperty(propertyId);
  },

  async create(userId: string, propertyId: string, rating: number, comment?: string) {
    if (rating < 1 || rating > 5) throw ApiError.badRequest("Rating must be between 1 and 5");
    try {
      return await reviewRepository.create({ userId, propertyId, rating, comment });
    } catch {
      throw ApiError.conflict("You have already reviewed this property");
    }
  },

  async remove(id: string, userId: string, role: string) {
    const review = await reviewRepository.softDelete(id);
    if (role !== "ADMIN" && review.userId !== userId) throw ApiError.forbidden();
    return review;
  },
};
