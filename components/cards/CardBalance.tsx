"use client";

import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { getCardBalance } from "@/lib/contract/vault";

export default function CardBalance({ tokenId }: { tokenId: number }) {
  const [balance, setBalance] = useState("0.0000");
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    async function loadBalance() {
      if (!walletClient || !tokenId) return;

      const value = await getCardBalance(walletClient, tokenId);
      setBalance(Number(value).toFixed(4));
    }

    loadBalance();
  }, [walletClient, tokenId]);

  return <span>{balance} ETH</span>;
}