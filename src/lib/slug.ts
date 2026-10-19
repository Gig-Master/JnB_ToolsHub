/**
 * Turns "Angle Grinder 850W" → "angle-grinder-850w".
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")   // strip accents
    .replace(/[^a-z0-9]+/g, "-")       // non-alphanumerics → dash
    .replace(/^-+|-+$/g, "")           // trim dashes
    .slice(0, 80);                     // keep URLs sane
}

/**
 * Ensures uniqueness by appending -2, -3, … against a set of existing slugs.
 */
export function uniqueSlug(base: string, taken: Set<string>): string {
  const root = slugify(base) || "product";
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n++;
  return `${root}-${n}`;
}