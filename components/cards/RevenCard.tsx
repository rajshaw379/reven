export default function RevenCard({ card }: { card: any }) {
  const locked = card.status === "locked";

  const theme =
    card.card_type === "physical"
      ? "from-zinc-950 via-zinc-900 to-black border-zinc-700/60"
      : card.card_type === "free"
      ? "from-slate-950 via-blue-950 to-black border-blue-800/60"
      : "from-zinc-950 via-emerald-950 to-black border-emerald-800/60";

  const cardNumber = card.card_number
    ? `${card.card_number.slice(0, 4)} ${card.card_number.slice(
        4,
        8
      )} ${card.card_number.slice(8, 12)} ${card.card_number.slice(12)}`
    : "**** **** **** ****";

  return (
    <div
      className={`relative h-72 overflow-hidden rounded-3xl border bg-gradient-to-br ${theme} p-6 shadow-2xl`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

      {locked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
          <span className="rounded-full border border-red-400/40 bg-red-500/20 px-6 py-2 text-sm font-bold tracking-wide text-red-300">
            🔒 LOCKED
          </span>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-lg font-bold tracking-widest">REVEN</span>

        <span className="text-3xl font-light tracking-[-0.2em] text-white/80">
          )))
        </span>
      </div>

      <div className="relative z-10 mt-8 h-11 w-14 rounded-lg bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-800 shadow-lg">
        <div className="absolute left-1/2 top-0 h-full w-px bg-yellow-900/40" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-yellow-900/40" />
        <div className="absolute inset-2 rounded border border-yellow-900/40" />
      </div>

      <p className="relative z-10 mt-8 text-lg tracking-[0.22em] text-white">
        {cardNumber}
      </p>

      <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between">
        <div className="flex gap-8">
          <div>
            <p className="text-xs uppercase text-zinc-400">Card Holder</p>
            <p className="mt-1 font-semibold uppercase">
              {card.card_holder_name || "Card Holder"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-zinc-400">Expires</p>
            <p className="mt-1 font-semibold">{card.expiry_date || "--/--"}</p>
          </div>
        </div>

        <span className="text-3xl font-black italic tracking-tight text-white">
          VISA
        </span>
      </div>
    </div>
  );
}