export default function Hero() {
  return (
    <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 pb-20 pt-32 md:grid-cols-2">
      <div>
        <p className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
          Sepolia Testnet Crypto Card Ecosystem
        </p>

        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          The Future of
          <span className="block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            Crypto Cards
          </span>
          Starts Here
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400 md:text-xl">
          Mint NFT-backed crypto cards, manage balances on-chain, and receive
          secure Telegram notifications for every reload and withdrawal.
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <div className="absolute inset-0 rounded-[2rem] bg-emerald-400/20 blur-3xl" />
        <div className="relative rotate-3 rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-900 via-emerald-950 to-black p-8 shadow-2xl">
          <div className="flex justify-between text-sm text-zinc-400">
            <span>REVEN</span>
            <span>SEPOLIA</span>
          </div>
          <div className="mt-20 text-3xl font-bold">Reven Card</div>
          <div className="mt-3 text-emerald-300">NFT • Vault • Telegram</div>
          <div className="mt-16 text-xl tracking-[0.35em]">4386 **** 9823</div>
        </div>
      </div>
    </section>
  );
}