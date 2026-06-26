import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <a href="/" className="text-sm text-zinc-400 hover:text-white">
          ← Back to Home
        </a>

        <h1 className="mt-8 text-4xl font-bold">Sign Up</h1>

        <p className="mt-4 text-zinc-400">
          Create your Reven account. Telegram OTP will be added next.
        </p>
         
         <p className="mt-4 text-zinc-400">
  Verify your Telegram first, then create your Reven account.
</p>

<div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm text-zinc-300">
  <p>
  1. Open{" "}
  <a
    href="https://t.me/RevenVerifybot"
    target="_blank"
    rel="noreferrer"
    className="font-semibold text-emerald-300 underline"
  >
    Reven Verify Bot
  </a>
</p>
  <p>2. Send /start</p>
  <p>3. Copy the OTP</p>
  <p>4. Enter it below</p>
</div>

        <SignupForm />

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-300">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}