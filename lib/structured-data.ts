/**
 * Structured data (JSON-LD) for SEO
 */

export interface OrganizationStructuredData {
  "@context": string;
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  contactPoint?: {
    "@type": "ContactPoint";
    telephone?: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  };
  sameAs?: string[];
}

export interface ProductStructuredData {
  "@context": string;
  "@type": "Product";
  name: string;
  description?: string;
  image?: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
}

export interface BreadcrumbStructuredData {
  "@context": string;
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export interface LocalBusinessStructuredData {
  "@context": string;
  "@type": "LocalBusiness" | "FoodEstablishment";
  name: string;
  image?: string;
  url: string;
  telephone?: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressRegion?: string;
    addressCountry: string;
    postalCode?: string;
    streetAddress?: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: string;
    longitude: string;
  };
  openingHoursSpecification?: Array<{
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  priceRange?: string;
  servesCuisine?: string[];
  acceptsReservations?: boolean;
  areaServed?: {
    "@type": "City";
    name: string;
  };
}

export function getOrganizationStructuredData(
  locale: string = "en"
): OrganizationStructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jobhi.be";
  const name = "Jobhi";
  const areaServed = locale === "nl" ? "België" : locale === "fr" ? "Belgique" : "Belgium";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: baseUrl,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      areaServed,
      availableLanguage: ["en", "nl", "fr"],
    },
  };
}

export function getProductStructuredData(
  dish: {
    name: string;
    nameEn?: string | null;
    nameNl?: string | null;
    nameFr?: string | null;
    description?: string | null;
    descriptionEn?: string | null;
    descriptionNl?: string | null;
    descriptionFr?: string | null;
    price: number;
    imageUrl?: string | null;
    slug: string;
  },
  locale: string = "en"
): ProductStructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jobhi.be";
  const name =
    locale === "en"
      ? dish.nameEn || dish.name
      : locale === "nl"
      ? dish.nameNl || dish.name
      : dish.nameFr || dish.name;

  const description =
    locale === "en"
      ? dish.descriptionEn || dish.description
      : locale === "nl"
      ? dish.descriptionNl || dish.description
      : dish.descriptionFr || dish.description;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name || dish.name,
    description: description || undefined,
    image: dish.imageUrl || undefined,
    offers: {
      "@type": "Offer",
      price: dish.price.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/${locale}/menu/${dish.slug}`,
    },
  };
}

export function getBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
): BreadcrumbStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getLocalBusinessStructuredData(
  locale: string = "en"
): LocalBusinessStructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jobhi.be";
  const name = "Jobhi";
  
  // Get business details from environment variables (set these in your .env)
  const address = process.env.BUSINESS_ADDRESS || "Brussels, Belgium";
  const phone = process.env.BUSINESS_PHONE;
  const latitude = process.env.BUSINESS_LATITUDE;
  const longitude = process.env.BUSINESS_LONGITUDE;
  const openingHours = process.env.BUSINESS_HOURS; // Format: "Mo-Fr 10:00-18:00"
  
  const addressParts = address.split(",").map(s => s.trim());
  const city = addressParts[0] || "Brussels";
  const country = addressParts[addressParts.length - 1] || "Belgium";
  
  const businessData: LocalBusinessStructuredData = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name,
    url: baseUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: country,
    },
    areaServed: {
      "@type": "City",
      name: "Brussels",
    },
    servesCuisine: ["Pakistani", "Indian", "Homemade"],
    acceptsReservations: false, // Pickup orders only
    priceRange: "€€",
  };
  
  if (phone) {
    businessData.telephone = phone;
  }
  
  if (latitude && longitude) {
    businessData.geo = {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    };
  }
  
  if (openingHours) {
    // Parse opening hours (simple format: "Mo-Fr 10:00-18:00")
    // For now, add as a note - can be enhanced later
    const hoursMatch = openingHours.match(/(\w+-\w+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})/);
    if (hoursMatch) {
      const [, days, opens, closes] = hoursMatch;
      const dayMap: Record<string, string> = {
        "Mo": "Monday",
        "Tu": "Tuesday",
        "We": "Wednesday",
        "Th": "Thursday",
        "Fr": "Friday",
        "Sa": "Saturday",
        "Su": "Sunday",
      };
      
      const [startDay, endDay] = days.split("-");
      const dayRange: string[] = [];
      const allDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
      const startIdx = allDays.indexOf(startDay);
      const endIdx = allDays.indexOf(endDay);
      
      if (startIdx !== -1 && endIdx !== -1) {
        for (let i = startIdx; i <= endIdx; i++) {
          dayRange.push(dayMap[allDays[i]]);
        }
      }
      
      if (dayRange.length > 0) {
        businessData.openingHoursSpecification = [{
          "@type": "OpeningHoursSpecification",
          dayOfWeek: dayRange,
          opens,
          closes,
        }];
      }
    }
  }
  
  return businessData;
}

