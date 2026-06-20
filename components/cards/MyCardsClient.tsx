"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

export default function MyCardsClient() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCards() {
      const stored = localStorage.getItem("reven_user");

      if (!stored) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(stored);
      console.log("Logged in user:", user);

      const { data } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        console.log("Cards returned:", data);

      setCards(data || []);
      setLoading(false);
    }

    loadCards();
  }, []);

  if (loading) {
    return (
      <p className="mt-12 text-zinc-400">
        Loading your cards...
      </p>
    );
  }

  if (cards.length === 0) {
    return (
      <p className="mt-12 text-zinc-400">
        You don't own any cards yet.
      </p>
    );
  }

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <GlassCard key={card.id} className="p-6">
          <div className="h-52 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-emerald-950 to-black p-5">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>REVEN</span>
              <span>#{card.token_id}</span>
            </div>

            <p className="mt-20 text-2xl font-bold capitalize">
              {card.card_type} Card
            </p>

            <p className="mt-2 text-sm text-emerald-300">
              NFT Card
            </p>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Status</span>
              <span className="text-emerald-300">{card.status}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">Wallet</span>
              <span>
                {card.wallet_address
                  ? `${card.wallet_address.slice(0, 6)}...${card.wallet_address.slice(-4)}`
                  : "Not Connected"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">Activation</span>
              <span>{card.activation_code}</span>
            </div>
          </div>

          <Button href="/dashboard" className="mt-8 w-full">
            Manage Card
          </Button>
        </GlassCard>
      ))}
    </div>
  );
}