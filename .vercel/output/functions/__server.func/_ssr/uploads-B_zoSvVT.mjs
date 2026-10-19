import { r as createServerFn } from "./server-0p_jwNzp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcX0hp8W.mjs";
import { i as requireAdmin } from "./auth.server-CY2MwgHO.mjs";
import { i as getSupabaseAdmin, n as MAX_IMAGE_BYTES, r as PRODUCT_IMAGE_BUCKET, t as ALLOWED_IMAGE_TYPES } from "./supabase-BaSBum3O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/uploads-B_zoSvVT.js
var uploadProductImage_createServerFn_handler = createServerRpc({
	id: "a1387a986efd69f83def71b59016758720e90516b8450790cfdd5548e50c6611",
	name: "uploadProductImage",
	filename: "src/functions/uploads.ts"
}, (opts) => uploadProductImage.__executeServer(opts));
var uploadProductImage = createServerFn({ method: "POST" }).validator((d) => d).handler(uploadProductImage_createServerFn_handler, async ({ data }) => {
	await requireAdmin();
	const file = data.get("file");
	const alt = String(data.get("alt") ?? "").trim();
	if (!(file instanceof File)) return {
		ok: false,
		error: "No file provided"
	};
	if (!alt) return {
		ok: false,
		error: "Alt text is required"
	};
	if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return {
		ok: false,
		error: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`
	};
	if (file.size > 5242880) return {
		ok: false,
		error: `File too large. Max ${MAX_IMAGE_BYTES / 1024 / 1024} MB`
	};
	const supabase = getSupabaseAdmin();
	const ext = file.name.split(".").pop() ?? "jpg";
	const path = `products/${crypto.randomUUID()}.${ext}`;
	const buffer = await file.arrayBuffer();
	const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, buffer, {
		contentType: file.type,
		upsert: false
	});
	if (error) {
		console.error("Supabase upload error:", error);
		return {
			ok: false,
			error: error.message
		};
	}
	const { data: pub } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
	return {
		ok: true,
		url: pub.publicUrl,
		storagePath: path,
		alt
	};
});
var deleteProductImage_createServerFn_handler = createServerRpc({
	id: "256524823639d8acc8837201851f30d3466655c0eec147edd479c7ef9afb65a0",
	name: "deleteProductImage",
	filename: "src/functions/uploads.ts"
}, (opts) => deleteProductImage.__executeServer(opts));
var deleteProductImage = createServerFn({ method: "POST" }).validator((d) => d).handler(deleteProductImage_createServerFn_handler, async ({ data }) => {
	await requireAdmin();
	const { error } = await getSupabaseAdmin().storage.from(PRODUCT_IMAGE_BUCKET).remove([data.storagePath]);
	if (error) return {
		ok: false,
		error: error.message
	};
	return { ok: true };
});
//#endregion
export { deleteProductImage_createServerFn_handler, uploadProductImage_createServerFn_handler };
