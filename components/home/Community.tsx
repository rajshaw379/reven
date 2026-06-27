export default function Community() {
  const socials = [
    {
      name: "X",
      url: "https://x.com/YOUR_X_USERNAME",
    },
    {
      name: "Telegram",
      url: "https://t.me/YOUR_TELEGRAM_BOT",
    },
    {
      name: "Farcaster",
      url: "https://warpcast.com/YOUR_FARCASTER_USERNAME",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-center">
      <h2 className="text-3xl font-bold md:text-5xl">
        Join the Reven community
      </h2>

      <div className="mt-10 flex justify-center gap-5">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-400 hover:text-black"
          >
            {social.name}
          </a>
        ))}
      </div>
    </section>
  );
}