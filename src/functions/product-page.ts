import { createServerFn } from "@tanstack/react-start";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import type { ProductDTO } from "@/types";

type ProductRow = NonNullable<Awaited<ReturnType<typeof findOne>>>;

function findOne(slug: string) {
  return db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      category: true,
      subcategory: true,
      images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] },
    },
  });
}

// Dates become plain strings so the page can be sent to the browser safely.
function toDTO(p: {
  id: string; slug: string; name: string; categoryId: string; subcategoryId: string | null;
  brand: string; price: number; shortDescription: string; fullDescription: string;
  specifications: Record<string, string>; features: string[]; applications: string[];
  featured: boolean; inStock: boolean; createdAt: Date; updatedAt: Date;
  images: { id: string; url: string; alt: string; isPrimary: boolean; sortOrder: number; storagePath: string | null; createdAt: Date }[];
}): ProductDTO {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryId: p.categoryId,
    subcategoryId: p.subcategoryId,
    brand: p.brand,
    price: p.price,
    shortDescription: p.shortDescription,
    fullDescription: p.fullDescription,
    specifications: p.specifications,
    features: p.features,
    applications: p.applications,
    featured: p.featured,
    inStock: p.inStock,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    images: p.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
      storagePath: img.storagePath,
    })),
  };
}

/** Everything one product page needs: the product, its category, and related items. */
export const getProductPage = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => ({ slug: String(d?.slug ?? "").slice(0, 200) }))
  .handler(async ({ data }) => {
    try {
      const row: ProductRow | undefined = await findOne(data.slug);
      if (!row) return null;

      const related = await db.query.products.findMany({
        where: and(eq(products.categoryId, row.categoryId), ne(products.id, row.id)),
        with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] } },
        limit: 4,
      });

      return {
        product: toDTO(row),
        category: { name: row.category.name, slug: row.category.slug },
        subcategoryName: row.subcategory?.name ?? null,
        related: related.map(toDTO),
      };
    } catch (error) {
      console.error("Failed to load product page:", error);
      throw new Error("Unable to load this product right now. Please try again.");
    }
  });