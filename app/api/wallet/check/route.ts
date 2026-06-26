import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { userId, walletAddress } = await req.json();

    if (!userId || !walletAddress) {
      return NextResponse.json(
        { error: "Missing wallet data." },
        { status: 400 }
      );
    }

    const wallet = walletAddress.toLowerCase();

    const { data: userWallet } = await supabaseAdmin
      .from("wallets")
      .select("wallet_address")
      .eq("user_id", userId)
      .eq("is_primary", true)
      .maybeSingle();

    if (userWallet) {
      if (userWallet.wallet_address.toLowerCase() !== wallet) {
        return NextResponse.json(
          {
            error: `This account is linked to ${userWallet.wallet_address.slice(
              0,
              6
            )}...${userWallet.wallet_address.slice(-4)}. Please connect that wallet.`,
          },
          { status: 403 }
        );
      }

      return NextResponse.json({ success: true, mode: "matched" });
    }

    const { data: existingWallet } = await supabaseAdmin
      .from("wallets")
      .select("user_id")
      .ilike("wallet_address", walletAddress)
      .maybeSingle();

    if (existingWallet) {
      return NextResponse.json(
        { error: "This wallet is already linked to another Reven account." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, mode: "new" });
  } catch {
    return NextResponse.json(
      { error: "Wallet check failed." },
      { status: 500 }
    );
  }
}