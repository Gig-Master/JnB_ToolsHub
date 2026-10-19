import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { r as createServerFn } from "./server-0p_jwNzp.mjs";
import { h as Plus, i as Upload, n as X, o as Trash2, v as Pen } from "../_libs/lucide-react.mjs";
import { a as listCategories, f as createSsrRpc } from "./router-C6IrYpw5.mjs";
import { n as listProducts, r as saveProduct, t as deleteProduct } from "./products-Biw2sqGQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-D6Vl2g-J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var uploadProductImage = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("a1387a986efd69f83def71b59016758720e90516b8450790cfdd5548e50c6611"));
createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("256524823639d8acc8837201851f30d3466655c0eec147edd479c7ef9afb65a0"));
function ProductForm({ initialData, categories, onClose, onSaved }) {
	const [form, setForm] = (0, import_react.useState)({
		name: initialData?.name ?? "",
		categoryId: initialData?.categoryId ?? categories[0]?.id ?? "",
		subcategoryId: initialData?.subcategoryId ?? null,
		brand: initialData?.brand ?? "",
		price: initialData?.price ?? 0,
		shortDescription: initialData?.shortDescription ?? "",
		fullDescription: initialData?.fullDescription ?? "",
		featured: initialData?.featured ?? false,
		inStock: initialData?.inStock ?? true
	});
	const [specsText, setSpecsText] = (0, import_react.useState)(Object.entries(initialData?.specifications ?? {}).map(([k, v]) => `${k}: ${v}`).join("\n"));
	const [featuresText, setFeaturesText] = (0, import_react.useState)((initialData?.features ?? []).join("\n"));
	const [appsText, setAppsText] = (0, import_react.useState)((initialData?.applications ?? []).join("\n"));
	const [images, setImages] = (0, import_react.useState)(initialData?.images ?? []);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function handleFileUpload(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		const alt = prompt("Enter alt text for this image (required for SEO & accessibility):");
		if (!alt) return;
		setUploading(true);
		try {
			const fd = new FormData();
			fd.append("file", file);
			fd.append("alt", alt);
			const res = await uploadProductImage({ data: fd });
			if (res.ok) setImages((prev) => [...prev, {
				url: res.url,
				alt: res.alt,
				storagePath: res.storagePath,
				isPrimary: prev.length === 0
			}]);
			else alert(res.error);
		} finally {
			setUploading(false);
			e.target.value = "";
		}
	}
	function removeImage(index) {
		setImages((prev) => prev.filter((_, i) => i !== index));
	}
	async function handleSubmit(e) {
		e.preventDefault();
		setSaving(true);
		const specifications = {};
		specsText.split("\n").forEach((line) => {
			const [k, ...v] = line.split(":");
			if (k && v.length) specifications[k.trim()] = v.join(":").trim();
		});
		const features = featuresText.split("\n").map((s) => s.trim()).filter(Boolean);
		const applications = appsText.split("\n").map((s) => s.trim()).filter(Boolean);
		try {
			await saveProduct({ data: {
				id: initialData?.id,
				...form,
				specifications,
				features,
				applications,
				images
			} });
			onSaved();
		} catch (err) {
			alert(err.message);
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold text-slate-900",
						children: initialData ? "Edit Product" : "Add New Product"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-2 hover:bg-slate-200 rounded-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "flex-1 overflow-y-auto p-6 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-semibold mb-1 text-slate-700",
										children: "Product Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										className: "w-full px-4 py-2 border rounded-lg text-slate-900",
										value: form.name,
										onChange: (e) => setForm({
											...form,
											name: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-semibold mb-1 text-slate-700",
									children: "Brand"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "w-full px-4 py-2 border rounded-lg text-slate-900",
									value: form.brand,
									onChange: (e) => setForm({
										...form,
										brand: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-semibold mb-1 text-slate-700",
									children: "Price (KSh)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									required: true,
									className: "w-full px-4 py-2 border rounded-lg text-slate-900",
									value: form.price,
									onChange: (e) => setForm({
										...form,
										price: Number(e.target.value)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-semibold mb-1 text-slate-700",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "w-full px-4 py-2 border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500",
									value: form.categoryId,
									onChange: (e) => setForm({
										...form,
										categoryId: e.target.value,
										subcategoryId: null
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										disabled: true,
										children: "Select a category"
									}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.id,
										children: c.name
									}, c.id))]
								})] }),
								form.categoryId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-semibold mb-1 text-slate-700",
									children: "Subcategory (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "w-full px-4 py-2 border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500",
									value: form.subcategoryId || "",
									onChange: (e) => setForm({
										...form,
										subcategoryId: e.target.value || null
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "None"
									}), categories.find((c) => c.id === form.categoryId)?.subcategories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s.id,
										children: s.name
									}, s.id))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 flex items-center gap-6 mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: form.featured,
											onChange: (e) => setForm({
												...form,
												featured: e.target.checked
											}),
											className: "w-4 h-4 cursor-pointer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium text-slate-700",
											children: "Featured on Homepage"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: form.inStock,
											onChange: (e) => setForm({
												...form,
												inStock: e.target.checked
											}),
											className: "w-4 h-4 cursor-pointer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium text-slate-700",
											children: "In Stock"
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-slate-100" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-semibold mb-1 text-slate-700",
								children: "Short Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								required: true,
								rows: 2,
								className: "w-full px-4 py-2 border rounded-lg text-slate-900",
								value: form.shortDescription,
								onChange: (e) => setForm({
									...form,
									shortDescription: e.target.value
								})
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-semibold mb-1 text-slate-700",
								children: "Full Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								required: true,
								rows: 4,
								className: "w-full px-4 py-2 border rounded-lg text-slate-900",
								value: form.fullDescription,
								onChange: (e) => setForm({
									...form,
									fullDescription: e.target.value
								})
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-slate-100" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-semibold mb-1 text-slate-700",
									children: "Specifications (Key: Value)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 mb-2",
									children: "One per line (e.g. Voltage: 240V)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 4,
									className: "w-full px-4 py-2 border rounded-lg font-mono text-sm text-slate-900",
									value: specsText,
									onChange: (e) => setSpecsText(e.target.value)
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-semibold mb-1 text-slate-700",
										children: "Features"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-500 mb-2",
										children: "One per line"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										className: "w-full px-4 py-2 border rounded-lg text-sm text-slate-900",
										value: featuresText,
										onChange: (e) => setFeaturesText(e.target.value)
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-semibold mb-1 text-slate-700",
										children: "Applications"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-500 mb-2",
										children: "One per line"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										className: "w-full px-4 py-2 border rounded-lg text-sm text-slate-900",
										value: appsText,
										onChange: (e) => setAppsText(e.target.value)
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-slate-100" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold mb-2 text-slate-700",
							children: "Images"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-4 gap-4 mb-4",
							children: [images.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative group rounded-lg overflow-hidden border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: img.url,
									alt: img.alt,
									className: "w-full h-24 object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => removeImage(i),
									className: "absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
								})]
							}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: `border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-24 cursor-pointer hover:bg-slate-50 transition-colors ${uploading ? "opacity-50" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
										size: 20,
										className: "text-slate-400 mb-1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-slate-500",
										children: uploading ? "Uploading..." : "Upload Image"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: handleFileUpload,
										disabled: uploading
									})
								]
							})]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSubmit,
						disabled: saving || uploading,
						className: "btn-primary cursor-pointer",
						children: saving ? "Saving..." : "Save Product"
					})]
				})
			]
		})
	});
}
function AdminDashboard() {
	const queryClient = useQueryClient();
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [editingProduct, setEditingProduct] = (0, import_react.useState)(null);
	const { data: products = [], isLoading } = useQuery({
		queryKey: ["admin-products"],
		queryFn: () => listProducts({ data: {} })
	});
	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => deleteProduct({ data: { id } }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] })
	});
	function handleEdit(product) {
		setEditingProduct(product);
		setFormOpen(true);
	}
	function handleCreate() {
		setEditingProduct(null);
		setFormOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-6xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-slate-900",
					children: "Products"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-500",
					children: "Manage your store inventory and images."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleCreate,
					className: "btn-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 18 }), " Add Product"]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading products..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-slate-50 border-b border-slate-200",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 font-semibold text-slate-600 text-sm",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 font-semibold text-slate-600 text-sm",
								children: "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 font-semibold text-slate-600 text-sm",
								children: "Price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 font-semibold text-slate-600 text-sm",
								children: "Images"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 text-right font-semibold text-slate-600 text-sm",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-slate-100",
						children: [products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-slate-50/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-6 py-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-slate-900",
										children: product.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-slate-500",
										children: ["/", product.slug]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4 text-slate-600",
									children: categories.find((c) => c.id === product.categoryId)?.name || "Uncategorized"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-6 py-4 text-slate-600",
									children: ["KSh ", product.price.toLocaleString()]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-6 py-4 text-slate-600",
									children: [product.images.length, " image(s)"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-6 py-4 text-right space-x-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleEdit(product),
										className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { size: 18 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											if (confirm("Delete this product?")) deleteMutation.mutate(product.id);
										},
										className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 18 })
									})]
								})
							]
						}, product.id)), products.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "px-6 py-12 text-center text-slate-500",
							children: "No products found. Click \"Add Product\" to create one."
						}) })]
					})]
				})
			}),
			formOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
				initialData: editingProduct,
				categories,
				onClose: () => setFormOpen(false),
				onSaved: () => {
					setFormOpen(false);
					queryClient.invalidateQueries({ queryKey: ["admin-products"] });
				}
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
