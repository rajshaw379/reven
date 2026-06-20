"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

interface Props {
  cardType: string;
  cardName: string;
}

export default function MintButton({ cardType, cardName }: Props) {
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

  async function mintCard() {
    const stored = localStorage.getItem("reven_user");

    if (!stored) {
      window.location.href = "/login";
      return;
    }

    if (!isConnected || !address) {
      alert("Please connect your wallet before minting.");
      return;
    }

    const user = JSON.parse(stored);

    setLoading(true);

    const res = await fetch("/api/cards/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        cardType,
        walletAddress: address,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Mint failed.");
      return;
    }

    alert(`${cardName} minted successfully!`);
    window.location.href = "/cards";
  }

  return (
    <button
      onClick={mintCard}
      disabled={loading}
      className="mt-8 w-full rounded-full bg-emerald-400 px-6 py-4 font-semibold text-black hover:bg-emerald-300 disabled:opacity-50"
    >
      {loading ? "Minting..." : `Mint ${cardName}`}
    </button>
  );
}