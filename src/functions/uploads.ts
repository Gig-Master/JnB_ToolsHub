import { createServerFn } from "@tanstack/react-start";
import {
  getSupabaseAdmin,
  PRODUCT_IMAGE_BUCKET,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth.server";

type ImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

const EXTENSIONS: Record<ImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Reads the file's first bytes to find what it really is, whatever its name or label says. */
function detectImageType(bytes: Uint8Array): ImageType | null {
  const at = (sig: number[], offset = 0) => sig.every((b, i) => bytes[offset + i] === b);
  if (at([0xff, 0xd8, 0xff])) return "image/jpeg";
  if (at([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (at([0x52, 0x49, 0x46, 0x46]) && at([0x57, 0x45, 0x42, 0x50], 8)) return "image/webp";
  if (at([0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69], 4)) return "image/avif"; // "ftypavi"
  return null;
}

export const uploadProductImage = createServerFn({ method: "POST" })
  .validator((d: FormData) => {
    if (!(d instanceof FormData)) throw new Error("Invalid upload");
    return d;
  })
  .handler(async ({ data }) => {
    // 1. Guard: only admins can upload
    await requireAdmin();

    // 2. Extract fields from FormData
    const file = data.get("file");
    const alt = String(data.get("alt") ?? "").trim();

    // 3. Validate
    if (!(file instanceof File)) {
      return { ok: false as const, error: "No file provided" };
    }
    if (!alt) {
      return { ok: false as const, error: "Alt text is required" };
    }
    if (alt.length > 200) {
      return { ok: false as const, error: "Alt text is too long (max 200 characters)" };
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as ImageType)) {
      return {
        ok: false as const,
        error: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
      };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return {
        ok: false as const,
        error: `File too large. Max ${MAX_IMAGE_BYTES / 1024 / 1024} MB`,
      };
    }

    // 4. Check what the file really is, from its contents
    const buffer = await file.arrayBuffer();
    const realType = detectImageType(new Uint8Array(buffer));
    if (!realType) {
      return { ok: false as const, error: "That file isn't a valid image." };
    }

    // 5. Upload to Supabase Storage (type and extension come from the real content)
    const supabase = getSupabaseAdmin();
    const path = `products/${crypto.randomUUID()}.${EXTENSIONS[realType]}`;

    const { error } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(path, buffer, { contentType: realType, upsert: false });

    if (error) {
      console.error("Supabase upload error:", error);
      return { ok: false as const, error: "Upload failed. Please try again." };
    }

    // 6. Get public URL
    const { data: pub } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);

    return {
      ok: true as const,
      url: pub.publicUrl,
      storagePath: path,
      alt,
    };
  });

const STORAGE_PATH = /^products\/[0-9a-f-]{36}\.[a-z0-9]{2,5}$/i;

export const deleteProductImage = createServerFn({ method: "POST" })
  .validator((d: { storagePath: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();

    const storagePath = String(data.storagePath ?? "");
    if (!STORAGE_PATH.test(storagePath)) {
      return { ok: false as const, error: "Invalid image path" };
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([storagePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return { ok: false as const, error: "Could not delete the image." };
    }
    return { ok: true as const };
  });