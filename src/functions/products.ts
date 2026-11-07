import { createServerFn } from "@tanstack/react-start";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth.server";
import { uniqueSlug } from "@/lib/slug";
import { z } from "zod";
import { getSupabaseAdmin, PRODUCT_IMAGE_BUCKET } from "@/lib/supabase";

/* ─────────────────────────────────────────────────────────────
   INPUT VALIDATION (the server never trusts what the browser sends)
   ───────────────────────────────────────────────────────────── */

function parseOrThrow<T>(schema: z.ZodType<T, z.ZodTypeDef, unknown>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Invalid input");
  }
  return result.data;
}

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Product name is required").max(200),
  categoryId: z.string().uuid("Choose a category"),
  subcategoryId: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().uuid().nullable().optional(),
  ),
  brand: z.string().trim().max(100),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .int("Price must be a whole number of shillings")
    .min(0, "Price can't be negative")
    .max(100_000_000, "Price is too large"),
  shortDescription: z.string().trim().max(500, "Short description is too long"),
  fullDescription: z.string().trim().max(10_000, "Full description is too long"),
  specifications: z.record(z.string().max(100), z.string().max(500)),
  features: z.array(z.string().trim().max(300)).max(50),
  applications: z.array(z.string().trim().max(300)).max(50),
  featured: z.boolean(),
  inStock: z.boolean(),
  images: z
    .array(
      z.object({
        url: z
          .string()
          .url("Image URL is not valid")
          .max(1000)
          .refine((u) => u.startsWith("https://"), "Image URLs must use HTTPS"),
        alt: z.string().trim().min(1, "Every image needs alt text").max(200),
        storagePath: z.string().max(500).optional(),
        isPrimary: z.boolean().optional(),
      }),
    )
    .max(12, "A product can have at most 12 images"),
});

type ProductInput = z.input<typeof productSchema>;

const idSchema = z.object({ id: z.string().uuid("Invalid product id") });

/* ─────────────────────────────────────────────────────────────
   PUBLIC ENDPOINTS (Anyone can call these)
   ───────────────────────────────────────────────────────────── */

/** List all products (optionally filtered by featured) */
export const listProducts = createServerFn({ method: "GET" })
  .validator((d: { featured?: boolean } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    try {
      const res = await db.query.products.findMany({
        where: data.featured ? eq(products.featured, true) : undefined,
        with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] } },
        orderBy: [desc(products.featured), desc(products.createdAt)],
      });

      // Convert Date objects to strings to prevent Vercel serialization crashes
      return res.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        images: p.images.map((img) => ({
          ...img,
          createdAt: img.createdAt.toISOString(),
        })),
      }));
    } catch (error) {
      // Full detail stays in the server logs (Vercel → Logs). Visitors get a generic message.
      console.error("Failed to fetch products:", error);
      throw new Error("Unable to load products right now. Please try again.");
    }
  });

/** Get a single product by its slug */
export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    return db.query.products.findFirst({
      where: eq(products.slug, String(data.slug ?? "").slice(0, 200)),
      with: {
        category: true,
        subcategory: true,
        images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] },
      },
    });
  });

/* ─────────────────────────────────────────────────────────────
   ADMIN ENDPOINTS (Requires Auth)
   ───────────────────────────────────────────────────────────── */

/** Create or Update a product */
export const saveProduct = createServerFn({ method: "POST" })
  .validator((d: ProductInput) => parseOrThrow(productSchema, d))
  .handler(async ({ data }) => {
    await requireAdmin();

    const { id, images, ...productFields } = data;

    // 1. Handle Slug Generation (only on create)
    let slug = "";
    if (!id) {
      // Fetch all existing slugs to ensure uniqueness
      const existing = await db.select({ slug: products.slug }).from(products);
      const takenSlugs = new Set(existing.map((p) => p.slug));
      slug = uniqueSlug(productFields.name, takenSlugs);
    }

    return db.transaction(async (tx) => {
      let productId = id;

      // 2. Insert or Update the Product
      if (productId) {
        await tx
          .update(products)
          .set({ ...productFields, updatedAt: new Date() })
          .where(eq(products.id, productId));

        // Delete old images (we'll re-insert the new list)
        await tx.delete(productImages).where(eq(productImages.productId, productId));
      } else {
        const [created] = await tx
          .insert(products)
          .values({ ...productFields, slug })
          .returning();
        productId = created.id;
      }

      // 3. Insert the new images
      if (images && images.length > 0) {
        await tx.insert(productImages).values(
          images.map((img, i) => ({
            productId: productId!,
            url: img.url,
            alt: img.alt,
            storagePath: img.storagePath ?? null,
            isPrimary: img.isPrimary ?? i === 0,
            sortOrder: i,
          })),
        );
      }

      return { ok: true, id: productId, slug: slug || undefined };
    });
  });

/** Delete a product (and its images via CASCADE and Supabase Storage) */
export const deleteProduct = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => parseOrThrow(idSchema, d))
  .handler(async ({ data }) => {
    await requireAdmin();

    // 1. Fetch the product first so we know which images to delete from storage
    const product = await db.query.products.findFirst({
      where: eq(products.id, data.id),
      with: { images: true },
    });

    if (!product) return { ok: false, error: "Product not found" };

    // 2. Delete the product from the DB (CASCADE deletes the product_images rows)
    await db.delete(products).where(eq(products.id, data.id));

    // 3. Delete the actual image files from Supabase Storage
    if (product.images.length > 0) {
      const storagePaths = product.images
        .map((img) => img.storagePath)
        .filter((path): path is string => !!path); // Remove nulls/undefined

      if (storagePaths.length > 0) {
        const supabase = getSupabaseAdmin();
        const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(storagePaths);

        if (error) {
          console.error("Failed to delete images from storage:", error);
          // We don't throw an error here because the product is already deleted from the DB
        }
      }
    }

    return { ok: true };
  });