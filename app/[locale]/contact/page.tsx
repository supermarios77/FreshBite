import { getTranslations } from "next-intl/server";
import { ContactForm } from "./contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("contact");

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

      {/* Contact Information & Form Section */}
      <section>
        <div className="container mx-auto px-8 py-16 lg:py-24 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-normal text-foreground tracking-widest uppercase mb-6">
                  {t("getInTouch")}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed tracking-wide mb-8">
                  {t("description")}
                </p>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 flex items-center justify-center border-2 border-foreground flex-shrink-0">
                    <Mail className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-foreground tracking-widest uppercase mb-1">
                      {t("email")}
                    </h3>
                    <a
                      href="mailto:info@freshbite.com"
                      className="text-sm text-text-secondary hover:text-foreground transition-colors tracking-wide"
                    >
                      info@freshbite.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 flex items-center justify-center border-2 border-foreground flex-shrink-0">
                    <Phone className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-foreground tracking-widest uppercase mb-1">
                      {t("phone")}
                    </h3>
                    <a
                      href="tel:+32123456789"
                      className="text-sm text-text-secondary hover:text-foreground transition-colors tracking-wide"
                    >
                      +32 12 34 56 789
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 flex items-center justify-center border-2 border-foreground flex-shrink-0">
                    <MapPin className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-foreground tracking-widest uppercase mb-1">
                      {t("address")}
                    </h3>
                    <p className="text-sm text-text-secondary tracking-wide">
                      {t("addressLine1")}
                      <br />
                      {t("addressLine2")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-normal text-foreground tracking-widest uppercase mb-4">
                  {t("businessHours")}
                </h3>
                <div className="space-y-2 text-sm text-text-secondary tracking-wide">
                  <p>{t("hoursMonday")}</p>
                  <p>{t("hoursTuesday")}</p>
                  <p>{t("hoursWednesday")}</p>
                  <p>{t("hoursThursday")}</p>
                  <p>{t("hoursFriday")}</p>
                  <p>{t("hoursWeekend")}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-card border-2 border-border p-6 lg:p-8">
              <h2 className="text-2xl sm:text-3xl font-normal text-foreground tracking-widest uppercase mb-6">
                {t("sendMessage")}
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

