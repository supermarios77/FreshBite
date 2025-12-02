"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function Hero({
  headline,
  subheadline,
  ctaText,
  ctaHref = "/menu",
  imageSrc = "/placeholder-dish.jpg",
  imageAlt,
}: HeroProps = {}) {
  const t = useTranslations("hero");
  
  const displayHeadline = headline || t("headline");
  const displaySubheadline = subheadline || t("subheadline");
  const displayCtaText = ctaText || t("browseMenu");
  const displayImageAlt = imageAlt || displayHeadline;
  
  return (
    <section className="bg-background">
      <div className="container mx-auto px-8 py-16 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Headline - monospace uppercase */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-foreground leading-[1.2] tracking-widest uppercase">
              {displayHeadline}
            </h1>

            {/* Subheadline - monospace */}
            <p className="text-sm text-text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0 tracking-wide">
              {displaySubheadline}
            </p>

            {/* Simple CTA */}
            <div className="pt-4">
              <Link href={ctaHref}>
                <Button
                  size="lg"
                  variant="accent"
                  className="text-xs px-6 py-3 border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background dark:hover:bg-foreground dark:hover:text-background transition-all duration-200 tracking-widest uppercase rounded-none"
                >
                  {displayCtaText}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Image - simpler presentation */}
          <div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
            <div className="relative w-full h-full overflow-hidden bg-secondary border border-border">
              <Image
                src={imageSrc || "/placeholder-dish.jpg"}
                alt={displayImageAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

