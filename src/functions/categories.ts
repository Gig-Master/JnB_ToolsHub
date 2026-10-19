import { createServerFn } from "@tanstack/react-start";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdmin } from "@/lib/auth.server";

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  return db.query.categories.findMany({
    with: { subcategories: { orderBy: (s, { asc }) => [asc(s.name)] } },
    orderBy: [asc(categories.sortOrder)],
  });
});