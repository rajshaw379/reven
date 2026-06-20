import { supabase } from "@/lib/supabase";

export async function getMarketplaceCards() {
  const { data, error } = await supabase
    .from("card_products")
    .select("*");

  console.log("Marketplace data:", data);
  console.log("Marketplace error:", error);

  if (error) {
    return [];
  }

  return data ?? [];
}