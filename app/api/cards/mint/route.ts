import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createTransactionNotification } from "@/lib/createTransactionNotification";

const CONTRACT_ADDRESS = "0x3e384fBB92bd1Ba071aEc712C268FbB513D47110";

export async function POST(req: Request) {
  try {
    const { userId, cardType, walletAddress, tokenId, txHash } =
      await req.json();

    if (!userId || !cardType || !walletAddress || !tokenId || !txHash) {
      return NextResponse.json(
        { error: "Missing required mint data." },
        { status: 400 }
      );
    }

    const activationCode = crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 12)
      .toUpperCase();

    const { data, error } = await supabaseAdmin
      .from("cards")
      .insert({
        user_id: userId,
        wallet_address: walletAddress,
        token_id: Number(tokenId),
        card_type: cardType,
        status: cardType === "free" ? "locked" : "active",
        activation_code: activationCode,
        activation_used: false,
        telegram_linked: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabaseAdmin.from("transactions").insert({
      card_id: data.id,
      transaction_type: "mint",
      amount_eth: 0,
      tx_hash: txHash,
      status: "completed",
    });

    await createTransactionNotification({
  userId,
  title: "🎉 Card Minted",
  message: `Your ${cardType} card has been minted successfully.

Wallet: ${walletAddress}

Transaction: ${txHash}`,
});

    const { data: existingWallet } = await supabaseAdmin
  .from("wallets")
  .select("id")
  .eq("user_id", userId)
  .eq("wallet_address", walletAddress)
  .maybeSingle();

if (!existingWallet) {
  await supabaseAdmin.from("wallets").insert({
    user_id: userId,
    wallet_address: walletAddress,
    is_primary: true,
  });
}

    return NextResponse.json({
      success: true,
      contractAddress: CONTRACT_ADDRESS,
      card: data,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Mint save failed." }, { status: 500 });
  }
}