"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariantSelector } from "./variant-selector";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/shared/skeleton";

interface Variant {
  id: string;
  name: string;
  nameEn: string;
  nameNl: string;
  nameFr: string;
  imageUrl?: string | null;
  price?: number | null;
  isActive: boolean;
}

interface VariantPopupProps {
  isOpen: boolean;
  onClose: () => void;
  dishName: string;
  dishImage?: string;
  variants: Variant[];
  basePrice: number;
  onSelect: (variant: Variant) => void;
}

export function VariantPopup({
  isOpen,
  onClose,
  dishName,
  dishImage,
  variants,
  basePrice,
  onSelect,
}: VariantPopupProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const currentImageUrl = selectedVariant?.imageUrl || dishImage;

  // Reset loading state when image URL changes
  useEffect(() => {
    if (currentImageUrl) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [currentImageUrl]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedVariant) {
      onSelect(selectedVariant);
      setSelectedVariant(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border-2 border-border rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-medium text-foreground">{dishName}</h2>
            <p className="text-sm text-text-secondary mt-1">Select a flavor</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {dishImage && !imageError ? (
            <div className="relative w-full max-w-xs mx-auto aspect-square">
              {imageLoading && (
                <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
              )}
              <Image
                src={currentImageUrl || dishImage}
                alt={dishName}
                fill
                className={`object-contain rounded-lg transition-opacity duration-300 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                sizes="(max-width: 640px) 100vw, 400px"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                unoptimized={currentImageUrl?.includes("supabase.co")}
                loading="lazy"
              />
            </div>
          ) : dishImage ? (
            <div className="w-full max-w-xs mx-auto aspect-square flex items-center justify-center bg-secondary/20 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-text-secondary"
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
            </div>
          ) : null}

          <VariantSelector
            variants={variants}
            selectedVariantId={selectedVariant?.id}
            onSelect={setSelectedVariant}
            basePrice={basePrice}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedVariant}
            className="disabled:opacity-50"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

