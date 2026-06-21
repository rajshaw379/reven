import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createTransactionNotification } from "@/lib/createTransactionNotification";

export async function POST(req: Request) {
  try {
    const { tokenId, amountEth } = await req.json();

    if (!tokenId || !amountEth || Number(amountEth) <= 0) {
      return NextResponse.json({ error: "Invalid withdraw data." }, { status: 400 });
    }

    const { data: card, error: cardError } = await supabaseAdmin
      .from("cards")
      .select("id,user_id,card_type")
      .eq("token_id", Number(tokenId))
      .single();

    if (cardError || !card) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }

    const { data: balance } = await supabaseAdmin
      .from("card_balances")
      .select("balance_eth")
      .eq("card_id", card.id)
      .maybeSingle();

    const currentBalance = Number(balance?.balance_eth ?? 0);

    if (currentBalance < Number(amountEth)) {
      return NextResponse.json({ error: "Insufficient card balance." }, { status: 400 });
    }

    const newBalance = currentBalance - Number(amountEth);

    await supabaseAdmin
      .from("card_balances")
      .update({
        balance_eth: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("card_id", card.id);

    await supabaseAdmin.from("transactions").insert({
      card_id: card.id,
      transaction_type: "withdraw",
      amount_eth: Number(amountEth),
      status: "completed",
    });

    await createTransactionNotification({
      userId: card.user_id,
      title: "🏧 Card Withdraw",
      message: `Withdraw completed from your ${card.card_type} card.

Amount: ${amountEth} ETH
Remaining Balance: ${newBalance} ETH
Status: completed`,
    });

    return NextResponse.json({ success: true, balance: newBalance });
  } catch {
    return NextResponse.json({ error: "Withdraw save failed." }, { status: 500 });
  }
}