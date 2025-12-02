import { MenuItemCard } from "@/components/menu-item-card";
import { getTranslations } from "next-intl/server";
import { getDishes } from "@/lib/db/dish";
import { MenuSectionClient } from "./menu-section-client";

interface MenuSectionProps {
  locale: string;
}

export async function MenuSection({ locale }: MenuSectionProps) {
  const t = await getTranslations("menu");
  
  // Get all active dishes with error handling
  let dishes: Awaited<ReturnType<typeof getDishes>> = [];
  try {
    dishes = await getDishes({ isActive: true, locale: locale as "en" | "nl" | "fr" });
    
    // Log in production for debugging
    if (process.env.NODE_ENV === "production") {
      console.log(`[MenuSection] Fetched ${dishes.length} dishes for locale: ${locale}`);
    }
  } catch (error: any) {
    // Enhanced error logging for production debugging
    console.error("[MenuSection] Error fetching dishes:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      locale,
    });
    
    // In production, also try fetching without isActive filter to see if it's a data issue
    if (process.env.NODE_ENV === "production") {
      try {
        const allDishes = await getDishes({ locale: locale as "en" | "nl" | "fr" });
        console.log(`[MenuSection] Total dishes in DB: ${allDishes.length}, Active: ${allDishes.filter(d => d.isActive).length}`);
      } catch (fallbackError: any) {
        console.error("[MenuSection] Fallback query also failed:", fallbackError?.message);
      }
    }
    
    // Return empty array on error to prevent page crash
    // The UI will show "No dishes available" message
  }

  return <MenuSectionClient dishes={dishes} locale={locale} />;
}

