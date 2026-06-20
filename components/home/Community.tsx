export default function Community() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-center">
      <h2 className="text-3xl font-bold md:text-5xl">Join the Reven community</h2>

      <div className="mt-10 flex justify-center gap-5">
        {["X", "Telegram", "Farcaster"].map((item) => (
          <a
            key={item}
            href="#"
            className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-400 hover:text-black"
          >
            {item}
          </a>
        ))}
      </div>
    </section>
  );
}