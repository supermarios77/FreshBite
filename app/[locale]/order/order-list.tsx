"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Package, Calendar, MapPin, Mail, Phone, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { OrderLogoutButton } from "./order-logout-button";

interface OrderItem {
  id: string;
  dishId: string;
  quantity: number;
  price: number;
  size?: string | null;
  dish: {
    id: string;
    name: string;
    nameEn: string;
    nameNl: string;
    nameFr: string;
    imageUrl?: string | null;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  items: OrderItem[];
}

interface OrderListProps {
  orders: Order[];
  locale: string;
  email?: string;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-secondary text-foreground";
    case "PAID":
      return "bg-accent/20 text-foreground";
    case "PREPARING":
      return "bg-accent/30 text-foreground";
    case "SHIPPED":
      return "bg-accent/40 text-foreground";
    case "DELIVERED":
      return "bg-accent/50 text-foreground";
    case "CANCELLED":
      return "bg-destructive/20 text-destructive";
    default:
      return "bg-secondary text-foreground";
  }
}

function getStatusLabel(status: string, t: any): string {
  switch (status) {
    case "PENDING":
      return t("statusPending");
    case "PAID":
      return t("statusPaid");
    case "PREPARING":
      return t("statusPreparing");
    case "SHIPPED":
      return t("statusShipped");
    case "DELIVERED":
      return t("statusDelivered");
    case "CANCELLED":
      return t("statusCancelled");
    default:
      return status;
  }
}

export function OrderList({ orders, locale, email }: OrderListProps) {
  const t = useTranslations("order");
  const router = useRouter();
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(null);

  const getDishName = (dish: OrderItem["dish"]) => {
    if (locale === "nl") return dish.nameNl;
    if (locale === "fr") return dish.nameFr;
    return dish.nameEn;
  };

  const handleOrderAgain = async (order: Order) => {
    setReorderingOrderId(order.id);
    
    try {
      // Add all items from the order to the cart
      for (const item of order.items) {
        const dishName = getDishName(item.dish);
        
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dishId: item.dishId,
            name: dishName,
            price: item.price,
            quantity: item.quantity,
            imageSrc: item.dish.imageUrl || undefined,
            size: item.size || undefined,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to add item to cart");
        }
      }

      // Redirect to cart page
      router.push("/cart");
    } catch (error: any) {
      console.error("Error reordering:", error);
      alert(error.message || t("reorderError"));
      setReorderingOrderId(null);
    }
  };

  if (!email) {
    return (
      <div className="bg-background min-h-screen py-16">
        <div className="container mx-auto px-8 max-w-4xl">
          <div className="text-center space-y-6">
            <h1 className="text-3xl lg:text-4xl font-normal text-foreground tracking-widest uppercase">
              {t("title")}
            </h1>
            <p className="text-base text-text-secondary tracking-wide max-w-xl mx-auto">
              {t("enterEmail")}
            </p>
            <form
              action=""
              method="get"
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                name="email"
                placeholder={t("emailPlaceholder")}
                required
                className="flex-1 px-4 py-3 border-2 border-foreground bg-background text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-foreground transition-all text-sm tracking-wide"
              />
              <Button
                type="submit"
                variant="default"
                className="px-8 py-3 text-xs tracking-widest uppercase"
              >
                {t("viewOrders")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-background min-h-screen py-16">
        <div className="container mx-auto px-8 max-w-4xl">
          <div className="text-center space-y-6">
            <h1 className="text-3xl lg:text-4xl font-normal text-foreground tracking-widest uppercase">
              {t("title")}
            </h1>
            <p className="text-base text-text-secondary tracking-wide">
              {t("noOrders")}
            </p>
            <Link href="/">
              <Button variant="outline" className="mt-4">
                {t("browseMenu")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-8 max-w-4xl">
        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-normal text-foreground tracking-widest uppercase mb-2">
                {t("title")}
              </h1>
              <p className="text-sm text-text-secondary tracking-wide">
                {t("orderCount", { count: orders.length })}
              </p>
            </div>
            <OrderLogoutButton />
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card border-2 border-border p-6 lg:p-8 space-y-6"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b-2 border-border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-text-secondary" />
                      <span className="text-xs text-text-secondary tracking-wide uppercase">
                        {t("orderId")}: {order.id.slice(0, 8)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm text-foreground tracking-wide">
                        {new Date(order.createdAt).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-normal tracking-wide uppercase border border-border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status, t)}
                    </span>
                    <span className="text-xl font-normal text-foreground tracking-wide">
                      €{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="text-sm font-normal text-foreground tracking-widest uppercase">
                    {t("items")}
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 pb-3 border-b border-border last:border-0"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 bg-secondary border border-border">
                          {item.dish.imageUrl ? (
                            <Image
                              src={item.dish.imageUrl}
                              alt={getDishName(item.dish)}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-text-secondary/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-normal text-foreground tracking-wide uppercase line-clamp-1">
                            {getDishName(item.dish)}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-text-secondary tracking-wide">
                              {t("quantity")}: {item.quantity}
                            </span>
                            {item.size && (
                              <span className="text-xs text-text-secondary tracking-wide">
                                {t("size")}: {item.size}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-normal text-foreground tracking-wide">
                          €{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information */}
                {(order.address || order.city || order.postalCode) && (
                  <div className="pt-4 border-t-2 border-border space-y-3">
                    <h3 className="text-sm font-normal text-foreground tracking-widest uppercase">
                      {t("deliveryAddress")}
                    </h3>
                    <div className="space-y-1 text-sm text-text-secondary tracking-wide">
                      {order.firstName && order.lastName && (
                        <p>
                          {order.firstName} {order.lastName}
                        </p>
                      )}
                      {order.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>{order.address}</p>
                        </div>
                      )}
                      {(order.city || order.postalCode) && (
                        <p>
                          {order.postalCode} {order.city}
                        </p>
                      )}
                      {order.country && <p>{order.country}</p>}
                      {order.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <p>{order.phone}</p>
                        </div>
                      )}
                      {order.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <p>{order.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Again Button */}
                <div className="pt-4 border-t-2 border-border">
                  <Button
                    variant="accent"
                    onClick={() => handleOrderAgain(order)}
                    disabled={reorderingOrderId === order.id}
                    className="w-full text-xs tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    {reorderingOrderId === order.id ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-background"></div>
                        {t("addingToCart")}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3 h-3" />
                        {t("orderAgain")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Back to Menu */}
          <div className="pt-6 border-t-2 border-border text-center">
            <Link href="/">
              <Button variant="outline" className="text-xs tracking-widest uppercase">
                {t("browseMenu")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

