"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";
import RevenCard from "@/components/cards/RevenCard";
import CardBalance from "@/components/cards/CardBalance";
import ReloadButton from "@/components/cards/ReloadButton";
import WithdrawButton from "@/components/cards/WithdrawButton";
import { supabase } from "@/lib/supabase";

export default function CardDetailsClient({ tokenId }: { tokenId: string }) {
  const [card, setCard] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [shipping, setShipping] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCard() {
      const stored = localStorage.getItem("reven_user");

      if (!stored) {
        window.location.href = "/login";
        return;
      }

      const user = JSON.parse(stored);

      const { data: cardData } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .eq("token_id", Number(tokenId))
        .maybeSingle();

      if (!cardData) {
        setLoading(false);
        return;
      }

      const { data: balanceData } = await supabase
  .from("card_balances")
  .select("balance_eth, locked")
  .eq("card_id", cardData.id)
  .maybeSingle();

const lockedFreeCard =
  cardData.card_type === "free" && cardData.status === "locked";

setCard({
  ...cardData,
  lockedFreeCard,
});

      const txRes = await fetch("/api/cards/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    cardId: cardData.id,
  }),
});

const txData = await txRes.json();

setTransactions(txData.transactions || []);

      if (cardData.card_type === "physical") {
        const { data: shippingData } = await supabase
          .from("physical_card_orders")
          .select("*")
          .eq("card_id", cardData.id)
          .maybeSingle();

        setShipping(shippingData);
      }

      setLoading(false);
    }

    loadCard();
  }, [tokenId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black py-24 text-white">
        <Container>
          <p className="text-zinc-400">Loading card...</p>
        </Container>
      </main>
    );
  }

  if (!card) {
    return (
      <main className="min-h-screen bg-black py-24 text-white">
        <Container>
          <a href="/cards" className="text-sm text-zinc-400 hover:text-white">
            ← Back to My Cards
          </a>
          <p className="mt-10 text-zinc-400">Card not found.</p>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black py-24 text-white">
      <Container>
        <a href="/cards" className="text-sm text-zinc-400 hover:text-white">
          ← Back to My Cards
        </a>

        <div className="mt-10 grid gap-8 lg:grid-cols-[420px_1fr]">
          <div>
            <RevenCard
  card={{
    ...card,
    card_number: card.lockedFreeCard ? "" : card.card_number,
    cvv: card.lockedFreeCard ? "" : card.cvv,
    expiry_date: card.lockedFreeCard ? "--/--" : card.expiry_date,
  }}
/>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <ReloadButton tokenId={Number(card.token_id)} cardId={card.id} />
              <WithdrawButton tokenId={Number(card.token_id)} cardId={card.id} />
            </div>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <h1 className="text-3xl font-bold capitalize">
                {card.card_type} Card
              </h1>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-zinc-500">Balance</p>
                  <p className="mt-2 text-2xl font-bold">
                    <CardBalance tokenId={Number(card.token_id)} />
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Status</p>
                  <p className="mt-2 text-2xl font-bold capitalize">
                    {card.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Card Number</p>
                  <p className="mt-2 break-all">
  {card.lockedFreeCard ? "Reload first to unlock" : card.card_number}
</p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">CVV</p>
                  <p className="mt-2">
  {card.lockedFreeCard ? "Reload first" : card.cvv}
</p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Expiry</p>
                  <p className="mt-2">
  {card.lockedFreeCard ? "--/--" : card.expiry_date}
</p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Token ID</p>
                  <p className="mt-2">#{card.token_id}</p>
                </div>
              </div>
            </GlassCard>

            {card.card_type === "physical" && (
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold">Shipping</h2>

                {!shipping ? (
                  <p className="mt-4 text-zinc-400">
                    Shipping order not created yet.
                  </p>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-zinc-500">Shipping Status</p>
                      <p className="mt-2 text-xl font-bold capitalize text-emerald-300">
                        {shipping.shipping_status || "preparing"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">Receiver</p>
                      <p className="mt-2">{shipping.shipping_name}</p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-sm text-zinc-500">Address</p>
                      <p className="mt-2 text-zinc-300">
                        {shipping.shipping_address}
                        <br />
                        {shipping.shipping_city}, {shipping.shipping_state}
                        <br />
                        {shipping.shipping_country}{" "}
                        {shipping.shipping_postal_code}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">Carrier</p>
                      <p className="mt-2">{shipping.carrier || "Not assigned"}</p>
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">Tracking Number</p>
                      <p className="mt-2">
                        {shipping.tracking_number || "Not available"}
                      </p>
                    </div>
                  </div>
                )}
              </GlassCard>
            )}

            <GlassCard className="overflow-hidden">
              <div className="border-b border-white/10 p-6">
                <h2 className="text-2xl font-bold">Recent Transactions</h2>
              </div>

              {transactions.length === 0 ? (
                <div className="p-6 text-zinc-400">No transactions yet.</div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between border-b border-white/10 p-5 last:border-b-0"
                  >
                    <div>
                      <p className="font-semibold capitalize">
                        {tx.transaction_type}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p>{tx.amount_eth ?? 0} ETH</p>
                      <p className="text-sm text-emerald-300">{tx.status}</p>
                    </div>
                  </div>
                ))
              )}
            </GlassCard>
          </div>
        </div>
      </Container>
    </main>
  );
}