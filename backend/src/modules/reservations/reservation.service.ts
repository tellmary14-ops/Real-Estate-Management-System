import type { ReservationStatus } from "@prisma/client";
import { ApiError } from "../../utils/ApiError.js";
import { parsePagination, paginationMeta } from "../../utils/pagination.js";
import { prisma } from "../../config/db.js";
import { reservationRepository } from "./reservation.repository.js";
import { notificationRepository } from "../notifications/notification.repository.js";

export const reservationService = {
  async create(userId: string, input: { propertyId: string; startDate: string; endDate: string; notes?: string }) {
    const property = await prisma.property.findFirst({
      where: { id: input.propertyId, deletedAt: null, status: "AVAILABLE" },
    });
    if (!property) throw ApiError.badRequest("This property is not available for reservation");

    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    if (end <= start) throw ApiError.badRequest("End date must be after start date");

    const reservation = await reservationRepository.create({
      userId,
      propertyId: input.propertyId,
      startDate: start,
      endDate: end,
      notes: input.notes,
    });

    await notificationRepository.create(
      userId,
      "Reservation received",
      `Your reservation for ${property.title} is pending confirmation.`,
      "RESERVATION"
    );

    return reservation;
  },

  listMine(userId: string) {
    return reservationRepository.findByUser(userId);
  },

  async listAll(query: { page?: string; limit?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const [items, total] = await reservationRepository.findAll(skip, limit);
    return { items, meta: paginationMeta(total, page, limit) };
  },

  async updateStatus(id: string, status: ReservationStatus) {
    return reservationRepository.updateStatus(id, status);
  },
};
