"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");
  const isMock = searchParams.get("mock") === "true";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If mock mode, mark order as paid
    if (isMock && orderId) {
      fetch("/api/stripe/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          type: "checkout.session.completed",
        }),
      })
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error updating order:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [isMock, orderId]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-16 lg:py-24">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Order Confirmed!
          </h1>

          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Thank you for your order. {isMock && "(Mock Mode)"}
            {orderId && ` Your order ID is: ${orderId}`}
          </p>

          <p className="text-base text-text-secondary">
            You will receive a confirmation email shortly with your order details
            and delivery information.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/menu">
              <Button variant="outline" size="lg" className="px-8">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button variant="accent" size="lg" className="px-8">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

