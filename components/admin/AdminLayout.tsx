"use client";

import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import Container from "@/components/ui/Container";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import { REVEN_CARD_ADDRESS } from "@/lib/contract/revenCard";

const links = [
  ["📊 Dashboard", "/admin"],
  ["👥 Users", "/admin/users"],
  ["💳 Cards", "/admin/cards"],
  ["📦 Orders", "/admin/orders"],
  ["🎟 Coupons", "/admin/coupons"],
  ["📈 Analytics", "/admin/analytics"],
  ["🔔 Notifications", "/admin/notifications"],
  ["⚙ Settings", "/admin/settings"],
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-black py-24 text-white">
      <Container>
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm text-emerald-300">Admin Console</p>
              <h1 className="text-2xl font-bold">Reven Control Center</h1>
              <p className="mt-2 break-all text-sm text-zinc-500">
                Contract: {REVEN_CARD_ADDRESS}
              </p>
            </div>

            <div>
              {isConnected && address ? (
                <p className="rounded-full border border-emerald-400/30 px-4 py-2 text-sm text-emerald-300">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              ) : (
                <WalletConnectButton />
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-4 lg:sticky lg:top-24">
            <h2 className="px-4 py-3 text-xl font-bold">Reven Admin</h2>

            <nav className="mt-4 space-y-2">
              {links.map(([label, href]) => {
                const active = pathname === href;

                return (
                  <a
                    key={href}
                    href={href}
                    className={`block rounded-2xl px-4 py-3 text-sm transition ${
                      active
                        ? "bg-emerald-400 text-black"
                        : "text-zinc-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {label}
                  </a>
                );
              })}
            </nav>
          </aside>

          <section>{children}</section>
        </div>
      </Container>
    </main>
  );
}