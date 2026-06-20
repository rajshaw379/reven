import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <a href="/" className="text-sm text-zinc-400 hover:text-white">
          ← Back to Home
        </a>

        <h1 className="mt-8 text-4xl font-bold">Login</h1>

        <p className="mt-4 text-zinc-400">
          Access your Reven dashboard.
        </p>

        <LoginForm />

        <div className="mt-6 flex justify-between text-sm">
          <a href="/signup" className="text-zinc-400 hover:text-white">
            Create account
          </a>

          <a href="/forgot-password" className="text-emerald-300">
            Forgot Password?
          </a>
        </div>
      </div>
    </main>
  );
}