import { getTranslations } from "next-intl/server";
import { getOrdersByEmail } from "@/lib/db/order";
import { OrderList } from "./order-list";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { locale } = await params;
  const { email } = await searchParams;
  const t = await getTranslations("order");

  // For now, we'll show orders by email if provided
  // Later, this can be enhanced with proper user authentication
  let orders = [];
  if (email) {
    orders = await getOrdersByEmail(email);
  }

  return <OrderList orders={orders} locale={locale} email={email} />;
}

