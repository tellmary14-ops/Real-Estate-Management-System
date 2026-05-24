import type { PropertyCategory, PropertyStatus } from "@prisma/client";
import { ApiError } from "../../utils/ApiError.js";
import { parsePagination, paginationMeta } from "../../utils/pagination.js";
import { logger } from "../../utils/logger.js";
import { storePropertyImage } from "../../utils/imageStorage.js";
import { propertyRepository } from "./property.repository.js";

export const propertyService = {
  async list(query: Record<string, string | undefined>) {
    const { page, limit, skip } = parsePagination(query);
    const where = propertyRepository.buildWhere({
      search: query.search,
      city: query.city,
      category: query.category as PropertyCategory | undefined,
      status: query.status ? (query.status as PropertyStatus) : undefined,
      minPrice: query.minPrice ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      featured: query.featured === "true" ? true : undefined,
    });
    const orderBy = propertyRepository.buildOrderBy(query.sort);
    const [items, total] = await propertyRepository.findMany({ skip, limit, where, orderBy });
    return { items, meta: paginationMeta(total, page, limit) };
  },

  async getById(id: string) {
    const property = await propertyRepository.findById(id);
    if (!property) throw ApiError.notFound("Property not found");
    return property;
  },

  async create(
    ownerId: string,
    data: Record<string, unknown>,
    files?: Express.Multer.File[]
  ) {
    logger.info({ step: "property:create", ownerId });
    const property = await propertyRepository.create({
      title: String(data.title),
      description: String(data.description),
      price: Number(data.price),
      currency: String(data.currency ?? "NGN"),
      address: String(data.address),
      city: String(data.city),
      state: data.state ? String(data.state) : "FCT",
      country: String(data.country ?? "Nigeria"),
      zipCode: data.zipCode ? String(data.zipCode) : undefined,
      bedrooms: Number(data.bedrooms ?? 0),
      bathrooms: Number(data.bathrooms ?? 0),
      areaSqft: data.areaSqft ? Number(data.areaSqft) : undefined,
      category: data.category as import("@prisma/client").PropertyCategory,
      isFeatured: Boolean(data.isFeatured),
      owner: { connect: { id: ownerId } },
    });

    if (files?.length) {
      const images = await Promise.all(
        files.map(async (file, i) => {
          const uploaded = await storePropertyImage(file.buffer, file.originalname);
          return { ...uploaded, isPrimary: i === 0, sortOrder: i };
        })
      );
      await propertyRepository.addImages(property.id, images);
    }

    return propertyRepository.findById(property.id);
  },

  async update(
    id: string,
    ownerId: string,
    role: string,
    data: Record<string, unknown>,
    files?: Express.Multer.File[]
  ) {
    const existing = await propertyRepository.findById(id);
    if (!existing) throw ApiError.notFound("Property not found");
    if (role !== "ADMIN" && existing.ownerId !== ownerId) {
      throw ApiError.forbidden();
    }

    const payload: Parameters<typeof propertyRepository.update>[1] = {};
    if (data.title !== undefined) payload.title = String(data.title);
    if (data.description !== undefined) payload.description = String(data.description);
    if (data.price !== undefined) payload.price = Number(data.price);
    if (data.currency !== undefined) payload.currency = String(data.currency);
    if (data.address !== undefined) payload.address = String(data.address);
    if (data.city !== undefined) payload.city = String(data.city);
    if (data.state !== undefined) payload.state = String(data.state);
    if (data.country !== undefined) payload.country = String(data.country);
    if (data.zipCode !== undefined) payload.zipCode = String(data.zipCode);
    if (data.bedrooms !== undefined) payload.bedrooms = Number(data.bedrooms);
    if (data.bathrooms !== undefined) payload.bathrooms = Number(data.bathrooms);
    if (data.areaSqft !== undefined) payload.areaSqft = Number(data.areaSqft);
    if (data.category !== undefined) {
      payload.category = data.category as import("@prisma/client").PropertyCategory;
    }
    if (data.status !== undefined) {
      payload.status = data.status as import("@prisma/client").PropertyStatus;
    }
    if (data.isFeatured !== undefined) payload.isFeatured = Boolean(data.isFeatured);

    if (Object.keys(payload).length === 0 && !files?.length) {
      throw ApiError.badRequest("No changes were received. Please try saving again.");
    }

    logger.info({ step: "property:update", id, fields: Object.keys(payload) });
    if (Object.keys(payload).length > 0) {
      await propertyRepository.update(id, payload);
    }

    if (files?.length) {
      logger.info({ step: "property:update:images", id, count: files.length });
      await propertyRepository.deleteImages(id);
      const images = await Promise.all(
        files.map(async (file, i) => {
          const uploaded = await storePropertyImage(file.buffer, file.originalname);
          return { ...uploaded, isPrimary: i === 0, sortOrder: i };
        })
      );
      await propertyRepository.addImages(id, images);
    }

    return propertyRepository.findById(id);
  },

  async remove(id: string, ownerId: string, role: string) {
    const existing = await propertyRepository.findById(id);
    if (!existing) throw ApiError.notFound("Property not found");
    if (role !== "ADMIN" && existing.ownerId !== ownerId) throw ApiError.forbidden();
    await propertyRepository.softDelete(id);
  },
};
