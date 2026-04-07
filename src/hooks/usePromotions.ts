import { useQuery } from "@tanstack/react-query";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function usePromotions() {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/promotions?select=*&is_active=eq.true&order=display_order.asc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Promotions fetch failed: ${res.status}`);
      }
      return res.json();
    },
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/site_settings?select=*`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Site settings fetch failed: ${res.status}`);
      }
      return res.json();
    },
  });
}
