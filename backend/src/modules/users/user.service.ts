import { ApiError } from "../../utils/ApiError.js";
import { parsePagination, paginationMeta } from "../../utils/pagination.js";
import { userRepository } from "./user.repository.js";

export const userService = {
  async list(query: { page?: string; limit?: string; search?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const [users, total] = await userRepository.findMany(skip, limit, query.search);
    return { users, meta: paginationMeta(total, page, limit) };
  },

  async update(id: string, data: Parameters<typeof userRepository.update>[1]) {
    try {
      return await userRepository.update(id, data);
    } catch {
      throw ApiError.notFound("User not found");
    }
  },

  async remove(id: string) {
    await userRepository.softDelete(id);
  },
};
