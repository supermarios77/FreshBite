import { getDishById } from "@/lib/db/dish";
import { notFound } from "next/navigation";
import { MenuItemDetailClient } from "./menu-item-detail-client";

export default async function MenuItemDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const dish = await getDishById(id, locale as "en" | "nl" | "fr");

  if (!dish || !dish.isActive) {
    notFound();
  }

  return <MenuItemDetailClient dish={dish} />;
}
