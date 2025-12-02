import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="bg-background min-h-screen flex items-center justify-center px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 flex items-center justify-center border-2 border-foreground">
            <Package className="w-8 h-8 text-foreground" />
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button
              variant="accent"
              className="text-xs px-8 py-3 tracking-widest uppercase rounded-none"
            >
              {t("goHome")}
            </Button>
          </Link>
          <Link href="/#menu">
            <Button
              variant="outline"
              className="text-xs px-8 py-3 tracking-widest uppercase rounded-none"
            >
              {t("browseMenu")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

