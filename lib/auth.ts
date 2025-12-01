import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function requireAuth(locale?: string) {
  const session = await getSession();
  if (!session) {
    // Get locale from parameter or try to extract from headers
    let detectedLocale = locale;
    if (!detectedLocale) {
      try {
        const headersList = await headers();
        const referer = headersList.get("referer") || "";
        const pathMatch = referer.match(/\/(en|nl|fr)\//);
        detectedLocale = pathMatch ? pathMatch[1] : "en";
      } catch {
        detectedLocale = "en";
      }
    }
    redirect(`/${detectedLocale}/admin/login`);
  }
  return session;
}

