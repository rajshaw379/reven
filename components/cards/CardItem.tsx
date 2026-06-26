import GlassCard from "@/components/ui/GlassCard";
import RevenCard from "@/components/cards/RevenCard";
import CardBalance from "@/components/cards/CardBalance";
import ReloadButton from "@/components/cards/ReloadButton";
import WithdrawButton from "@/components/cards/WithdrawButton";

export default function CardItem({ card }: { card: any }) {
  return (
    
    <a href={`/cards/${card.token_id}`} className="block">
  <GlassCard className="overflow-hidden p-0 transition hover:border-emerald-400/40 hover:bg-white/[0.06]">
      <RevenCard
  card={{
    ...card,
    card_number:
      card.card_type === "free" && card.status === "locked"
        ? ""
        : card.card_number,
    cvv:
      card.card_type === "free" && card.status === "locked"
        ? ""
        : card.cvv,
    expiry_date:
      card.card_type === "free" && card.status === "locked"
        ? "--/--"
        : card.expiry_date,
  }}
/>

      <div className="space-y-4 p-6">
        <div className="flex justify-between">
          <span className="text-zinc-500">Card Type</span>
          <span className="capitalize">{card.card_type}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-500">Status</span>
          <span className="text-emerald-300 capitalize">
            {card.status}
          </span>
        </div>

        <div className="flex justify-between">
  <span className="text-zinc-500">CVV</span>
  <span>
    {card.card_type === "free" && card.status === "locked"
      ? "Reload first"
      : card.cvv}
  </span>
</div>

        <div className="flex justify-between">
          <span className="text-zinc-500">Balance</span>
          <CardBalance tokenId={Number(card.token_id)} />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3">
  <ReloadButton tokenId={Number(card.token_id)} />

  {card.card_type === "free" && card.status === "locked" ? (
    <button
      disabled
      className="rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-500 opacity-60"
    >
      Locked
    </button>
  ) : (
    <WithdrawButton tokenId={Number(card.token_id)} />
  )}
</div>
      </div>
    </GlassCard>
</a>
  );
}