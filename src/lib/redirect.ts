/** Only allows redirects to paths on this site. */
export function safeRedirect(path: string | undefined, fallback = "/account"): string {
  if (!path) return fallback;
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return fallback;
  return path;
}