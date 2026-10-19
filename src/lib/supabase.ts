import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the SERVICE ROLE key.
 * NEVER import this file from any component that runs in the browser.
 * The service role key bypasses all Row Level Security.
 */
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("SUPABASE_URL is not set. Add it to .env.local.");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local.");

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const PRODUCT_IMAGE_BUCKET = "product-images";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB — matches bucket limit
