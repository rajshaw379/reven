export default function RevenCard({ card }: { card: any }) {
  const locked = card.status === "locked";

  const theme =
    card.card_type === "physical"
      ? "from-zinc-950 via-zinc-900 to-black border-zinc-700/60"
      : card.card_type === "free"
      ? "from-slate-950 via-blue-950 to-black border-blue-800/60"
      : "from-zinc-950 via-emerald-950 to-black border-emerald-800/60";

  const number = String(card.card_number || "");
  const masked =
    number.length >= 16
      ? `•••• •••• •••• ${number.slice(-4)}`
      : "•••• •••• •••• ----";

  return (
    <div
      className={`relative mx-auto aspect-[1.42/1] sm:aspect-[1.586/1] w-full max-w-[420px] overflow-hidden rounded-3xl border bg-gradient-to-br ${theme} shadow-2xl`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-8 right-8 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

      {locked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-sm">
          <span className="rounded-full border border-red-400/40 bg-red-500/20 px-5 py-2 text-sm font-bold text-red-300">
            🔒 LOCKED
          </span>
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <span className="text-sm font-bold tracking-[0.28em] sm:text-lg">
            REVEN
          </span>

          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-sm font-bold text-white/80">
  R
</span>
        </div>

        <div>
          <div className="h-8 w-11 rounded-lg bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-800 shadow-lg sm:h-10 sm:w-14">
            <div className="relative h-full w-full">
              <div className="absolute left-1/2 top-0 h-full w-px bg-yellow-900/40" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-yellow-900/40" />
              <div className="absolute inset-2 rounded border border-yellow-900/40" />
            </div>
          </div>

          <p className="mt-5 whitespace-nowrap text-[12px] font-medium tracking-[0.13em] text-white sm:mt-7 sm:text-base sm:tracking-[0.24em]">
            {masked}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 gap-5 sm:gap-6">
            <div className="min-w-0">
              <p className="text-[8px] uppercase tracking-wider text-zinc-400 sm:text-[10px]">
                Card Holder
              </p>
              <p className="mt-1 max-w-[110px] truncate text-[11px] font-semibold uppercase sm:max-w-[140px] sm:text-sm">
                {card.card_holder_name || "YOUR NAME"}
              </p>
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-wider text-zinc-400 sm:text-[10px]">
                Expires
              </p>
              <p className="mt-1 text-[11px] font-semibold sm:text-sm">
                {card.expiry_date || "--/--"}
              </p>
            </div>
          </div>

          <span className="shrink-0 text-xl font-black italic tracking-tight sm:text-3xl">
            VISA
          </span>
        </div>
      </div>
    </div>
  );
}