const roadmap = [
  ["Phase 1", "Website", "Active"],
  ["Phase 2", "NFT Contracts", "Next"],
  ["Phase 3", "Telegram Bots", "Next"],
  ["Phase 4", "Mainnet Ready", "Locked"],
];

export default function Roadmap() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-3xl font-bold md:text-5xl">Roadmap</h2>

      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {roadmap.map(([phase, title, status]) => (
          <div key={title} className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-sm text-emerald-300">{phase}</p>
            <h3 className="mt-3 text-xl font-semibold">{title}</h3>
            <p className="mt-4 text-sm text-zinc-400">{status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}