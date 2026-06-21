import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const { data: cards } = await supabaseAdmin
    .from("cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const cardIds = cards?.map((card) => card.id) ?? [];

  let transactions: any[] = [];

  if (cardIds.length > 0) {
    const { data } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .in("card_id", cardIds)
      .order("created_at", { ascending: false });

    transactions = data ?? [];
  }

  return NextResponse.json({
    cards: cards ?? [],
    transactions,
  });
}