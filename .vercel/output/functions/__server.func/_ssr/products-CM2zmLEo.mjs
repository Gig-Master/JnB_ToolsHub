import { c as eq, s as desc } from "../_libs/drizzle-orm+postgres.mjs";
import { d as db, f as productImages, p as products, r as createServerFn } from "./server-0p_jwNzp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcX0hp8W.mjs";
import { i as requireAdmin } from "./auth.server-CY2MwgHO.mjs";
import { i as getSupabaseAdmin, r as PRODUCT_IMAGE_BUCKET } from "./supabase-BaSBum3O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-CM2zmLEo.js
/**
* Turns "Angle Grinder 850W" → "angle-grinder-850w".
*/
function slugify(input) {
	return input.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
/**
* Ensures uniqueness by appending -2, -3, … against a set of existing slugs.
*/
function uniqueSlug(base, taken) {
	const root = slugify(base) || "product";
	if (!taken.has(root)) return root;
	let n = 2;
	while (taken.has(`${root}-${n}`)) n++;
	return `${root}-${n}`;
}
/** List all products (optionally filtered by featured) */
var listProducts_createServerFn_handler = createServerRpc({
	id: "7168ced1940421b873830f33fc8824b97133dba4136aae2ddd63332934576763",
	name: "listProducts",
	filename: "src/functions/products.ts"
}, (opts) => listProducts.__executeServer(opts));
var listProducts = createServerFn({ method: "GET" }).validator((d) => d ?? {}).handler(listProducts_createServerFn_handler, async ({ data }) => {
	return db.query.products.findMany({
		where: data.featured ? eq(products.featured, true) : void 0,
		with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] } },
		orderBy: [desc(products.featured), desc(products.createdAt)]
	});
});
var getProductBySlug_createServerFn_handler = createServerRpc({
	id: "66405e49fd4871c86fc1a1e9e73f969fef1c4b599498313c0e81262dbd18bbd2",
	name: "getProductBySlug",
	filename: "src/functions/products.ts"
}, (opts) => getProductBySlug.__executeServer(opts));
var getProductBySlug = createServerFn({ method: "GET" }).validator((d) => d).handler(getProductBySlug_createServerFn_handler, async ({ data }) => {
	return db.query.products.findFirst({
		where: eq(products.slug, data.slug),
		with: {
			category: true,
			subcategory: true,
			images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] }
		}
	});
});
var saveProduct_createServerFn_handler = createServerRpc({
	id: "43a2dc4a6e34c02494169e94cf31f0b525e46514cd3149950e534f01e87a1fc0",
	name: "saveProduct",
	filename: "src/functions/products.ts"
}, (opts) => saveProduct.__executeServer(opts));
var saveProduct = createServerFn({ method: "POST" }).validator((d) => d).handler(saveProduct_createServerFn_handler, async ({ data }) => {
	await requireAdmin();
	const { id, images, ...productFields } = data;
	let slug = "";
	if (!id) {
		const existing = await db.select({ slug: products.slug }).from(products);
		const takenSlugs = new Set(existing.map((p) => p.slug));
		slug = uniqueSlug(productFields.name, takenSlugs);
	}
	return db.transaction(async (tx) => {
		let productId = id;
		if (productId) {
			await tx.update(products).set({
				...productFields,
				updatedAt: /* @__PURE__ */ new Date()
			}).where(eq(products.id, productId));
			await tx.delete(productImages).where(eq(productImages.productId, productId));
		} else {
			const [created] = await tx.insert(products).values({
				...productFields,
				slug
			}).returning();
			productId = created.id;
		}
		if (images && images.length > 0) await tx.insert(productImages).values(images.map((img, i) => ({
			productId,
			url: img.url,
			alt: img.alt,
			storagePath: img.storagePath ?? null,
			isPrimary: img.isPrimary ?? i === 0,
			sortOrder: i
		})));
		return {
			ok: true,
			id: productId,
			slug: slug || void 0
		};
	});
});
var deleteProduct_createServerFn_handler = createServerRpc({
	id: "8abd195734467057fe3fd3db958ff277fd2feaced401ea18c2f4f3dfad191dda",
	name: "deleteProduct",
	filename: "src/functions/products.ts"
}, (opts) => deleteProduct.__executeServer(opts));
var deleteProduct = createServerFn({ method: "POST" }).validator((d) => d).handler(deleteProduct_createServerFn_handler, async ({ data }) => {
	await requireAdmin();
	const product = await db.query.products.findFirst({
		where: eq(products.id, data.id),
		with: { images: true }
	});
	if (!product) return {
		ok: false,
		error: "Product not found"
	};
	await db.delete(products).where(eq(products.id, data.id));
	if (product.images.length > 0) {
		const storagePaths = product.images.map((img) => img.storagePath).filter((path) => !!path);
		if (storagePaths.length > 0) {
			const { error } = await getSupabaseAdmin().storage.from(PRODUCT_IMAGE_BUCKET).remove(storagePaths);
			if (error) console.error("Failed to delete images from storage:", error);
		}
	}
	return { ok: true };
});
//#endregion
export { deleteProduct_createServerFn_handler, getProductBySlug_createServerFn_handler, listProducts_createServerFn_handler, saveProduct_createServerFn_handler };
