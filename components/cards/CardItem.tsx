import GlassCard from "@/components/ui/GlassCard";
import CardBalance from "@/components/cards/CardBalance";
import ReloadButton from "@/components/cards/ReloadButton";
import WithdrawButton from "@/components/cards/WithdrawButton";

export default function CardItem({ card }: { card: any }) {
  return (
    <GlassCard className="overflow-hidden p-0">
      {/* Card */}
      <div className="relative h-56 rounded-t-3xl bg-gradient-to-br from-zinc-900 via-emerald-950 to-black p-6 text-white">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-widest">REVEN</span>

          <span className="text-xl font-extrabold italic tracking-wider">
            VISA
          </span>
        </div>

        <div className="mt-12 text-xl tracking-[0.25em]">
          {card.card_number
            ? `${card.card_number.slice(0, 4)} ${card.card_number.slice(
                4,
                8
              )} ${card.card_number.slice(8, 12)} ${card.card_number.slice(
                12
              )}`
            : "**** **** **** ****"}
        </div>

        <div className="mt-6 flex justify-between">
          <div>
            <p className="text-xs uppercase text-zinc-400">Card Holder</p>

            <p className="font-semibold">
              {card.card_holder_name || "Card Holder"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase text-zinc-400">Expiry</p>

            <p>{card.expiry_date || "--/--"}</p>
          </div>
        </div>
      </div>

      {/* Details */}
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

        <div className="flex justify-between">
          <span className="text-zinc-500">Locked</span>

          <span>
            {card.status === "locked" ? "🔒 Yes" : "🟢 No"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3">
          <ReloadButton tokenId={Number(card.token_id)} />

          <WithdrawButton tokenId={Number(card.token_id)} />
        </div>
      </div>
    </GlassCard>
  );
}