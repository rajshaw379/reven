"use client";

import { useState } from "react";
import { useWalletClient } from "wagmi";
import { reloadCard } from "@/lib/contract/vault";
import ReloadModal from "@/components/cards/ReloadModal";

export default function ReloadButton({
  tokenId,
  cardId,
}: {
  tokenId: number;
  cardId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const { data: walletClient } = useWalletClient();

  async function handleReload() {
    if (!walletClient) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid ETH amount.");
      return;
    }

    try {
      setLoading(true);

      const receipt = await reloadCard(walletClient, tokenId, amount);

      const res = await fetch("/api/cards/reload", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  tokenId,
  cardId,
  amountEth: amount,
  txHash: receipt.hash,
}),
});

const data = await res.json();

if (!res.ok) {
  alert(data.error || "Reload transaction succeeded, but database update failed.");
  return;
}

alert("Reload successful!");
window.location.reload();
    } catch (error: any) {
      alert(error?.shortMessage || error?.message || "Reload failed.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className="rounded-full bg-emerald-400 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-300 disabled:opacity-50"
      >
        {loading ? "Reloading..." : "Reload"}
      </button>

      {open && (
        <ReloadModal
          amount={amount}
          setAmount={setAmount}
          onClose={() => setOpen(false)}
          onConfirm={handleReload}
          loading={loading}
        />
      )}
    </>
  );
}