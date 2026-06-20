import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { userId, cardType, walletAddress } = await req.json();

    if (!userId || !cardType) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const activationCode = crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 12)
      .toUpperCase();

    const tokenId = Date.now();

    const { data, error } = await supabaseAdmin
      .from("cards")
      .insert({
        user_id: userId,
        wallet_address: walletAddress || null,
        token_id: tokenId,
        card_type: cardType,
        status: "active",
        activation_code: activationCode,
        activation_used: false,
        telegram_linked: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    await supabaseAdmin.from("transactions").insert({
      user_id: userId,
      type: "mint",
      amount: 0,
      status: "completed",
      description: `${cardType} card minted`,
    });

    return NextResponse.json({
      success: true,
      card: data,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Mint failed." },
      { status: 500 }
    );
  }
}