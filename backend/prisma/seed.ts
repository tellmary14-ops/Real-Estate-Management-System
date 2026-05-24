import bcrypt from "bcryptjs";
import { PrismaClient, Role, PropertyCategory, PropertyStatus } from "@prisma/client";

const prisma = new PrismaClient();

const ABUJA = { city: "Abuja", state: "FCT", country: "Nigeria", currency: "NGN" };

async function main() {
  console.log("[seed] Starting Golden Eggs Estate seed...");

  const password = await bcrypt.hash("Admin123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@goldeneggsestate.com" },
    update: {},
    create: {
      email: "admin@goldeneggsestate.com",
      password,
      firstName: "Golden",
      lastName: "Admin",
      role: Role.ADMIN,
      phone: "+2348030000000",
    },
  });

  const userPassword = await bcrypt.hash("User12345!", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@goldeneggsestate.com" },
    update: {},
    create: {
      email: "user@goldeneggsestate.com",
      password: userPassword,
      firstName: "Jane",
      lastName: "Buyer",
      role: Role.USER,
      phone: "+2348030000001",
    },
  });

  const existingCount = await prisma.property.count();
  if (existingCount === 0) {
    const samples = [
      {
        title: "Maitama Luxury Villa",
        description: "Luxury 4-bedroom villa with pool, garden, and staff quarters in Maitama.",
        price: 285000000,
        category: PropertyCategory.VILLA,
        bedrooms: 4,
        bathrooms: 4,
        isFeatured: true,
        address: "12 Aguiyi Ironsi Street, Maitama",
      },
      {
        title: "Wuse II Modern Apartment",
        description: "Stylish 3-bed apartment with parking and 24-hour security.",
        price: 95000000,
        category: PropertyCategory.APARTMENT,
        bedrooms: 3,
        bathrooms: 3,
        isFeatured: true,
        address: "45 Adetokunbo Ademola Crescent, Wuse II",
      },
      {
        title: "Asokoro Family Home",
        description: "Spacious family home with large compound and generator house.",
        price: 165000000,
        category: PropertyCategory.HOUSE,
        bedrooms: 5,
        bathrooms: 4,
        address: "8 Yakubu Gowon Crescent, Asokoro",
      },
    ];

    const imageByCategory: Record<string, string> = {
      VILLA: "https://images.unsplash.com/photo-1613490490903-4f7f7e8b8b0e?auto=format&fit=crop&w=800&q=80",
      APARTMENT: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      HOUSE: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    };

    for (const sample of samples) {
      const img =
        imageByCategory[sample.category] ??
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
      const property = await prisma.property.create({
        data: {
          ...sample,
          ...ABUJA,
          status: PropertyStatus.AVAILABLE,
          ownerId: admin.id,
          images: {
            create: { url: img, isPrimary: true },
          },
        },
      });
      console.log("[seed] Property created:", property.title);
    }
  }

  const updated = await prisma.property.updateMany({
    data: ABUJA,
  });
  console.log("[seed] Normalized listings to Abuja / NGN:", updated.count);

  console.log("[seed] Done.");
  console.log("[seed] Admin:", admin.email, "/ Admin123!");
  console.log("[seed] User:", user.email, "/ User12345!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
