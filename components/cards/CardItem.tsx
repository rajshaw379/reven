import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import CardBalance from "@/components/cards/CardBalance";

export default function CardItem({ card }: { card: any }) {
  return (
    <GlassCard className="p-6">
      <div className="h-52 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-emerald-950 to-black p-5">
        <div className="flex justify-between text-sm text-zinc-400">
          <span>REVEN</span>
          <span>#{card.token_id}</span>
        </div>

        <p className="mt-20 text-2xl font-bold capitalize">
          {card.card_type} Card
        </p>

        <p className="mt-2 text-sm text-emerald-300">NFT Card</p>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-500">Status</span>
          <span className="text-emerald-300">{card.status}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-500">Balance</span>
          <CardBalance tokenId={Number(card.token_id)} />
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-500">Wallet</span>
          <span>
            {card.wallet_address
              ? `${card.wallet_address.slice(0, 6)}...${card.wallet_address.slice(-4)}`
              : "Not Connected"}
          </span>
        </div>
      </div>

      <Button href="/dashboard" className="mt-8 w-full">
        Manage Card
      </Button>
    </GlassCard>
  );
}