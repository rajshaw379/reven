import GlassCard from "@/components/ui/GlassCard";
import RevenCard from "@/components/cards/RevenCard";
import CardBalance from "@/components/cards/CardBalance";
import ReloadButton from "@/components/cards/ReloadButton";
import WithdrawButton from "@/components/cards/WithdrawButton";

export default function CardItem({ card }: { card: any }) {
  return (
    
    <a href={`/cards/${card.token_id}`} className="block">
  <GlassCard className="overflow-hidden p-0 transition hover:border-emerald-400/40 hover:bg-white/[0.06]">
      <RevenCard card={card} />

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
          <span>{card.cvv}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-500">Balance</span>
          <CardBalance tokenId={Number(card.token_id)} />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3">
          <ReloadButton tokenId={Number(card.token_id)} />
          <WithdrawButton tokenId={Number(card.token_id)} />
        </div>
      </div>
    </GlassCard>
</a>
  );
}