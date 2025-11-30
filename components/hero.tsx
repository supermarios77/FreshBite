import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function Hero({
  headline = "Homemade Frozen Meals, Delivered Fresh",
  subheadline = "Discover our collection of chef-prepared, ready-to-heat meals. Made with premium ingredients and delivered straight to your door.",
  ctaText = "Browse Menu",
  ctaHref = "/menu",
  imageSrc = "/placeholder-dish.jpg",
  imageAlt = "Delicious frozen meal",
}: HeroProps = {}) {
  return (
    <section className="bg-white py-16 lg:py-24 xl:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 lg:space-y-10">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight tracking-tight">
                {headline}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary leading-relaxed max-w-2xl">
                {subheadline}
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link href={ctaHref}>
                <Button
                  size="lg"
                  variant="accent"
                  className="text-base sm:text-lg px-8 py-6 rounded-lg shadow-soft hover:shadow-md transition-all duration-200"
                >
                  {ctaText}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative w-full aspect-square lg:aspect-[4/5] max-w-lg mx-auto lg:max-w-none">
            <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-soft bg-secondary">
              {imageSrc && imageSrc !== "/placeholder-dish.jpg" ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
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
            {/* Decorative accent - optional */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl -z-10 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

