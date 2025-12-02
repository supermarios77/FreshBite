"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";

interface CartItem {
  id: string;
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  imageSrc?: string;
  size?: string;
}

export default function CartPage() {
  const t = useTranslations("cart");
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const response = await fetch(`/api/cart?itemId=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart || []);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: id, quantity: newQuantity }),
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart || []);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.21; // 21% VAT for Belgium
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;

  const isCartEmpty = cartItems.length === 0;

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary">
            {cartItems.length === 0
              ? t("emptyCart")
              : t("itemCount", { count: cartItems.length })}
          </p>
        </div>

        {isCartEmpty ? (
          /* Empty Cart State */
          <div className="bg-card rounded-xl lg:rounded-2xl shadow-soft border border-border p-12 lg:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-accent" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {t("emptyTitle")}
              </h2>
              <p className="text-lg text-text-secondary mb-8">
                {t("emptyDescription")}
              </p>
              <Link href="/menu">
                <Button variant="accent" size="lg" className="rounded-lg shadow-soft">
                  {t("browseMenu")}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl lg:rounded-2xl shadow-soft border border-border p-6 lg:p-8"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Item Image */}
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                      {item.imageSrc ? (
                        <Image
                          src={item.imageSrc}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-text-secondary text-sm">
                          {t("noImage")}
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">
                          {item.name}
                        </h3>
                        {item.size && (
                          <p className="text-sm text-text-secondary mb-2">{item.size}</p>
                        )}
                        <p className="text-lg font-bold text-foreground">
                          €{item.price.toFixed(2)} {t("each")}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity === 1}
                            className="rounded-r-none h-10 w-10"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 text-lg font-medium text-foreground min-w-[3ch] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="rounded-l-none h-10 w-10"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-xl lg:text-2xl font-bold text-foreground">
                            €{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-10 w-10 text-red-500 hover:bg-red-50"
                          aria-label={t("removeItem", { name: item.name })}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="bg-card rounded-xl lg:rounded-2xl shadow-soft border border-border p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("orderSummary")}
                </h2>

                {/* Pricing Breakdown */}
                <div className="space-y-4 mb-6 border-b border-border pb-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-text-secondary">{t("subtotal")}</span>
                    <span className="text-foreground font-medium">
                      €{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-text-secondary">{t("taxes")}</span>
                    <span className="text-foreground font-medium">
                      €{taxes.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-2xl font-bold text-foreground mb-8">
                  <span>{t("total")}</span>
                  <span>€{total.toFixed(2)}</span>
                </div>

                {/* Proceed to Checkout Button */}
                <Link href="/checkout" className="block">
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full rounded-lg shadow-soft flex items-center justify-center gap-2"
                  >
                    {t("proceedToCheckout")}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                {/* Continue Shopping Link */}
                <Link
                  href="/menu"
                  className="block text-center text-text-secondary hover:text-accent transition-colors mt-4"
                >
                  {t("continueShopping")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

