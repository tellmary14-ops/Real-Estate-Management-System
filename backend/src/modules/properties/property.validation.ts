import { z } from "zod";

const propertyBase = {
  title: z.string().min(3, "enter at least 3 characters"),
  description: z.string().min(10, "enter at least 10 characters"),
  price: z.coerce.number().positive("enter an amount greater than zero"),
  currency: z.string().default("NGN"),
  address: z.string().min(3, "enter a full street address"),
  city: z.string().min(2, "enter the city name"),
  state: z.string().optional(),
  country: z.string().default("Nigeria"),
  zipCode: z.string().optional(),
  bedrooms: z.coerce.number().int().min(0).default(0),
  bathrooms: z.coerce.number().int().min(0).default(0),
  areaSqft: z.coerce.number().int().positive().optional(),
  category: z.enum(["HOUSE", "APARTMENT", "LAND", "COMMERCIAL", "VILLA", "OTHER"], {
    errorMap: () => ({ message: "choose a valid property type" }),
  }),
  isFeatured: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((v) => v === true || v === "true"),
};

export const createPropertySchema = z.object(propertyBase);

export const updatePropertySchema = createPropertySchema.partial().extend({
  status: z.enum(["AVAILABLE", "PENDING", "SOLD"]).optional(),
});

export const propertyQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  featured: z.string().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "oldest"]).optional(),
});

export const propertyIdSchema = z.object({ id: z.string().min(1) });
