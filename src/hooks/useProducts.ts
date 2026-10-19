import { useQuery } from "@tanstack/react-query";
import { listProducts, getProductBySlug } from "@/functions/products";
import type { ProductDTO } from "@/types";

export function useProducts(filters?: { featured?: boolean }) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => listProducts({ data: filters ?? {} }) as Promise<ProductDTO[]>,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
    enabled: !!slug,
  });
}