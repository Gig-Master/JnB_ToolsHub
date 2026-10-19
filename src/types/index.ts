/* ─────────── DTOs (what the API returns to the client) ─────────── */

export interface ProductImageDTO {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
  storagePath: string | null;
}

export interface SubcategoryDTO {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
}

export interface CategoryDTO {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  sortOrder: number;
  subcategories: SubcategoryDTO[];
}

export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  subcategoryId: string | null;
  brand: string;
  price: number; // KSh, whole shillings
  shortDescription: string;
  fullDescription: string;
  specifications: Record<string, string>;
  features: string[];
  applications: string[];
  featured: boolean;
  inStock: boolean;
  createdAt: string; // ISO string over the wire
  updatedAt: string;
  images: ProductImageDTO[];
}

/* ─────────── Input payloads (what the admin sends to the API) ─────────── */

export interface ProductImageInput {
  url: string;
  alt: string;
  storagePath?: string;
  isPrimary?: boolean;
}

export interface CreateProductInput {
  name: string;
  categoryId: string;
  subcategoryId?: string | null;
  brand: string;
  price: number;
  shortDescription: string;
  fullDescription: string;
  specifications?: Record<string, string>;
  features?: string[];
  applications?: string[];
  featured?: boolean;
  inStock?: boolean;
  images?: ProductImageInput[];
}

export type UpdateProductInput = Partial<CreateProductInput> & { id: string };
