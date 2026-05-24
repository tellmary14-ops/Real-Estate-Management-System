import type { PaymentStatus, PaymentProvider } from "@prisma/client";
import { prisma } from "../../config/db.js";

export const paymentRepository = {
  create(data: {
    userId: string;
    amount: number;
    currency?: string;
    provider?: PaymentProvider;
    providerRef?: string;
    invoiceNumber?: string;
    purchaseId?: string;
    metadata?: object;
  }) {
    return prisma.payment.create({ data: { ...data, amount: data.amount } });
  },

  findByUser(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      include: { purchase: { include: { property: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findAll(skip: number, limit: number) {
    return Promise.all([
      prisma.payment.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          purchase: { include: { property: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.count(),
    ]);
  },

  updateStatus(id: string, status: PaymentStatus, providerRef?: string) {
    return prisma.payment.update({
      where: { id },
      data: {
        status,
        providerRef,
        paidAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });
  },

  findByProviderRef(ref: string) {
    return prisma.payment.findFirst({ where: { providerRef: ref } });
  },
};
