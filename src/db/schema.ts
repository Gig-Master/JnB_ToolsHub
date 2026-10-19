import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ─────────── Categories ─────────── */
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default("Wrench"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ─────────── Subcategories ─────────── */
export const subcategories = pgTable(
  "subcategories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("subcat_category_slug_uq").on(t.categoryId, t.slug)],
);

/* ─────────── Products ─────────── */
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(), // auto-generated
    name: text("name").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    subcategoryId: uuid("subcategory_id").references(() => subcategories.id, {
      onDelete: "set null",
    }),
    brand: text("brand").notNull().default(""),
    price: integer("price").notNull().default(0), // KSh, whole shillings
    shortDescription: text("short_description").notNull().default(""),
    fullDescription: text("full_description").notNull().default(""),
    specifications: jsonb("specifications").$type<Record<string, string>>().notNull().default({}),
    features: text("features").array().notNull().default([]),
    applications: text("applications").array().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    inStock: boolean("in_stock").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("products_category_idx").on(t.categoryId),
    index("products_featured_idx").on(t.featured),
    index("products_in_stock_idx").on(t.inStock),
  ],
);

/* ─────────── Product Images ─────────── */
export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(), // secure cloud URL
    alt: text("alt").notNull(), // REQUIRED
    storagePath: text("storage_path"), // Supabase object path
    isPrimary: boolean("is_primary").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("product_images_product_idx").on(t.productId)],
);

/* ─────────── Relations ─────────── */
export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  products: many(products),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));
