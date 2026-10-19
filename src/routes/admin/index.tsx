import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listProducts, deleteProduct } from "@/functions/products";
import { listCategories } from "@/functions/categories";
import { ProductForm } from "@/components/admin/ProductForm";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type { ProductDTO } from "@/types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => listProducts({ data: {} }) as Promise<ProductDTO[]>,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  function handleEdit(product: ProductDTO) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  function handleCreate() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500">Manage your store inventory and images.</p>
        </div>
        <button onClick={handleCreate} className="btn-primary">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Product</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Category</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Price</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Images</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{product.name}</div>
                    <div className="text-xs text-slate-500">/{product.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {categories.find((c) => c.id === product.categoryId)?.name || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    KSh {product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {product.images.length} image(s)
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => {
                      if (confirm("Delete this product?")) deleteMutation.mutate(product.id);
                    }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <ProductForm
          initialData={editingProduct}
          categories={categories}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
          }}
        />
      )}
    </div>
  );
}