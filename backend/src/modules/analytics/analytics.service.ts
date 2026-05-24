import { prisma } from "../../config/db.js";
import { logger } from "../../utils/logger.js";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function paymentDate(p: { paidAt: Date | null; createdAt: Date }) {
  return p.paidAt ?? p.createdAt;
}

export const analyticsService = {
  async dashboard() {
    const now = new Date();
    const sixMonthsStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 5, 1));
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    logger.info({ step: "analytics:dashboard:load", sixMonthsStart, sevenDaysAgo });

    const [
      totalUsers,
      totalProperties,
      availableProperties,
      pendingProperties,
      soldProperties,
      totalReservations,
      pendingReservations,
      totalPayments,
      completedPayments,
      revenue,
      completedPaymentsAll,
      reservationsInRange,
      recentReservations,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.property.count({ where: { deletedAt: null } }),
      prisma.property.count({ where: { deletedAt: null, status: "AVAILABLE" } }),
      prisma.property.count({ where: { deletedAt: null, status: "PENDING" } }),
      prisma.property.count({ where: { deletedAt: null, status: "SOLD" } }),
      prisma.reservation.count({ where: { deletedAt: null } }),
      prisma.reservation.count({ where: { deletedAt: null, status: "PENDING" } }),
      prisma.payment.count(),
      prisma.payment.count({ where: { status: "COMPLETED" } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.payment.findMany({
        where: { status: "COMPLETED" },
        select: { amount: true, createdAt: true, paidAt: true },
      }),
      prisma.reservation.findMany({
        where: { deletedAt: null, createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true },
      }),
      prisma.reservation.findMany({
        where: {
          deletedAt: null,
          property: { deletedAt: null },
        },
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          property: { select: { title: true, id: true } },
        },
      }),
    ]);

    const paymentsInRange = completedPaymentsAll.filter((p) => paymentDate(p) >= sixMonthsStart);

    const revenueByMonth: { label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = monthKey(monthDate);
      const value = paymentsInRange
        .filter((p) => monthKey(paymentDate(p)) === key)
        .reduce((sum, p) => sum + Number(p.amount), 0);
      revenueByMonth.push({
        label: monthDate.toLocaleString("en-US", { month: "short" }),
        value,
      });
    }

    const reservationsByDay: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      const value = reservationsInRange.filter(
        (r) => r.createdAt >= day && r.createdAt < next
      ).length;
      reservationsByDay.push({
        label: day.toLocaleString("en-US", { weekday: "short", day: "numeric" }),
        value,
      });
    }

    const totalRevenue = Number(revenue._sum.amount ?? 0);
    const currentMonthRevenue = revenueByMonth[revenueByMonth.length - 1]?.value ?? 0;
    const prevMonthRevenue = revenueByMonth.length >= 2 ? revenueByMonth[revenueByMonth.length - 2].value : 0;
    const revenueChange =
      prevMonthRevenue > 0
        ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
        : currentMonthRevenue > 0
          ? 100
          : 0;

    const statusSum = availableProperties + pendingProperties + soldProperties;
    const unassigned = Math.max(0, totalProperties - statusSum);

    const propertyStatus = [
      { label: "Available", value: availableProperties, color: "#1d4ed8" },
      { label: "Pending", value: pendingProperties, color: "#3b82f6" },
      { label: "Sold", value: soldProperties, color: "#93c5fd" },
    ];
    if (unassigned > 0) {
      propertyStatus.push({ label: "Other", value: unassigned, color: "#64748b" });
    }

    const payload = {
      users: { total: totalUsers },
      properties: {
        total: totalProperties,
        available: availableProperties,
        pending: pendingProperties,
        sold: soldProperties,
      },
      reservations: { total: totalReservations, pending: pendingReservations },
      payments: {
        total: totalPayments,
        completed: completedPayments,
        revenue: totalRevenue,
        revenueThisMonth: currentMonthRevenue,
        revenueChange: Math.round(revenueChange * 10) / 10,
      },
      charts: {
        revenueByMonth,
        reservationsByDay,
        propertyStatus: propertyStatus.filter((s) => s.value > 0),
        propertyStatusAll: propertyStatus,
      },
      recentReservations: recentReservations.map((r) => ({
        id: r.id,
        status: r.status,
        startDate: r.startDate,
        endDate: r.endDate,
        createdAt: r.createdAt,
        guestName: `${r.user.firstName} ${r.user.lastName}`.trim(),
        guestEmail: r.user.email,
        propertyTitle: r.property.title,
        propertyId: r.property.id,
      })),
    };

    logger.info({
      step: "analytics:dashboard:ready",
      properties: payload.properties,
      payments: { completed: completedPayments, revenue: totalRevenue, thisMonth: currentMonthRevenue },
      reservations: payload.reservations,
      recentCount: payload.recentReservations.length,
    });

    return payload;
  },
};
