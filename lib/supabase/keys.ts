/**
 * Supabase API Key Utilities
 * 
 * Supports both new API keys (sb_publishable_... and sb_secret_...) and legacy keys (anon and service_role)
 * for backward compatibility during migration period.
 * 
 * Migration timeline:
 * - June 2025: Early preview (both new and legacy keys work)
 * - July 2025: Full feature launch
 * - November 2025: Legacy keys deprecated (migration required)
 * 
 * @see https://github.com/orgs/supabase/discussions/29260
 */

/**
 * Get the publishable API key (for client-side use)
 * Prefers new sb_publishable_... key, falls back to legacy anon key
 */
export function getPublishableKey(): string {
  // New API key format: sb_publishable_...
  const newKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (newKey) {
    return newKey;
  }

  // Legacy fallback: anon key
  const legacyKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (legacyKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️  Using legacy NEXT_PUBLIC_SUPABASE_ANON_KEY. Consider migrating to NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
      );
    }
    return legacyKey;
  }

  throw new Error(
    "Missing Supabase publishable key. Please set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY for legacy)"
  );
}

/**
 * Get the secret API key (for server-side admin operations)
 * Prefers new sb_secret_... key, falls back to legacy service_role key
 */
export function getSecretKey(): string {
  // New API key format: sb_secret_...
  const newKey = process.env.SUPABASE_SECRET_KEY;
  if (newKey) {
    return newKey;
  }

  // Legacy fallback: service_role key
  const legacyKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (legacyKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️  Using legacy SUPABASE_SERVICE_ROLE_KEY. Consider migrating to SUPABASE_SECRET_KEY"
      );
    }
    return legacyKey;
  }

  throw new Error(
    "Missing Supabase secret key. Please set SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY for legacy)"
  );
}

/**
 * Check if new API keys are being used
 */
export function isUsingNewKeys(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_SECRET_KEY
  );
}

