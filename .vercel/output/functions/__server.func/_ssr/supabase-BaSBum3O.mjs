import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-BaSBum3O.js
/**
* Server-only Supabase client using the SERVICE ROLE key.
* NEVER import this file from any component that runs in the browser.
* The service role key bypasses all Row Level Security.
*/
function getSupabaseAdmin() {
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url) throw new Error("SUPABASE_URL is not set. Add it to .env.local.");
	if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local.");
	return createClient(url, key, { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
}
var PRODUCT_IMAGE_BUCKET = "product-images";
var ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/avif"
];
var MAX_IMAGE_BYTES = 5242880;
//#endregion
export { getSupabaseAdmin as i, MAX_IMAGE_BYTES as n, PRODUCT_IMAGE_BUCKET as r, ALLOWED_IMAGE_TYPES as t };
