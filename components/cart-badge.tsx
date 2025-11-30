"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/routing";

export function CartBadge() {
  const [itemCount, setItemCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Fetch cart count
    const fetchCartCount = async () => {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          const count = (data.cart || []).reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          );
          setItemCount(count);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();

    // Refresh cart count when pathname changes (user navigates)
    const interval = setInterval(fetchCartCount, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [pathname]);

  if (itemCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs flex items-center justify-center text-foreground font-semibold">
      {itemCount > 9 ? "9+" : itemCount}
    </span>
  );
}

