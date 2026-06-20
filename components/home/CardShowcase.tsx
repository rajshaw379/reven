const cards = [
  ["Virtual Card", "0.0005 ETH", "1000 supply", "Active instantly after mint."],
  ["Physical Card", "0.001 ETH", "700 supply", "Premium card variant."],
  ["Free Card", "Free Mint", "300 supply", "Locked until first reload."],
];

export default function CardShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-3xl font-bold md:text-5xl">Choose your Reven Card</h2>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {cards.map(([title, price, supply, desc]) => (
          <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-8 h-48 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-emerald-950 to-black p-5">
              <p className="text-sm text-zinc-400">REVEN</p>
              <p className="mt-16 text-2xl font-bold">{title}</p>
              <p className="mt-2 text-sm text-emerald-300">{supply}</p>
            </div>
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p className="mt-2 text-emerald-300">{price}</p>
            <p className="mt-3 text-sm text-zinc-400">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}