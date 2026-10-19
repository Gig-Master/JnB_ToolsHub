import "dotenv/config";
import { db } from "./index";
import { categories, subcategories } from "./schema";
import { CATEGORIES } from "@/data/categories";
import { slugify } from "@/lib/slug";

/**
 * Subcategories keyed by the CATEGORY slug (not the string id — they
 * differ for some entries, e.g. id="agricultural-machinery" slug="agriculture").
 * Array order is preserved as `sort_order`.
 */
const SUBCATEGORIES: Record<string, string[]> = {
  "power-tools": ["Angle Grinders", "Cordless Drills", "Circular Saws", "Impact Drivers"],
  agriculture: ["Water Pumps", "Chaff Cutters", "Knapsack Sprayers"],
  solar: ["Solar Panels", "Inverters", "Batteries"],
};

async function main() {
  const existing = await db.select().from(categories);
  if (existing.length > 0) {
    console.log(`⏭  Already seeded (${existing.length} categories). Skipping.`);
    console.log(`   To re-seed: TRUNCATE categories CASCADE; then run again.`);
    process.exit(0);
  }

  console.log(`Seeding ${CATEGORIES.length} categories…\n`);

  let totalSubs = 0;

  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];

    const [cat] = await db
      .insert(categories)
      .values({
        slug: c.slug,
        name: c.name,
        shortName: c.shortName,
        description: c.description,
        icon: c.icon,
        sortOrder: i,
      })
      .returning();

    const subNames = SUBCATEGORIES[c.slug] ?? [];
    for (let j = 0; j < subNames.length; j++) {
      await db.insert(subcategories).values({
        categoryId: cat.id,
        slug: slugify(subNames[j]),
        name: subNames[j],
        sortOrder: j,
      });
      totalSubs++;
    }

    const suffix = subNames.length ? `  (+${subNames.length} subcategories)` : "";
    console.log(`  ✓ ${cat.name.padEnd(28)} /${cat.slug}${suffix}`);
  }

  console.log(`\n✅ Seed complete. ${CATEGORIES.length} categories, ${totalSubs} subcategories.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
