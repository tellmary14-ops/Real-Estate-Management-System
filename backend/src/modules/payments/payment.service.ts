import { ApiError } from "../../utils/ApiError.js";
import { env } from "../../config/env.js";
import { generateInvoiceNumber } from "../../utils/helpers.js";
import { parsePagination, paginationMeta } from "../../utils/pagination.js";
import { prisma } from "../../config/db.js";
import { paymentRepository } from "./payment.repository.js";
import { notificationRepository } from "../notifications/notification.repository.js";
import { logger } from "../../utils/logger.js";

export const paymentService = {
  async initializePurchase(userId: string, propertyId: string) {
    logger.info({ step: "payment:initialize", userId, propertyId });

    const property = await prisma.property.findFirst({
      where: { id: propertyId, deletedAt: null, status: "AVAILABLE" },
    });
    if (!property) throw ApiError.badRequest("Property is not available for purchase");

    const amount = Number(property.price);

    const purchase = await prisma.purchase.create({
      data: {
        userId,
        propertyId,
        amount,
        currency: property.currency,
      },
    });

    const payment = await paymentRepository.create({
      userId,
      purchaseId: purchase.id,
      amount,
      currency: property.currency,
      provider: "PAYSTACK",
      invoiceNumber: generateInvoiceNumber(),
      metadata: { propertyId, propertyTitle: property.title },
    });

  return {
      payment,
      paystackPublicKey: env.paystackPublicKey || null,
      amount,
      reference: payment.id,
      message: env.paystackSecretKey
        ? "Complete payment on Paystack"
        : "Payment provider not configured — use webhook simulate in dev",
    };
  },

  async verify(reference: string, providerRef: string) {
    logger.info({ step: "payment:verify", reference, providerRef });
    const payment = await paymentRepository.findByProviderRef(providerRef);
    if (!payment) {
      const byId = await prisma.payment.findUnique({ where: { id: reference } });
      if (!byId) throw ApiError.notFound("Payment not found");
      await paymentRepository.updateStatus(byId.id, "COMPLETED", providerRef);

      if (byId.purchaseId) {
        const purchase = await prisma.purchase.findUnique({
          where: { id: byId.purchaseId },
          include: { property: true },
        });
        if (purchase) {
          await prisma.property.update({
            where: { id: purchase.propertyId },
            data: { status: "SOLD" },
          });
        }
      }

      await notificationRepository.create(
        byId.userId,
        "Payment successful",
        "Your property purchase is complete.",
        "PAYMENT"
      );
      return prisma.payment.findUnique({ where: { id: byId.id } });
    }

    return paymentRepository.updateStatus(payment.id, "COMPLETED", providerRef);
  },

  listMine(userId: string) {
    return paymentRepository.findByUser(userId);
  },

  async listAll(query: { page?: string; limit?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const [items, total] = await paymentRepository.findAll(skip, limit);
    return { items, meta: paginationMeta(total, page, limit) };
  },

  async webhookSimulate(reference: string) {
    if (env.nodeEnv === "production") throw ApiError.forbidden();
    return this.verify(reference, `sim_${Date.now()}`);
  },
};
