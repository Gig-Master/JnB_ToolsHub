import { createServerFn } from "@tanstack/react-start";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth.server";
import { uniqueSlug } from "@/lib/slug";
import { getSupabaseAdmin, PRODUCT_IMAGE_BUCKET } from "@/lib/supabase";

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

      // FIX: Convert Date objects to strings to prevent Vercel serialization crashes
      return res.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        images: p.images.map((img) => ({
          ...img,
          createdAt: img.createdAt.toISOString(),
        })),
      }));
    } catch (error: any) {
      console.error("❌ FAILED TO FETCH PRODUCTS ON VERCEL:", error);
      // THROW the error so the frontend UI can show it in the red box
      throw new Error(error.message || String(error));
    }
  });

/** Get a single product by its slug */
export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    return db.query.products.findFirst({
      where: eq(products.slug, data.slug),
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
  .validator(
    (d: {
      id?: string;
      name: string;
      categoryId: string;
      subcategoryId?: string | null;
      brand: string;
      price: number;
      shortDescription: string;
      fullDescription: string;
      specifications: Record<string, string>;
      features: string[];
      applications: string[];
      featured: boolean;
      inStock: boolean;
      images: { url: string; alt: string; storagePath?: string; isPrimary?: boolean }[];
    }) => d,
  )
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
  .validator((d: { id: string }) => d)
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
