"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  fullName: string;
};

export default function ProfileClient() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("reven_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) {
    return <p className="text-zinc-400">Please login to view your profile.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-zinc-500">Full Name</p>
        <p className="mt-2 text-2xl font-bold">{user.fullName}</p>
      </div>

      <div>
        <p className="text-sm text-zinc-500">Username</p>
        <p className="mt-2 text-xl">@{user.username}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-sm text-zinc-500">Telegram</p>
          <p className="mt-2 text-yellow-300">Linked during signup</p>
        </div>

        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-sm text-zinc-500">Wallet</p>
          <p className="mt-2 text-yellow-300">Not connected</p>
        </div>
      </div>
    </div>
  );
}