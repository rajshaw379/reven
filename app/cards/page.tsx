import Container from "@/components/ui/Container";
import MyCardsClient from "@/components/cards/MyCardsClient";

export default function CardsPage() {
  return (
    <main className="min-h-screen bg-black py-24 text-white">
      <Container>
        <a href="/dashboard" className="text-sm text-zinc-400 hover:text-white">
          ← Back to Dashboard
        </a>

        <h1 className="mt-10 text-4xl font-bold md:text-6xl">
          My Cards
        </h1>

        <p className="mt-4 text-zinc-400">
          View all NFT cards you own.
        </p>

        <MyCardsClient />
      </Container>
    </main>
  );
}