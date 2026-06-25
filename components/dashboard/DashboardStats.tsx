"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatEther } from "viem";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/GlassCard";
import {
  REVEN_VAULT_ABI,
  REVEN_VAULT_ADDRESS,
} from "@/lib/contract/revenVault";

export default function DashboardStats() {
  const [count, setCount] = useState(0);
  const [savedWallet, setSavedWallet] = useState<string | null>(null);
  const [totalEth, setTotalEth] = useState("0.0000");
  const [totalUsd, setTotalUsd] = useState("0.00");

  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  useEffect(() => {
    async function load() {
      const stored = localStorage.getItem("reven_user");
      if (!stored || !publicClient) return;

      const user = JSON.parse(stored);

      const { data: cards, count } = await supabase
        .from("cards")
        .select("token_id", { count: "exact" })
        .eq("user_id", user.id);

      setCount(count || 0);

      const { data: wallet } = await supabase
        .from("wallets")
        .select("wallet_address")
        .eq("user_id", user.id)
        .maybeSingle();

      setSavedWallet(wallet?.wallet_address ?? null);

      let totalWei = BigInt(0);

      for (const card of cards || []) {
        if (!card.token_id) continue;

        const balance = await publicClient.readContract({
          address: REVEN_VAULT_ADDRESS as `0x${string}`,
          abi: REVEN_VAULT_ABI,
          functionName: "balanceOfCard",
          args: [BigInt(card.token_id)],
        });

        totalWei += balance as bigint;
      }

      const eth = Number(formatEther(totalWei));
      setTotalEth(eth.toFixed(4));

      const priceRes = await fetch("/api/eth-price");
      const priceData = await priceRes.json();

      const usd = eth * Number(priceData.usd || 0);
      setTotalUsd(usd.toFixed(2));
    }

    load();
  }, [publicClient]);

  const connectedWallet = savedWallet || (isConnected ? address : null);

  return (
    <>
      <GlassCard className="p-6">
        <p className="text-sm text-zinc-500">Wallet</p>
        <p className="mt-3 text-2xl font-bold">
          {connectedWallet ? "Connected" : "Not Connected"}
        </p>

        {connectedWallet && (
          <p className="mt-2 truncate text-xs text-zinc-500">
            {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
          </p>
        )}
      </GlassCard>

      <GlassCard className="p-6">
        <p className="text-sm text-zinc-500">Telegram</p>
        <p className="mt-3 text-2xl font-bold">Verified</p>
      </GlassCard>

      <GlassCard className="p-6">
        <p className="text-sm text-zinc-500">NFT Cards</p>
        <p className="mt-3 text-2xl font-bold">{count}</p>
      </GlassCard>

      <GlassCard className="p-6">
        <p className="text-sm text-zinc-500">Total Balance</p>
        <p className="mt-3 text-2xl font-bold">{totalEth} ETH</p>
        <p className="mt-2 text-sm text-zinc-500">≈ ${totalUsd}</p>
      </GlassCard>
    </>
  );
}