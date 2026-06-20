import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { tokenId } = await req.json();

  if (!tokenId) {
    return NextResponse.json({ error: "Token ID required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("cards")
    .update({ status: "active" })
    .eq("token_id", Number(tokenId));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}