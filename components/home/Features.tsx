const features = [
  ["Telegram Verification", "Secure signup and password reset using Reven Verify Bot."],
  ["Wallet Connection", "Connect your wallet with RainbowKit only when needed."],
  ["NFT Ownership", "Every card is backed by a Reven Card ERC-721 NFT."],
  ["On-chain Vault", "Reload and withdraw through the dashboard using Sepolia ETH."],
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-3xl font-bold md:text-5xl">Built for Web3 finance</h2>

      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {features.map(([title, desc]) => (
          <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-4 text-sm leading-6 text-zinc-400">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}