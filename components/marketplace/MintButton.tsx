"use client";

import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { BrowserProvider, Contract, parseEther } from "ethers";
import {
  REVEN_CARD_ABI,
  REVEN_CARD_ADDRESS,
} from "@/lib/contract/revenCard";
import { toast } from "sonner";

interface Props {
  cardType: string;
  cardName: string;
}

const cardTypeMap: Record<string, number> = {
  virtual: 0,
  physical: 1,
  free: 2,
};

const priceMap: Record<string, string> = {
  virtual: "0.0005",
  physical: "0.001",
  free: "0",
};

export default function MintButton({ cardType, cardName }: Props) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [holderName, setHolderName] = useState("");
  const [coupon, setCoupon] = useState("");

  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [finalPriceEth, setFinalPriceEth] = useState(priceMap[cardType]);
const [couponApplied, setCouponApplied] = useState(false);

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  async function applyCoupon() {
  if (!coupon.trim()) {
    alert("Enter coupon code.");
    return;
  }

  if (!walletClient) {
    alert("Connect wallet first.");
    return;
  }

  try {
    const provider = new BrowserProvider(walletClient.transport);
    const contract = new Contract(REVEN_CARD_ADDRESS, REVEN_CARD_ABI, provider);

    const price = await contract.getDiscountedPrice(
      cardTypeMap[cardType],
      coupon
    );

    setFinalPriceEth(String(Number(price) / 1e18));
    setCouponApplied(true);

    toast.success("Coupon applied successfully.");
  } catch (err: any) {
    alert(err?.reason || err?.message || "Coupon failed.");
  }
}

  async function mintCard() {
    const stored = localStorage.getItem("reven_user");

    if (!stored) {
      window.location.href = "/login";
      return;
    }

    if (!holderName.trim()) {
      alert("Please enter the card holder name.");
      return;
    }

    if (cardType === "physical") {
      if (
        !shippingName.trim() ||
        !shippingAddress.trim() ||
        !shippingCity.trim() ||
        !shippingState.trim() ||
        !shippingCountry.trim() ||
        !shippingPostalCode.trim()
      ) {
        alert("Please fill the full shipping address.");
        return;
      }
    }

    if (!isConnected || !address || !walletClient) {
      toast.error("Please connect your wallet before continuing.");
      return;
    }

    try {
      setLoading(true);

      const user = JSON.parse(stored);

      const walletCheck = await fetch("/api/wallet/check", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: user.id,
    walletAddress: address,
  }),
});

const walletCheckData = await walletCheck.json();

if (!walletCheck.ok) {
  toast.error(walletCheckData.error || "Wallet not allowed.");
  return;
}

      const provider = new BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner(address);

      const contract = new Contract(
        REVEN_CARD_ADDRESS,
        REVEN_CARD_ABI,
        signer
      );

      const tx =
  couponApplied && coupon.trim() && cardType !== "free"
    ? await contract.mintWithCoupon(cardTypeMap[cardType], coupon, {
        value: parseEther(finalPriceEth),
      })
    : await contract.mint(cardTypeMap[cardType], {
        value: parseEther(priceMap[cardType]),
      });

      const receipt = await tx.wait();

      let tokenId = "";

      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);

          if (parsed?.name === "CardMinted") {
            tokenId = parsed.args.tokenId.toString();
          }
        } catch {}
      }

      const res = await fetch("/api/cards/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          cardType,
          walletAddress: address,
          tokenId,
          txHash: tx.hash,
          cardHolderName: holderName,
          couponCode: coupon || null,
          shippingName: cardType === "physical" ? shippingName : null,
          shippingAddress: cardType === "physical" ? shippingAddress : null,
          shippingCity: cardType === "physical" ? shippingCity : null,
          shippingState: cardType === "physical" ? shippingState : null,
          shippingCountry: cardType === "physical" ? shippingCountry : null,
          shippingPostalCode:
            cardType === "physical" ? shippingPostalCode : null,
          finalPriceEth,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Database save failed.");
        return;
      }

      toast.success(`${cardName} purchased successfully! Start Reven Card Bot for alerts.`, {
  action: {
    label: "Open Bot",
    onClick: () => window.open("https://t.me/RevenCardBot", "_blank"),
  },
});
      window.location.href = "/cards";
    } catch (error: any) {
      alert(
        error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Purchase failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className="mt-8 w-full rounded-full bg-emerald-400 px-6 py-4 font-semibold text-black hover:bg-emerald-300 disabled:opacity-50"
      >
        {loading
  ? "Processing..."
  : cardType === "free"
  ? "Free Card"
  : `Purchase ${cardName}`}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white">
            <h2 className="text-2xl font-bold">Purchase {cardName}</h2>

            <p className="mt-2 text-sm text-zinc-400">
              Enter the required details before getting your Reven card.
            </p>

            <div className="mt-6 space-y-4">
              <input
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="Card holder name"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
              />

              {(cardType === "virtual" || cardType === "physical") && (
  <>
    <input
      value={coupon}
      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
      placeholder="Coupon code (optional)"
      className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
    />

    <button
      type="button"
      onClick={applyCoupon}
      className="w-full rounded-full border border-emerald-400/30 px-5 py-3 font-semibold text-emerald-300 hover:bg-emerald-400/10"
    >
      Apply Coupon
    </button>
  </>
)}

              {cardType === "physical" && (
                <>
                  <input
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="Shipping name"
                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
                  />

                  <input
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Full address"
                    className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      placeholder="City"
                      className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
                    />

                    <input
                      value={shippingState}
                      onChange={(e) => setShippingState(e.target.value)}
                      placeholder="State"
                      className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      value={shippingCountry}
                      onChange={(e) => setShippingCountry(e.target.value)}
                      placeholder="Country"
                      className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
                    />

                    <input
                      value={shippingPostalCode}
                      onChange={(e) => setShippingPostalCode(e.target.value)}
                      placeholder="Postal code"
                      className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black p-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Price</span>
                <span>{finalPriceEth} ETH</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-full border border-white/15 px-5 py-3 font-semibold hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={mintCard}
                disabled={loading}
                className="rounded-full bg-emerald-400 px-5 py-3 font-semibold text-black hover:bg-emerald-300 disabled:opacity-50"
              >
                {loading ? "Processing..." : cardType === "free" ? "Get Free Card" : "Confirm Purchase"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}