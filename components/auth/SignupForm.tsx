"use client";

import { useState } from "react";

export default function SignupForm() {
  
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Creating account...");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  fullName,
  password,
  otp,
}),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Signup failed.");
      return;
    }

    setMessage("Account created successfully. You can now login.");
  }

  return (
    <form onSubmit={handleSignup} className="mt-8 space-y-4">

<div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">
  Verify yourself first using the <strong>Reven Verify Bot</strong> on Telegram.
  After entering the OTP below, your Telegram username will automatically become
  your Reven username.
</div>

      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
        className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
      />

<input
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  type="password"
  placeholder="Password"
  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
/>

      <input
  value={otp}
  onChange={(e) => setOtp(e.target.value)}
  placeholder="Telegram OTP"
  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
/>

      <button className="w-full rounded-full bg-white px-6 py-4 font-semibold text-black hover:bg-zinc-200">
        Create Account
      </button>

      {message && <p className="text-center text-sm text-zinc-400">{message}</p>}
    </form>
  );
}