import AuthMenuLinks from "@/components/layout/AuthMenuLinks";

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="/" className="text-xl font-bold tracking-wide">
          REVEN
        </a>

        <details className="relative">
          <summary className="cursor-pointer list-none rounded-full border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10">
            ☰
          </summary>

          <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-zinc-950 p-3 shadow-2xl">
  <AuthMenuLinks />
</div>
        </details>
      </div>
    </header>
  );
}