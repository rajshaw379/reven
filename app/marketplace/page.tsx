import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import { getMarketplaceCards } from "@/lib/marketplace";
import MintButton from "@/components/marketplace/MintButton";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";

export default async function MarketplacePage() {
  const cards = await getMarketplaceCards();

  return (
    <main className="min-h-screen bg-black py-24 text-white">
      <Container>
        <a href="/" className="text-sm text-zinc-400 hover:text-white">
          ← Back to Home
        </a>

        <div className="mt-10">
          <SectionTitle
            eyebrow="Marketplace"
            title="Choose your Reven Card"
            description="Mint an NFT-backed crypto card on Sepolia. Reload and withdraw later through your dashboard."
          />
        </div>
        <div className="mt-8">
  <WalletConnectButton />
</div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card: any) => (
            <GlassCard key={card.id} className="p-6">
              <div className="h-48 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-emerald-950 to-black p-5">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>REVEN</span>
                  <span>{card.network}</span>
                </div>

                <p className="mt-20 text-2xl font-bold">{card.name}</p>
                <p className="mt-2 text-sm text-emerald-300">ERC-721 NFT</p>
              </div>

              <h2 className="mt-8 text-2xl font-bold">{card.name}</h2>

              <p className="mt-2 text-emerald-300">
                {Number(card.price_eth) === 0
                  ? "Free"
                  : `${card.price_eth} ETH`}
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                {card.description}
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Supply</span>
                  <span>{card.supply}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">Network</span>
                  <span>{card.network}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">Status</span>
                  <span className="text-emerald-300 capitalize">
                    {card.status}
                  </span>
                </div>
              </div>

              <MintButton
  cardType={card.card_type}
  cardName={card.name}
/>
            </GlassCard>
          ))}
        </div>
      </Container>
    </main>
  );
}