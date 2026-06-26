import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createTransactionNotification } from "@/lib/createTransactionNotification";

export async function POST(req: Request) {
  try {
    const { tokenId, cardId, amountEth } = await req.json();

    if (!tokenId || !amountEth || Number(amountEth) <= 0) {
      return NextResponse.json({ error: "Invalid reload data." }, { status: 400 });
    }

    let cardQuery = supabaseAdmin
  .from("cards")
  .select("id,user_id,card_type,status,token_id");

if (cardId) {
  cardQuery = cardQuery.eq("id", cardId);
} else {
  cardQuery = cardQuery.eq("token_id", Number(tokenId));
}

const { data: card, error: cardError } = await cardQuery.maybeSingle();

    if (cardError || !card) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }

    const { data: balance } = await supabaseAdmin
      .from("card_balances")
      .select("balance_eth")
      .eq("card_id", card.id)
      .maybeSingle();

    const newBalance = Number(balance?.balance_eth ?? 0) + Number(amountEth);

    const { error: balanceError } = await supabaseAdmin
  .from("card_balances")
  .upsert({
    card_id: card.id,
    balance_eth: newBalance,
    locked: false,
    updated_at: new Date().toISOString(),
  });

if (balanceError) {
  return NextResponse.json(
    { error: balanceError.message },
    { status: 500 }
  );
}

      if (card.card_type === "free" && card.status === "locked") {
  const { error: unlockError } = await supabaseAdmin
    .from("cards")
    .update({
      status: "active",
    })
    .eq("id", card.id);

  if (unlockError) {
    return NextResponse.json(
      { error: unlockError.message },
      { status: 500 }
    );
  }
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