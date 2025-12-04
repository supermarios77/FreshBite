import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export interface GetDishesParams {
  categoryId?: string;
  isActive?: boolean;
  locale?: "en" | "nl" | "fr";
}

export async function getDishes(params: GetDishesParams = {}) {
  const { categoryId, isActive, locale = "en" } = params;

  try {
    const dishes = await prisma.dish.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Log query results in production for debugging
    if (process.env.NODE_ENV === "production") {
      console.log(`[getDishes] Query params:`, { categoryId, isActive, locale });
      console.log(`[getDishes] Found ${dishes.length} dishes from database`);
    }

    // Map to include localized names and variants
    return dishes.map((dish) => ({
      id: dish.id,
      slug: dish.slug,
      name: locale === "en" ? dish.nameEn : locale === "nl" ? dish.nameNl : dish.nameFr,
      description:
        locale === "en"
          ? dish.descriptionEn
          : locale === "nl"
          ? dish.descriptionNl
          : dish.descriptionFr,
      price: dish.price,
      pricingModel: dish.pricingModel,
      imageUrl: dish.imageUrl,
      rating: dish.rating || 0,
      allergens: dish.allergens,
      ingredients: dish.ingredients,
      variants: dish.variants.map((variant) => ({
        id: variant.id,
        name: locale === "en" ? variant.nameEn : locale === "nl" ? variant.nameNl : variant.nameFr,
        nameEn: variant.nameEn,
        nameNl: variant.nameNl,
        nameFr: variant.nameFr,
        imageUrl: variant.imageUrl,
        price: variant.price,
        isActive: variant.isActive,
      })),
      category: dish.category
        ? {
            id: dish.category.id,
            name:
              locale === "en"
                ? dish.category.nameEn
                : locale === "nl"
                ? dish.category.nameNl
                : dish.category.nameFr,
            slug: dish.category.slug,
          }
        : null,
      isActive: dish.isActive,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
    }));
  } catch (error: any) {
    // Enhanced error logging
    console.error("[getDishes] Database query failed:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      params: { categoryId, isActive, locale },
      // Check if it's a connection error
      isConnectionError: error?.message?.includes("P1001") || 
                        error?.message?.includes("Can't reach") ||
                        error?.message?.includes("ECONNREFUSED"),
    });
    throw error; // Re-throw to be caught by caller
  }
}

export async function getDishById(id: string, locale: "en" | "nl" | "fr" = "en") {
  const dish = await prisma.dish.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!dish) {
    return null;
  }

  // Return raw data for admin editing, or localized for public display
  return {
    id: dish.id,
    slug: dish.slug,
    name: dish.name,
    nameEn: dish.nameEn,
    nameNl: dish.nameNl,
    nameFr: dish.nameFr,
    description: dish.description,
    descriptionEn: dish.descriptionEn,
    descriptionNl: dish.descriptionNl,
    descriptionFr: dish.descriptionFr,
    price: dish.price,
    imageUrl: dish.imageUrl,
    rating: dish.rating || 0,
    quantity: dish.quantity,
    weight: dish.weight,
    allergens: dish.allergens,
    ingredients: dish.ingredients,
    categoryId: dish.categoryId,
    category: dish.category
      ? {
          id: dish.category.id,
          name:
            locale === "en"
              ? dish.category.nameEn
              : locale === "nl"
              ? dish.category.nameNl
              : dish.category.nameFr,
          slug: dish.category.slug,
        }
      : null,
    isActive: dish.isActive,
    createdAt: dish.createdAt,
    updatedAt: dish.updatedAt,
  };
}

export async function getDishBySlug(slug: string, locale: "en" | "nl" | "fr" = "en") {
  const dish = await prisma.dish.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!dish) {
    return null;
  }

  // Return localized data for public display
  return {
    id: dish.id,
    slug: dish.slug,
    name: locale === "en" ? dish.nameEn : locale === "nl" ? dish.nameNl : dish.nameFr,
    nameEn: dish.nameEn,
    nameNl: dish.nameNl,
    nameFr: dish.nameFr,
    description:
      locale === "en"
        ? dish.descriptionEn
        : locale === "nl"
        ? dish.descriptionNl
        : dish.descriptionFr,
    descriptionEn: dish.descriptionEn,
    descriptionNl: dish.descriptionNl,
    descriptionFr: dish.descriptionFr,
    price: dish.price,
    pricingModel: dish.pricingModel,
    imageUrl: dish.imageUrl,
    rating: dish.rating || 0,
    quantity: dish.quantity,
    weight: dish.weight,
    allergens: dish.allergens,
    ingredients: dish.ingredients,
    variants: dish.variants.map((variant) => ({
      id: variant.id,
      name: locale === "en" ? variant.nameEn : locale === "nl" ? variant.nameNl : variant.nameFr,
      nameEn: variant.nameEn,
      nameNl: variant.nameNl,
      nameFr: variant.nameFr,
      imageUrl: variant.imageUrl,
      price: variant.price,
      isActive: variant.isActive,
    })),
    categoryId: dish.categoryId,
    category: dish.category
      ? {
          id: dish.category.id,
          name:
            locale === "en"
              ? dish.category.nameEn
              : locale === "nl"
              ? dish.category.nameNl
              : dish.category.nameFr,
          slug: dish.category.slug,
        }
      : null,
    isActive: dish.isActive,
    createdAt: dish.createdAt,
    updatedAt: dish.updatedAt,
  };
}

export async function getCategories(locale: "en" | "nl" | "fr" = "en") {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name:
      locale === "en" ? category.nameEn : locale === "nl" ? category.nameNl : category.nameFr,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
  }));
}

