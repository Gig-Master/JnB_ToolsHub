import { useState } from "react";
import { uploadProductImage } from "@/functions/uploads";
import { saveProduct } from "@/functions/products";
import { X, Upload, Trash2 } from "lucide-react";
import type { ProductDTO, CategoryDTO, ProductImageInput } from "@/types";

interface Props {
  initialData: ProductDTO | null;
  categories: CategoryDTO[];
  onClose: () => void;
  onSaved: () => void;
}

export function ProductForm({ initialData, categories, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    categoryId: initialData?.categoryId ?? categories[0]?.id ?? "",
    subcategoryId: initialData?.subcategoryId ?? null,
    brand: initialData?.brand ?? "",
    price: initialData?.price ?? 0,
    shortDescription: initialData?.shortDescription ?? "",
    fullDescription: initialData?.fullDescription ?? "",
    featured: initialData?.featured ?? false,
    inStock: initialData?.inStock ?? true,
  });

  // Convert objects/arrays to strings for editing in textareas
  const [specsText, setSpecsText] = useState(
    Object.entries(initialData?.specifications ?? {}).map(([k, v]) => `${k}: ${v}`).join("\n")
  );
  const [featuresText, setFeaturesText] = useState((initialData?.features ?? []).join("\n"));
  const [appsText, setAppsText] = useState((initialData?.applications ?? []).join("\n"));

  const [images, setImages] = useState<ProductImageInput[]>(initialData?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Image Upload Logic ──
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const alt = prompt("Enter alt text for this image (required for SEO & accessibility):");
    if (!alt) return; // Abort if they cancel or leave it blank

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("alt", alt);
      const res = await uploadProductImage({ data: fd });
      if (res.ok) {
        setImages((prev) => [...prev, { url: res.url, alt: res.alt, storagePath: res.storagePath, isPrimary: prev.length === 0 }]);
      } else {
        alert(res.error);
      }
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Submit ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // Parse textareas back into objects/arrays
    const specifications: Record<string, string> = {};
    specsText.split("\n").forEach((line) => {
      const [k, ...v] = line.split(":");
      if (k && v.length) specifications[k.trim()] = v.join(":").trim();
    });

    const features = featuresText.split("\n").map(s => s.trim()).filter(Boolean);
    const applications = appsText.split("\n").map(s => s.trim()).filter(Boolean);

    try {
      await saveProduct({
        data: {
          id: initialData?.id,
          ...form,
          specifications,
          features,
          applications,
          images,
        },
      });
      onSaved();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1 text-slate-700">Product Name</label>
              <input required className="w-full px-4 py-2 border rounded-lg text-slate-900" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Brand</label>
              <input className="w-full px-4 py-2 border rounded-lg text-slate-900" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Price (KSh)</label>
              <input type="number" required className="w-full px-4 py-2 border rounded-lg text-slate-900" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Category</label>
              <select 
                className="w-full px-4 py-2 border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={form.categoryId} 
                onChange={e => setForm({ ...form, categoryId: e.target.value, subcategoryId: null })}
              >
                <option value="" disabled>Select a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Subcategory Dropdown */}
            {form.categoryId && (
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Subcategory (Optional)</label>
                <select 
                  className="w-full px-4 py-2 border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={form.subcategoryId || ""} 
                  onChange={e => setForm({ ...form, subcategoryId: e.target.value || null })}
                >
                  <option value="">None</option>
                  {categories.find(c => c.id === form.categoryId)?.subcategories.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-span-2 flex items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 cursor-pointer" />
                <span className="text-sm font-medium text-slate-700">Featured on Homepage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 cursor-pointer" />
                <span className="text-sm font-medium text-slate-700">In Stock</span>
              </label>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Short Description</label>
              <textarea required rows={2} className="w-full px-4 py-2 border rounded-lg text-slate-900" value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Full Description</label>
              <textarea required rows={4} className="w-full px-4 py-2 border rounded-lg text-slate-900" value={form.fullDescription} onChange={e => setForm({ ...form, fullDescription: e.target.value })} />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Specifications & Features */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Specifications (Key: Value)</label>
              <p className="text-xs text-slate-500 mb-2">One per line (e.g. Voltage: 240V)</p>
              <textarea rows={4} className="w-full px-4 py-2 border rounded-lg font-mono text-sm text-slate-900" value={specsText} onChange={e => setSpecsText(e.target.value)} />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Features</label>
                <p className="text-xs text-slate-500 mb-2">One per line</p>
                <textarea rows={2} className="w-full px-4 py-2 border rounded-lg text-sm text-slate-900" value={featuresText} onChange={e => setFeaturesText(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Applications</label>
                <p className="text-xs text-slate-500 mb-2">One per line</p>
                <textarea rows={2} className="w-full px-4 py-2 border rounded-lg text-sm text-slate-900" value={appsText} onChange={e => setAppsText(e.target.value)} />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Images */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-slate-700">Images</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border">
                  <img src={img.url} alt={img.alt} className="w-full h-24 object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              <label className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-24 cursor-pointer hover:bg-slate-50 transition-colors ${uploading ? "opacity-50" : ""}`}>
                <Upload size={20} className="text-slate-400 mb-1" />
                <span className="text-xs text-slate-500">{uploading ? "Uploading..." : "Upload Image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving || uploading} className="btn-primary cursor-pointer">
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}