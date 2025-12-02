"use client";

import { OrderSignIn } from "./order-signin";

export function OrderSignInClient({ locale }: { locale: string }) {
  const handleSignInSuccess = () => {
    // Reload the page to show orders
    window.location.reload();
  };

  return <OrderSignIn locale={locale} onSignInSuccess={handleSignInSuccess} />;
}

