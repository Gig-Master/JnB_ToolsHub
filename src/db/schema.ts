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

/* ─────────── Customers ─────────── */
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(), // always stored lowercase
  name: text("name").notNull(),
  phone: text("phone"), // normalised: 2547XXXXXXXX
  passwordHash: text("password_hash").notNull(),
  failedLogins: integer("failed_logins").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ─────────── Customer delivery addresses ─────────── */
export const customerAddresses = pgTable(
  "customer_addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    label: text("label").notNull().default("Home"),
    recipientName: text("recipient_name").notNull(),
    phone: text("phone").notNull(), // normalised: 2547XXXXXXXX
    county: text("county").notNull(),
    town: text("town").notNull(), // town, estate or area
    street: text("street").notNull(), // street, building, house number
    landmark: text("landmark"), // nearby landmark or delivery instructions
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("customer_addresses_customer_idx").on(t.customerId)],
);
/* ─────────── Password reset tokens ─────────── */
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(), // SHA-256 of the emailed token
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("password_reset_customer_idx").on(t.customerId)],
);

/* ─────────── Rate limits ─────────── */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(), // e.g. "admin-login:203.0.113.5"
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- Orders ----------
// Prices are copied into the order at checkout (snapshot), so later price
// changes never alter old orders.
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: text("order_number").notNull().unique(), // e.g. JNB-261102-4821
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),

    // pending -> confirmed -> out_for_delivery -> delivered | cancelled
    status: text("status").notNull().default("pending"),
    // mpesa | cod (pay on delivery / pickup)
    paymentMethod: text("payment_method").notNull(),
    // unpaid | pending | paid | failed   (stage 4 updates this)
    paymentStatus: text("payment_status").notNull().default("unpaid"),
    // delivery | pickup
    fulfilment: text("fulfilment").notNull(),

    subtotal: integer("subtotal").notNull(), // KSh
    deliveryFee: integer("delivery_fee").notNull().default(0),
    total: integer("total").notNull(),

    // Address snapshot (copied from the saved address at checkout)
    recipientName: text("recipient_name").notNull(),
    phone: text("phone").notNull(), // 2547XXXXXXXX
    county: text("county"),
    town: text("town"),
    street: text("street"),
    landmark: text("landmark"),
    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("orders_customer_idx").on(t.customerId, t.createdAt)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    name: text("name").notNull(), // snapshot
    unitPrice: integer("unit_price").notNull(), // snapshot, KSh
    quantity: integer("quantity").notNull(),
    imageUrl: text("image_url"),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);