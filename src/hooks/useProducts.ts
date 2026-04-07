import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type Category = Tables<"categories">;

interface UseProductsOptions {
  searchQuery?: string;
  categoryId?: string;
}

export function useProducts({ searchQuery, categoryId }: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ["products", searchQuery, categoryId],
    queryFn: async () => {
      console.log("[useProducts] Fetching products...", { searchQuery, categoryId });
      let query = supabase
        .from("products")
        .select("*, categories(name, slug)")
        .order("name", { ascending: true });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (searchQuery && searchQuery.trim().length > 0) {
        const term = `%${searchQuery.trim()}%`;
        query = query.or(`name.ilike.${term},active_ingredient.ilike.${term},presentation.ilike.${term}`);
      }

      const { data, error } = await query;
      if (error) {
        console.error("[useProducts] Error:", error);
        throw error;
      }
      console.log("[useProducts] Got", data?.length, "products");
      return data;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}
