"use client";

import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { BrowserProvider, Contract, parseEther } from "ethers";
import {
  REVEN_CARD_ABI,
  REVEN_CARD_ADDRESS,
} from "@/lib/contract/revenCard";

interface Props {
  cardType: string;
  cardName: string;
}

const cardTypeMap: Record<string, number> = {
  virtual: 0,
  physical: 1,
  free: 2,
};

const priceMap: Record<string, string> = {
  virtual: "0.0005",
  physical: "0.001",
  free: "0",
};

export default function MintButton({ cardType, cardName }: Props) {
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  async function mintCard() {
    const stored = localStorage.getItem("reven_user");

    if (!stored) {
      window.location.href = "/login";
      return;
    }

    if (!isConnected || !address || !walletClient) {
      alert("Please connect your wallet before minting.");
      return;
    }

    try {
      setLoading(true);

      const user = JSON.parse(stored);

      const provider = new BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner(address);

      const contract = new Contract(
        REVEN_CARD_ADDRESS,
        REVEN_CARD_ABI,
        signer
      );

      const tx = await contract.mint(cardTypeMap[cardType], {
        value: parseEther(priceMap[cardType]),
      });

      const receipt = await tx.wait();

      let tokenId = "";

      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed?.name === "CardMinted") {
            tokenId = parsed.args.tokenId.toString();
          }
        } catch {}
      }

      const res = await fetch("/api/cards/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          cardType,
          walletAddress: address,
          tokenId,
          txHash: tx.hash,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Database save failed.");
        return;
      }

      alert(`${cardName} minted successfully!`);
      window.location.href = "/cards";
    } catch (error: any) {
      alert(error?.shortMessage || error?.reason || error?.message || "Mint failed.");
    } finally {
      setLoading(false);
    }
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