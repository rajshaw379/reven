"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch("/api/admin/users");
      const data = await res.json();

      setUsers(data.users || []);
      setLoading(false);
    }

    loadUsers();
  }, []);

  return (
    <GlassCard className="mt-8 overflow-hidden">
      <div className="border-b border-white/10 p-6">
        <h2 className="text-2xl font-bold">All Users</h2>
      </div>

      {loading ? (
        <div className="p-6 text-zinc-400">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="p-6 text-zinc-400">No users found.</div>
      ) : (
        <div className="divide-y divide-white/10">
          {users.map((user) => {
            const telegram = user.telegram_accounts?.[0];
            const wallet = user.wallets?.find((w: any) => w.is_primary) || user.wallets?.[0];

            return (
              <div key={user.id} className="grid gap-4 p-5 lg:grid-cols-5">
                <div>
                  <p className="font-semibold">{user.full_name || "Unnamed"}</p>
                  <p className="text-sm text-zinc-500">@{user.username}</p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Telegram</p>
                  <p className="text-sm">
                    {telegram?.telegram_username
                      ? `@${telegram.telegram_username}`
                      : "Not linked"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Wallet</p>
                  <p className="break-all text-sm">
                    {wallet?.wallet_address
                      ? `${wallet.wallet_address.slice(0, 6)}...${wallet.wallet_address.slice(-4)}`
                      : "Not connected"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Cards</p>
                  <p className="text-sm">{user.cards?.length || 0}</p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Joined</p>
                  <p className="text-sm">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}