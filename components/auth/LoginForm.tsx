"use client";

import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setMessage("Logging in...");

  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    setMessage(data.error || "Login failed.");
    return;
  }

  localStorage.setItem("reven_user", JSON.stringify(data.user));

  window.location.href = "/dashboard";
}

  return (
    <form onSubmit={handleLogin} className="mt-8 space-y-4">
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
      />

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
      />

      <button className="w-full rounded-full bg-emerald-400 px-6 py-4 font-semibold text-black hover:bg-emerald-300">
        Login
      </button>

      {message && (
        <p className="text-center text-sm text-zinc-400">
          {message}
        </p>
      )}
    </form>
  );
}