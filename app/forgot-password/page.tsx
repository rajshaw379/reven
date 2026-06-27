"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode() {
    if (!username.trim()) {
      toast.error("Enter your username.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Failed to request reset code.");
      return;
    }

    toast.success("Reven Verify Bot opened. Tap Start to get your reset code.");
    window.open(
  `https://t.me/RevenVerifyBot?start=reset_${encodeURIComponent(username.trim())}`,
  "_blank"
);
  }

  async function resetPassword() {
    if (!username.trim() || !otp.trim() || !newPassword.trim()) {
      toast.error("Fill all fields.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, otp, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Password reset failed.");
      return;
    }

    toast.success("Password reset successful.");
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <a href="/login" className="text-sm text-zinc-400 hover:text-white">
          ← Back to Login
        </a>

        <h1 className="mt-8 text-4xl font-bold">Forgot Password</h1>

        <p className="mt-4 text-zinc-400">
          Enter your username and verify with Reven Verify Bot to reset your password.
        </p>

        <div className="mt-8 space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          />

          <button
            type="button"
            onClick={requestCode}
            disabled={loading}
            className="w-full rounded-full bg-emerald-400 px-6 py-4 font-semibold text-black hover:bg-emerald-300 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Get Telegram Reset Code"}
          </button>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Reset Code"
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          />

          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="New Password"
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          />
        </div>

        <button
          type="button"
          onClick={resetPassword}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-white px-6 py-4 font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>
      </div>
    </main>
  );
}