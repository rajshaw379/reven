import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import { getDashboardData } from "@/lib/dashboard";
import WelcomeUser from "@/components/dashboard/WelcomeUser";
import RequireLogin from "@/components/auth/RequireLogin";
import LogoutButton from "@/components/auth/LogoutButton";
import DashboardStats from "@/components/dashboard/DashboardStats";




export default async function DashboardPage() {
  const { user, cards, transactions } = await getDashboardData();
  return (
    <RequireLogin>
    <main className="min-h-screen bg-black py-24 text-white">
      <Container>
        <a href="/" className="text-sm text-zinc-400 hover:text-white">
          ← Back to Home
        </a>

        <div className="mt-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-emerald-300">Dashboard</p>
            <WelcomeUser />
            <p className="mt-4 text-zinc-400">
              Manage your Reven cards, balances, reloads, and withdrawals.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
  <WalletConnectButton />
  <Button href="/marketplace">Mint New Card</Button>
  <LogoutButton />
</div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
  <DashboardStats />
</div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">My Cards</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {cards.length === 0 ? (
  <p className="text-zinc-400">
    You don't have any cards yet.
  </p>
) : (
  cards.map((card: any) => (
    <GlassCard key={card.id} className="p-6">
      <div className="h-40 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-emerald-950 to-black p-5">
        <p className="text-sm text-zinc-400">REVEN</p>

        <p className="mt-16 text-xl font-bold capitalize">
          {card.card_type} Card
        </p>
      </div>

      <div className="mt-6 flex justify-between">
        <span className="text-zinc-500">Status</span>
        <span className="text-emerald-300">
          {card.status}
        </span>
      </div>

      <div className="mt-3 flex justify-between">
        <span className="text-zinc-500">Wallet</span>
        <span className="truncate">
          {card.wallet_address}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button href="#" variant="secondary">
          Reload
        </Button>

        <Button href="#" variant="secondary">
          Withdraw
        </Button>
      </div>
    </GlassCard>
  ))
)}

          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Recent Activity</h2>

          <GlassCard className="mt-6 overflow-hidden">
            {transactions.length === 0 ? (
  <div className="p-6 text-zinc-400">
    No transactions yet.
  </div>
) : (
  transactions.map((tx: any) => (
    <div
      key={tx.id}
      className="flex flex-col justify-between gap-2 border-b border-white/10 p-5 last:border-b-0 md:flex-row"
    >
      <div>
        <p className="font-semibold capitalize">
          {tx.transaction_type}
        </p>

        <p className="text-sm text-zinc-400">
          {tx.amount_eth} ETH
        </p>
      </div>

      <p
        className={`text-sm ${
          tx.status === "completed"
            ? "text-emerald-300"
            : "text-yellow-400"
        }`}
      >
        {tx.status}
      </p>
    </div>
  ))
)}
          </GlassCard>
        </section>
      </Container>
    </main>
   </RequireLogin>
  );
}