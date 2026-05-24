import type { Prisma, PropertyCategory, PropertyStatus } from "@prisma/client";
import { prisma } from "../../config/db.js";

const propertyInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  owner: { select: { id: true, firstName: true, lastName: true, email: true } },
  _count: { select: { reviews: true, favorites: true } },
};

export const propertyRepository = {
  create(data: Prisma.PropertyCreateInput) {
    return prisma.property.create({ data, include: propertyInclude });
  },

  findById(id: string) {
    return prisma.property.findFirst({
      where: { id, deletedAt: null },
      include: {
        ...propertyInclude,
        reviews: {
          where: { deletedAt: null },
          take: 10,
          include: { user: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  update(id: string, data: Prisma.PropertyUpdateInput) {
    return prisma.property.update({ where: { id }, data, include: propertyInclude });
  },

  softDelete(id: string) {
    return prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  findMany(params: {
    skip: number;
    limit: number;
    where: Prisma.PropertyWhereInput;
    orderBy: Prisma.PropertyOrderByWithRelationInput;
  }) {
    const { skip, limit, where, orderBy } = params;
    return Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: propertyInclude,
      }),
      prisma.property.count({ where }),
    ]);
  },

  addImages(propertyId: string, images: { url: string; publicId?: string; isPrimary?: boolean; sortOrder?: number }[]) {
    return prisma.propertyImage.createMany({
      data: images.map((img, i) => ({
        propertyId,
        url: img.url,
        publicId: img.publicId,
        isPrimary: img.isPrimary ?? i === 0,
        sortOrder: img.sortOrder ?? i,
      })),
    });
  },

  deleteImages(propertyId: string) {
    return prisma.propertyImage.deleteMany({ where: { propertyId } });
  },

  buildWhere(filters: {
    search?: string;
    city?: string;
    category?: PropertyCategory;
    status?: PropertyStatus;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
  }): Prisma.PropertyWhereInput {
    const where: Prisma.PropertyWhereInput = { deletedAt: null };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { city: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.city) where.city = { equals: filters.city, mode: "insensitive" };
    if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.featured !== undefined) where.isFeatured = filters.featured;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    return where;
  },

  buildOrderBy(sort?: string): Prisma.PropertyOrderByWithRelationInput {
    switch (sort) {
      case "price_asc":
        return { price: "asc" };
      case "price_desc":
        return { price: "desc" };
      case "oldest":
        return { createdAt: "asc" };
      default:
        return { createdAt: "desc" };
    }
  },
};
