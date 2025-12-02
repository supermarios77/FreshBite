"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    // Log error to error reporting service in production
    if (process.env.NODE_ENV === "production") {
      console.error("Application error:", error);
      // TODO: Send to error reporting service (e.g., Sentry, LogRocket)
    }
  }, [error]);

  return (
    <div className="bg-background min-h-screen flex items-center justify-center px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 flex items-center justify-center border-2 border-destructive">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-normal text-foreground tracking-widest uppercase">
            {t("title")}
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed tracking-wide max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="bg-destructive/10 border-2 border-destructive p-4 text-left">
            <p className="text-xs font-mono text-destructive break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-text-secondary mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            variant="accent"
            className="text-xs px-8 py-3 tracking-widest uppercase rounded-none"
          >
            {t("tryAgain")}
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="text-xs px-8 py-3 tracking-widest uppercase rounded-none"
            >
              {t("goHome")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

