"use client";

import { useState } from "react";
import { useWalletClient } from "wagmi";
import { reloadCard } from "@/lib/contract/vault";

export default function ReloadButton({ tokenId }: { tokenId: number }) {
  const [loading, setLoading] = useState(false);
  const { data: walletClient } = useWalletClient();

  async function handleReload() {
    if (!walletClient) {
      alert("Please connect your wallet first.");
      return;
    }

    const amount = prompt("Enter ETH amount to reload:");

    if (!amount) return;

    try {
      setLoading(true);
      await reloadCard(walletClient, tokenId, amount);
      await fetch("/api/cards/activate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    tokenId,
  }),
});
      alert("Reload successful!");
      window.location.reload();
    } catch (error: any) {
      alert(error?.shortMessage || error?.message || "Reload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleReload}
      disabled={loading}
      className="rounded-full bg-emerald-400 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-300 disabled:opacity-50"
    >
      {loading ? "Reloading..." : "Reload"}
    </button>
  );
}