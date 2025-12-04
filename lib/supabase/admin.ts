/**
 * Admin Supabase client using secret key
 * Bypasses RLS for admin operations
 * Use only in admin API routes after requireAdmin() check
 * 
 * Supports both new sb_secret_... keys and legacy service_role keys
 * @see https://github.com/orgs/supabase/discussions/29260
 */

import { createClient } from "@supabase/supabase-js";
import { getSecretKey } from "./keys";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error(
      "Missing Supabase environment variable: NEXT_PUBLIC_SUPABASE_URL"
    );
  }

  const secretKey = getSecretKey();

  // Create client with secret key (bypasses RLS)
  return createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

