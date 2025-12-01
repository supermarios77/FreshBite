import { MenuItemCard } from "@/components/menu-item-card";
import { getTranslations } from "next-intl/server";
import { getDishes } from "@/lib/db/dish";
import { MenuSectionClient } from "./menu-section-client";

interface MenuSectionProps {
  locale: string;
}

export async function MenuSection({ locale }: MenuSectionProps) {
  const t = await getTranslations("menu");
  // Get all active dishes
  const dishes = await getDishes({ isActive: true, locale: locale as "en" | "nl" | "fr" });

  return <MenuSectionClient dishes={dishes} locale={locale} />;
}

