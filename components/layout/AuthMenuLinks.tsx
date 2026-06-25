"use client";

import { useEffect, useState } from "react";
import { useDisconnect } from "wagmi";

export default function AuthMenuLinks() {
  const [loggedIn, setLoggedIn] = useState(false);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("reven_user")));
  }, []);

  function logout() {
    disconnect();

    localStorage.removeItem("reven_user");
    localStorage.removeItem("wagmi.store");
    localStorage.removeItem("walletconnect");

    window.location.href = "/login";
  }

  if (loggedIn) {
    return (
      <>
        <a
          href="/dashboard"
          className="block rounded-xl px-4 py-3 text-sm hover:bg-white/10"
        >
          🏠 Dashboard
        </a>

        <a
          href="/marketplace"
          className="block rounded-xl px-4 py-3 text-sm hover:bg-white/10"
        >
          🛍 Marketplace
        </a>

        <a
          href="/cards"
          className="block rounded-xl px-4 py-3 text-sm hover:bg-white/10"
        >
          💳 My Cards
        </a>

        <a
          href="/profile"
          className="block rounded-xl px-4 py-3 text-sm hover:bg-white/10"
        >
          👤 Profile
        </a>

        <hr className="my-2 border-white/10" />

        <button
          onClick={logout}
          className="block w-full rounded-xl px-4 py-3 text-left text-sm text-red-300 hover:bg-white/10"
        >
          🚪 Logout
        </button>
      </>
    );
  }

  return (
    <>
      <a
        href="/signup"
        className="block rounded-xl px-4 py-3 text-sm hover:bg-white/10"
      >
        Sign Up Through Telegram
      </a>

      <a
        href="/login"
        className="block rounded-xl px-4 py-3 text-sm hover:bg-white/10"
      >
        Login
      </a>

      <a
        href="/marketplace"
        className="block rounded-xl px-4 py-3 text-sm hover:bg-white/10"
      >
        🛍 Marketplace
      </a>
    </>
  );
}