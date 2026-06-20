"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import CardItem from "@/components/cards/CardItem";

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
  <CardItem key={card.id} card={card} />
))}
    </div>
  );
}