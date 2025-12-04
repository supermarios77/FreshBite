import { createBrowserClient } from "@supabase/ssr";
import { getPublishableKey } from "./keys";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error(
      "Missing Supabase environment variable: NEXT_PUBLIC_SUPABASE_URL"
    );
  }

  const publishableKey = getPublishableKey();

  return createBrowserClient(supabaseUrl, publishableKey);
}

