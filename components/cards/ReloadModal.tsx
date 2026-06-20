"use client";

export default function ReloadModal({
  amount,
  setAmount,
  onClose,
  onConfirm,
  loading,
}: {
  amount: string;
  setAmount: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white">
        <h2 className="text-2xl font-bold">Reload Card</h2>

        <p className="mt-2 text-sm text-zinc-400">
          Enter the amount of ETH you want to add to this card.
        </p>

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0001"
          className="mt-6 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
        />

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-white/15 px-5 py-3 font-semibold hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full bg-emerald-400 px-5 py-3 font-semibold text-black hover:bg-emerald-300 disabled:opacity-50"
          >
            {loading ? "Reloading..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}