"use client";

import { useState } from "react";
import { useWalletClient } from "wagmi";
import { withdrawFromCard } from "@/lib/contract/vault";
import WithdrawModal from "@/components/cards/WithdrawModal";

export default function WithdrawButton({ tokenId }: { tokenId: number }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const { data: walletClient } = useWalletClient();

  async function handleWithdraw() {
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

      const receipt = await withdrawFromCard(walletClient, tokenId, amount);
      await fetch("/api/cards/withdraw", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    tokenId,
    amountEth: amount,
    txHash: receipt.hash,
  }),
});

      alert("Withdraw successful!");
      window.location.reload();
    } catch (error: any) {
      alert(error?.shortMessage || error?.message || "Withdraw failed.");
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
        className="rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50"
      >
        {loading ? "Withdrawing..." : "Withdraw"}
      </button>

      {open && (
        <WithdrawModal
          amount={amount}
          setAmount={setAmount}
          onClose={() => setOpen(false)}
          onConfirm={handleWithdraw}
          loading={loading}
        />
      )}
    </>
  );
}