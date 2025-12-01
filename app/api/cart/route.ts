import { NextRequest, NextResponse } from "next/server";
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  type CartItem,
} from "@/lib/cart-supabase";

export const runtime = "nodejs";

// GET - Get cart
export async function GET() {
  try {
    const cart = await getCart();
    return NextResponse.json({ cart });
  } catch (error: any) {
    console.error("Error getting cart:", error);
    return NextResponse.json(
      { error: "Failed to get cart" },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dishId, name, price, quantity, imageSrc, size } = body;

    if (!dishId || !name || price === undefined || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cart = await addToCart({
      dishId,
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageSrc,
      size,
    });

    return NextResponse.json({ cart, success: true });
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cart = await updateCartItemQuantity(itemId, parseInt(quantity));
    return NextResponse.json({ cart, success: true });
  } catch (error: any) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart or clear cart
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");
    const clear = searchParams.get("clear") === "true";

    if (clear) {
      await clearCart();
      return NextResponse.json({ cart: [], success: true });
    }

    if (!itemId) {
      return NextResponse.json(
        { error: "Missing itemId parameter" },
        { status: 400 }
      );
    }

    const cart = await removeFromCart(itemId);
    return NextResponse.json({ cart, success: true });
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}

