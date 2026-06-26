"use client";

interface Props {
  open: boolean;
  cardName: string;
  onContinue: () => void;
}

export default function PurchaseSuccessModal({
  open,
  cardName,
  onContinue,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8 text-white">
        <div className="text-center">
          <div className="mb-5 text-6xl">🎉</div>

          <h2 className="text-3xl font-bold">
            Purchase Successful
          </h2>

          <p className="mt-4 text-zinc-400">
            Your <span className="font-semibold">{cardName}</span> has been
            created successfully.
          </p>

          <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-left">
            <p className="font-semibold text-emerald-300">
              📲 Important
            </p>

            <p className="mt-2 text-sm text-zinc-300">
              Start the Reven Card Bot to receive:
            </p>

            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>• Purchase notifications</li>
              <li>• Reload alerts</li>
              <li>• Withdraw alerts</li>
              <li>• Card management</li>
            </ul>
          </div>

          <button
            onClick={() =>
              window.open("https://t.me/RevenCardBot", "_blank")
            }
            className="mt-8 w-full rounded-full bg-emerald-400 py-4 font-semibold text-black hover:bg-emerald-300"
          >
            🚀 Open Reven Card Bot
          </button>

          <button
            onClick={onContinue}
            className="mt-3 w-full rounded-full border border-white/15 py-4 hover:bg-white/10"
          >
            Continue to My Cards
          </button>
        </div>
      </div>
    </div>
  );
}