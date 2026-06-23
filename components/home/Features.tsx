const features = [
  ["Telegram Verification", "Secure signup and password reset using Reven Verify Bot."],
  ["Wallet Connection", "Connect your wallet with RainbowKit only when needed."],
  ["NFT Ownership", "Every card is backed by a Reven Card ERC-721 NFT."],
  ["On-chain Vault", "Reload and withdraw through the dashboard using Sepolia ETH."],
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16 lg:py-20">
      <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        Built for Web3 finance
      </h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-6">
        {features.map(([title, desc]) => (
          <div
            key={title}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
          >
            <h3 className="text-lg font-semibold sm:text-xl">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:mt-4">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
