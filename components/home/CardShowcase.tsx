const cards = [
  ["Virtual Card", "$10", "1000 supply", "Active instantly after mint."],
  ["Physical Card", "$60", "700 supply", "Premium card variant."],
  ["Free Card", "Free", "300 supply", "Locked until first reload."],
];

export default function CardShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16 lg:py-20">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        Choose your Reven Card
      </h2>

      <div className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-6 lg:mt-10 lg:max-w-none lg:grid-cols-3">
        {cards.map(([title, price, supply, desc]) => (
          <div
            key={title}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
          >
            <div className="mb-6 h-44 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-emerald-950 to-black p-5 sm:mb-8 sm:h-48">
              <p className="text-sm text-zinc-400">REVEN</p>
              <p className="mt-14 text-2xl font-bold sm:mt-16">{title}</p>
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
