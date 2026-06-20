import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getDashboardData() {
  try {
    const cardsRes = await supabaseAdmin
      .from("cards")
      .select("*")
      .order("created_at", { ascending: false });

    const transactionsRes = await supabaseAdmin
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    return {
      user: {
        username: "Raj",
      },
      cards: cardsRes.data ?? [],
      transactions: transactionsRes.data ?? [],
    };
  } catch (err) {
    console.error(err);

    return {
      user: {
        username: "Raj",
      },
      cards: [],
      transactions: [],
    };
  }
}