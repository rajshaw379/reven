import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { cardId } = await req.json();

    if (!cardId) {
      return NextResponse.json({ error: "Card ID required." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("card_id", cardId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transactions: data || [] });
  } catch {
    return NextResponse.json({ error: "Transactions failed." }, { status: 500 });
  }
}