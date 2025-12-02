import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Heart, ChefHat, Package, Truck } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("about");

  const features = [
    {
      icon: ChefHat,
      title: t("feature1Title"),
      description: t("feature1Description"),
    },
    {
      icon: Heart,
      title: t("feature2Title"),
      description: t("feature2Description"),
    },
    {
      icon: Package,
      title: t("feature3Title"),
      description: t("feature3Description"),
    },
    {
      icon: Truck,
      title: t("feature4Title"),
      description: t("feature4Description"),
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-8 py-16 lg:py-24 max-w-4xl">
          <div className="text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground tracking-widest uppercase">
              {t("title")}
            </h1>
            <p className="text-base text-text-secondary leading-relaxed max-w-2xl mx-auto tracking-wide">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-8 py-16 lg:py-24 max-w-4xl">
          <div className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-normal text-foreground tracking-widest uppercase">
              {t("storyTitle")}
            </h2>
            <div className="space-y-6 text-sm text-text-secondary leading-relaxed tracking-wide">
              <p>{t("storyParagraph1")}</p>
              <p>{t("storyParagraph2")}</p>
              <p>{t("storyParagraph3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-8 py-16 lg:py-24 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-normal text-foreground tracking-widest uppercase mb-4">
              {t("featuresTitle")}
            </h2>
            <p className="text-sm text-text-secondary tracking-wide max-w-2xl mx-auto">
              {t("featuresSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card border-2 border-border p-6 lg:p-8 space-y-4"
                >
                  <div className="w-12 h-12 flex items-center justify-center border-2 border-foreground">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-normal text-foreground tracking-widest uppercase">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed tracking-wide">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-8 py-16 lg:py-24 max-w-4xl">
          <div className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-normal text-foreground tracking-widest uppercase">
              {t("missionTitle")}
            </h2>
            <div className="space-y-6 text-sm text-text-secondary leading-relaxed tracking-wide">
              <p>{t("missionParagraph1")}</p>
              <p>{t("missionParagraph2")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="container mx-auto px-8 py-16 lg:py-24 max-w-4xl">
          <div className="text-center space-y-8">
            <h2 className="text-2xl sm:text-3xl font-normal text-foreground tracking-widest uppercase">
              {t("ctaTitle")}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed max-w-2xl mx-auto tracking-wide">
              {t("ctaDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#menu">
                <Button
                  variant="accent"
                  className="text-xs px-8 py-3 tracking-widest uppercase rounded-none"
                >
                  {t("ctaButton")}
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="text-xs px-8 py-3 tracking-widest uppercase rounded-none"
                >
                  {t("contactButton")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

