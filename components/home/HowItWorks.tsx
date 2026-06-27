const steps = ["Sign Up", "Verify Telegram", "Purchase Card", "Spend In Crypto"];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-3xl font-bold md:text-5xl">How Reven works</h2>

      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step} className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 font-bold text-black">
              {index + 1}
            </div>
            <h3 className="text-xl font-semibold">{step}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}