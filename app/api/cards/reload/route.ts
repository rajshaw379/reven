import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createTransactionNotification } from "@/lib/createTransactionNotification";

export async function POST(req: Request) {
  try {
    const { tokenId, amountEth } = await req.json();

    if (!tokenId || !amountEth || Number(amountEth) <= 0) {
      return NextResponse.json({ error: "Invalid reload data." }, { status: 400 });
    }

    const { data: card, error: cardError } = await supabaseAdmin
      .from("cards")
      .select("id,user_id,card_type,status")
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

    const newBalance = Number(balance?.balance_eth ?? 0) + Number(amountEth);

    await supabaseAdmin
      .from("card_balances")
      .upsert({
        card_id: card.id,
        balance_eth: newBalance,
        locked: false,
        updated_at: new Date().toISOString(),
      });

      if (card.card_type === "free" && card.status === "locked") {
  await supabaseAdmin
    .from("cards")
    .update({
      status: "active",
      activation_used: true,
    })
    .eq("id", card.id);
}

    await supabaseAdmin.from("transactions").insert({
      card_id: card.id,
      transaction_type: "reload",
      amount_eth: Number(amountEth),
      status: "completed",
    });

    await createTransactionNotification({
      userId: card.user_id,
      title: "💰 Card Reloaded",
      message: `Your ${card.card_type} card was reloaded successfully.

Amount: ${amountEth} ETH
New Balance: ${newBalance} ETH
Status: completed`,
    });

    return NextResponse.json({ success: true, balance: newBalance });
  } catch {
    return NextResponse.json({ error: "Reload save failed." }, { status: 500 });
  }
}