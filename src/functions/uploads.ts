import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin, PRODUCT_IMAGE_BUCKET, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth.server";

export const uploadProductImage = createServerFn({ method: "POST" })
  .validator((d: FormData) => d)
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
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
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

    // 4. Upload to Supabase Storage
    const supabase = getSupabaseAdmin();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `products/${crypto.randomUUID()}.${ext}`;

    const buffer = await file.arrayBuffer();
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (error) {
      console.error("Supabase upload error:", error);
      return { ok: false as const, error: error.message };
    }

    // 5. Get public URL
    const { data: pub } = supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .getPublicUrl(path);

    return {
      ok: true as const,
      url: pub.publicUrl,
      storagePath: path,
      alt,
    };
  });

export const deleteProductImage = createServerFn({ method: "POST" })
  .validator((d: { storagePath: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .remove([data.storagePath]);

    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });