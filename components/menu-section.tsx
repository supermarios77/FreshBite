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
  } catch (error: any) {
    console.error("Error fetching dishes:", error);
    // Return empty array on error to prevent page crash
    // The UI will show "No dishes available" message
  }

  return <MenuSectionClient dishes={dishes} locale={locale} />;
}

