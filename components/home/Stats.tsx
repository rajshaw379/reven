const stats = [
  ["2000", "Total Supply"],
  ["1000", "Virtual Cards"],
  ["700", "Physical Cards"],
  ["300", "Free Cards"],
];

export default function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:grid-cols-4">
        {stats.map(([number, label]) => (
          <div key={label} className="text-center">
            <p className="text-4xl font-bold text-emerald-300">{number}</p>
            <p className="mt-2 text-sm text-zinc-400">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}