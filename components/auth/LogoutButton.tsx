"use client";

import { useDisconnect } from "wagmi";

export default function LogoutButton() {
  const { disconnect } = useDisconnect();

  function logout() {
    // disconnect wallet
    disconnect();

    // remove Reven session
    localStorage.removeItem("reven_user");

    // clear other cached wallet data
    localStorage.removeItem("wagmi.store");
    localStorage.removeItem("walletconnect");

    window.location.href = "/login";
  }

  return (
    <button
      onClick={logout}
      className="rounded-full border border-white/15 px-6 py-4 font-semibold text-white hover:bg-white/10"
    >
      Logout
    </button>
  );
}