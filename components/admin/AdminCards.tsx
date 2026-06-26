"use client";

import { useEffect, useMemo, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

export default function AdminCards() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadCards() {
      const res = await fetch("/api/admin/cards");
      const data = await res.json();
      setCards(data.cards || []);
      setLoading(false);
    }

    loadCards();
  }, []);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const text = `${card.token_id} ${card.card_holder_name} ${card.wallet_address} ${card.users?.username} ${card.users?.full_name}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || card.card_type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || card.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [cards, search, typeFilter, statusFilter]);

  const total = cards.length;
  const active = cards.filter((c) => c.status === "active").length;
  const locked = cards.filter((c) => c.status === "locked").length;
  const suspended = cards.filter((c) => c.status === "suspended").length;

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <Stat title="Total Cards" value={total} />
        <Stat title="Active" value={active} />
        <Stat title="Locked" value={locked} />
        <Stat title="Suspended" value={suspended} />
      </div>

      <GlassCard className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search token, holder, wallet, user..."
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400 md:col-span-1"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          >
            <option value="all">All Types</option>
            <option value="virtual">Virtual</option>
            <option value="physical">Physical</option>
            <option value="free">Free</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="locked">Locked</option>
            <option value="suspended">Suspended</option>
            <option value="frozen">Frozen</option>
          </select>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="border-b border-white/10 p-6">
          <h2 className="text-2xl font-bold">All Cards</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Showing {filteredCards.length} of {cards.length}
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-zinc-400">Loading cards...</div>
        ) : filteredCards.length === 0 ? (
          <div className="p-6 text-zinc-400">No cards found.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredCards.map((card) => {
              const balance = card.card_balances?.[0];

              return (
                <div
                  key={card.id}
                  className="grid gap-5 p-5 lg:grid-cols-[120px_1.2fr_1fr_1fr_1fr_1fr]"
                >
                  <div>
                    <p className="text-sm text-zinc-500">Token</p>
                    <p className="mt-1 font-bold">#{card.token_id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500">Holder</p>
                    <p className="mt-1 font-semibold">
                      {card.card_holder_name || "Card Holder"}
                    </p>
                    <p className="text-sm text-zinc-500">
                      **** **** **** {card.card_number?.slice(-4) || "----"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500">User</p>
                    <p className="mt-1">
                      {card.users?.full_name || "Unknown"}
                    </p>
                    <p className="text-sm text-zinc-500">
                      @{card.users?.username || "unknown"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500">Wallet</p>
                    <p className="mt-1 break-all text-sm">
                      {card.wallet_address
                        ? `${card.wallet_address.slice(0, 6)}...${card.wallet_address.slice(-4)}`
                        : "Not connected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500">Type / Balance</p>
                    <p className="mt-1 capitalize">{card.card_type}</p>
                    <p className="text-sm text-emerald-300">
                      {balance?.balance_eth ?? "0"} ETH
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500">Status</p>
                    <span className="mt-2 inline-flex rounded-full border border-emerald-400/30 px-3 py-1 text-xs capitalize text-emerald-300">
                      {card.status}
                    </span>

                    <a
                      href={`/cards/${card.token_id}`}
                      target="_blank"
                      className="mt-3 block text-sm text-emerald-300 hover:underline"
                    >
                      Open Card
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <GlassCard className="p-6">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </GlassCard>
  );
}