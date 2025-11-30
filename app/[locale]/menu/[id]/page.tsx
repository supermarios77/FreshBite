"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";

// Mock data - will be replaced with Supabase integration later
const mockMealData = {
  id: "1",
  name: "Grilled Salmon with Seasonal Vegetables",
  description:
    "Fresh Atlantic salmon grilled to perfection, served with a medley of roasted seasonal vegetables including asparagus, cherry tomatoes, and zucchini. Drizzled with a lemon-herb butter sauce.",
  price: 18.99,
  imageSrc: undefined, // Will use placeholder
  allergens: ["Fish", "Dairy"],
  sizeOptions: [
    { id: "regular", label: "Regular", price: 18.99 },
    { id: "large", label: "Large", price: 24.99 },
  ],
  ingredients: [
    "Atlantic Salmon Fillet (200g)",
    "Fresh Asparagus",
    "Cherry Tomatoes",
    "Zucchini",
    "Extra Virgin Olive Oil",
    "Lemon",
    "Fresh Dill",
    "Butter",
    "Sea Salt",
    "Black Pepper",
  ],
};

export default function MenuItemDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const t = useTranslations("dishDetail");
  const [selectedSize, setSelectedSize] = useState(mockMealData.sizeOptions[0].id);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Note: In a real implementation, you would await params and fetch meal data based on id
  // const { id, locale } = await params;
  // const mealData = await fetchMealById(id);

  // Get current price based on selected size
  const currentPrice =
    mockMealData.sizeOptions.find((size) => size.id === selectedSize)?.price ||
    mockMealData.price;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const selectedSizeOption = mockMealData.sizeOptions.find(
        (size) => size.id === selectedSize
      );
      const sizeLabel = selectedSizeOption?.label || "Regular";

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dishId: mockMealData.id,
          name: mockMealData.name,
          price: currentPrice,
          quantity,
          imageSrc: mockMealData.imageSrc,
          size: sizeLabel,
        }),
      });

      if (response.ok) {
        // Show success feedback
        setIsLoading(false);
        // Optionally redirect to cart or show toast
        // router.push("/cart");
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsLoading(false);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:py-12">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mb-12 lg:mb-16">
          {/* Left: Image */}
          <div className="relative w-full aspect-square lg:aspect-[4/5]">
            <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-soft bg-secondary">
              {mockMealData.imageSrc ? (
                <Image
                  src={mockMealData.imageSrc}
                  alt={mockMealData.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/30 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-text-secondary text-sm">Dish Image</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col space-y-6 lg:space-y-8">
            {/* Dish Name */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {mockMealData.name}
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed">
                {mockMealData.description}
              </p>
            </div>

            {/* Allergens */}
            {mockMealData.allergens.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                  Allergens
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockMealData.allergens.map((allergen) => (
                    <span
                      key={allergen}
                      className="px-3 py-1.5 bg-secondary rounded-full text-sm text-text-secondary"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Size Options */}
            {mockMealData.sizeOptions.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                  {t("size")}
                </h3>
                <div className="flex gap-3">
                  {mockMealData.sizeOptions.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedSize === size.id
                          ? "border-accent bg-accent/10 text-foreground"
                          : "border-border bg-white text-text-secondary hover:border-accent/50"
                      }`}
                    >
                      <div className="font-medium">{size.label}</div>
                      <div className="text-sm">€{size.price.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="pt-2">
              <div className="text-3xl lg:text-4xl font-bold text-foreground">
                €{totalPrice.toFixed(2)}
              </div>
              {quantity > 1 && (
                <div className="text-sm text-text-secondary mt-1">
                  €{currentPrice.toFixed(2)} each
                </div>
              )}
            </div>

            {/* Quantity Selector and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 border border-border rounded-lg px-4 py-3 bg-white">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-1 text-text-secondary hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-lg font-semibold text-foreground min-w-[3ch] text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-1 text-text-secondary hover:text-foreground transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={isLoading}
                variant="accent"
                size="lg"
                className="flex-1 text-base sm:text-lg px-8 py-6 rounded-lg shadow-soft hover:shadow-md transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isLoading ? t("adding") : t("addToCart")}
              </Button>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="border-t border-border pt-8 lg:pt-12">
          <div className="max-w-4xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 lg:mb-8">
              {t("ingredients")}
            </h2>
            <div className="bg-white rounded-xl lg:rounded-2xl border border-border shadow-soft p-6 lg:p-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {mockMealData.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center text-base lg:text-lg text-text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3 flex-shrink-0" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

