"use client";

import { useState } from "react";
import { useWalletClient } from "wagmi";
import { withdrawFromCard } from "@/lib/contract/vault";

export default function WithdrawButton({ tokenId }: { tokenId: number }) {
  const [loading, setLoading] = useState(false);
  const { data: walletClient } = useWalletClient();

  async function handleWithdraw() {
    if (!walletClient) {
      alert("Please connect your wallet first.");
      return;
    }

    const amount = prompt("Enter ETH amount to withdraw:");

    if (!amount) return;

    try {
      setLoading(true);
      await withdrawFromCard(walletClient, tokenId, amount);
      alert("Withdraw successful!");
      window.location.reload();
    } catch (error: any) {
      alert(error?.shortMessage || error?.message || "Withdraw failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleWithdraw}
      disabled={loading}
      className="rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50"
    >
      {loading ? "Withdrawing..." : "Withdraw"}
    </button>
  );
}