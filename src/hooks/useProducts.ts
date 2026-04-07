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
      if (error) throw error;
      return data;
    },
  });
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // Use raw fetch to bypass potential Supabase client issues
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/categories?select=*&order=display_order.asc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Categories fetch failed: ${res.status}`);
      }
      const data = await res.json();
      return data as Category[];
    },
  });
}
