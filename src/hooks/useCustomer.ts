import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/functions/customer";

export function useCustomer() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
    staleTime: 1000 * 60 * 5,
  });
}