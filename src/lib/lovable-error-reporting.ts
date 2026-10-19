/**
 * Stub for Lovable's error reporting helper.
 * The original template imports this in __root.tsx, but the file
 * isn't included in the repo. We replace it with a simple console logger.
 */
export function reportLovableError(
  error: unknown,
  context?: Record<string, unknown>
) {
  console.error("[App Error Boundary]", error);
  if (context) {
    console.error("[Context]", context);
  }
}