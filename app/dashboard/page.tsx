"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import WelcomeUser from "@/components/dashboard/WelcomeUser";
import RequireLogin from "@/components/auth/RequireLogin";
import LogoutButton from "@/components/auth/LogoutButton";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RevenCard from "@/components/cards/RevenCard";

export default function DashboardPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const storedUser = localStorage.getItem("reven_user");

      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      const res = await fetch(`/api/dashboard?userId=${user.id}`);
      const data = await res.json();

      setCards(data.cards || []);
      setTransactions(data.transactions || []);
      setLoading(false);
    }

    loadDashboard();
  }, []);

  return (
    <RequireLogin>
      <main className="min-h-screen bg-black py-24 text-white">
        <Container>
          <a href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Back to Home
          </a>

          <div className="mt-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Dashboard
              </p>
              <WelcomeUser />
              <p className="mt-4 text-zinc-400">
                Manage your Reven cards, balances, reloads, and withdrawals.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <WalletConnectButton />
              <Button href="/marketplace">Get New Card</Button>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <DashboardStats />
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-bold">My Cards</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {loading ? (
                <p className="text-zinc-400">Loading cards...</p>
              ) : cards.length === 0 ? (
                <p className="text-zinc-400">You don't have any cards yet.</p>
              ) : (
                cards.map((card: any) => (
  <a key={card.id} href={`/cards/${card.token_id}`} className="block">
  <GlassCard className="overflow-hidden p-0 transition hover:border-emerald-400/40 hover:bg-white/[0.06]">
    <RevenCard card={card} />

    <div className="p-6">
      <div className="flex justify-between">
        <span className="text-zinc-500">Status</span>
        <span className="capitalize text-emerald-300">{card.status}</span>
      </div>

      <p className="mt-4 text-sm text-zinc-500">
        Click to manage reload and withdraw.
      </p>
    </div>
  </GlassCard>
</a>
              ))
            )}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold">Recent Activity</h2>

            <GlassCard className="mt-6 overflow-hidden">
              {transactions.length === 0 ? (
                <div className="p-6 text-zinc-400">No transactions yet.</div>
              ) : (
                transactions.map((tx: any) => (
                  <div
                    key={tx.id}
                    className="flex flex-col justify-between gap-2 border-b border-white/10 p-5 last:border-b-0 md:flex-row"
                  >
                    <div>
                      <p className="font-semibold capitalize">
                        {tx.transaction_type}
                      </p>

                      <p className="text-sm text-zinc-400">
                        {tx.amount_eth} ETH
                      </p>
                    </div>

                    <p
                      className={`text-sm ${
                        tx.status === "completed"
                          ? "text-emerald-300"
                          : "text-yellow-400"
                      }`}
                    >
                      {tx.status}
                    </p>
                  </div>
                ))
              )}
            </GlassCard>
          </section>
        </Container>
      </main>
    </RequireLogin>
  );
}