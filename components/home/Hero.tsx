export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 md:grid-cols-2 md:items-center md:gap-12 md:pb-20 md:pt-24">
      <div>
        <p className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 sm:px-4 sm:py-2 sm:text-sm">
          Sepolia Testnet Crypto Card Ecosystem
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          The Future of
          <span className="block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            Crypto Cards
          </span>
          Starts Here
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base md:text-lg lg:text-xl">
          Mint NFT-backed crypto cards, manage balances on-chain, and receive
          secure Telegram notifications for every reload and withdrawal.
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[360px] sm:max-w-md">
        <div className="absolute inset-0 rounded-[2rem] bg-emerald-400/20 blur-3xl" />

        <div className="relative rotate-2 rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-900 via-emerald-950 to-black p-6 shadow-2xl sm:p-8">
          <div className="flex justify-between text-xs text-zinc-400 sm:text-sm">
            <span>REVEN</span>
            <span>SEPOLIA</span>
          </div>

          <div className="mt-14 text-2xl font-bold sm:mt-20 sm:text-3xl">
            Reven Card
          </div>

          <div className="mt-3 text-sm text-emerald-300 sm:text-base">
            NFT • Vault • Telegram
          </div>

          <div className="mt-12 text-sm tracking-[0.3em] sm:mt-16 sm:text-xl sm:tracking-[0.35em]">
            4386 **** 9823
          </div>
        </div>
      </div>
    </section>
  );
}
