export default function ForgotPasswordPage() {
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
            placeholder="Username"
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          />

          <a
            href="#"
            className="block rounded-full bg-emerald-400 px-6 py-4 text-center font-semibold text-black hover:bg-emerald-300"
          >
            Get Telegram Reset Code
          </a>

          <input
            placeholder="Reset Code"
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          />
        </div>

        <button className="mt-6 w-full rounded-full bg-white px-6 py-4 font-semibold text-black hover:bg-zinc-200">
          Reset Password
        </button>
      </div>
    </main>
  );
}