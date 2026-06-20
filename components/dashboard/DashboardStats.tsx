"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/GlassCard";

export default function DashboardStats() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function load() {
      const stored = localStorage.getItem("reven_user");

      if (!stored) return;

      const user = JSON.parse(stored);

      const { count } = await supabase
        .from("cards")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

      setCount(count || 0);
    }

    load();
  }, []);

  return (
    <>
      <GlassCard className="p-6">
        <p className="text-sm text-zinc-500">Wallet</p>
        <p className="mt-3 text-2xl font-bold">Connected</p>
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
        <p className="mt-3 text-2xl font-bold">0.0000 ETH</p>
      </GlassCard>
    </>
  );
}