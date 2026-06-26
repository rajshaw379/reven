"use client";

import { useState } from "react";
import { useWalletClient } from "wagmi";
import { BrowserProvider, Contract } from "ethers";
import GlassCard from "@/components/ui/GlassCard";
import {
  REVEN_CARD_ABI,
  REVEN_CARD_ADDRESS,
} from "@/lib/contract/revenCard";

const CARD_TYPES = [
  { label: "Virtual", value: 0 },
  { label: "Physical", value: 1 },
  { label: "Free", value: 2 },
];

export default function AdminCoupons() {
  const { data: walletClient } = useWalletClient();

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [cardType, setCardType] = useState("0");
  const [allPaid, setAllPaid] = useState(true);

  async function getContract() {
    if (!walletClient) throw new Error("Wallet not connected.");

    const provider = new BrowserProvider(walletClient.transport);
    const signer = await provider.getSigner();

    return new Contract(REVEN_CARD_ADDRESS, REVEN_CARD_ABI, signer);
  }

  async function createCoupon() {
    try {
      setLoading(true);

      const contract = await getContract();

      const tx = await contract.setCoupon(
        code.toUpperCase(),
        true,
        Number(cardType),
        allPaid,
        Number(discount) * 100,
        Number(maxUses || 0),
        0
      );

      await tx.wait();

      alert("Coupon created successfully.");
      setCode("");
      setDiscount("");
      setMaxUses("");
    } catch (err: any) {
      alert(err?.shortMessage || err?.reason || err?.message || "Coupon failed.");
    } finally {
      setLoading(false);
    }
  }

  async function disableCoupon() {
    try {
      setLoading(true);

      const contract = await getContract();

      const tx = await contract.disableCoupon(code.toUpperCase());
      await tx.wait();

      alert("Coupon disabled.");
    } catch (err: any) {
      alert(err?.shortMessage || err?.reason || err?.message || "Disable failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Stat title="Contract" value={`${REVEN_CARD_ADDRESS.slice(0, 6)}...${REVEN_CARD_ADDRESS.slice(-4)}`} />
        <Stat title="Discount Type" value="Percent" />
        <Stat title="Applies To" value={allPaid ? "Paid Cards" : "Selected Type"} />
      </div>

      <GlassCard className="p-6">
        <h2 className="text-2xl font-bold">Create / Update Coupon</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Coupon code e.g. WELCOME20"
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          />

          <input
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Discount % e.g. 20"
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          />

          <input
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            placeholder="Max uses, 0 = unlimited"
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          />

          <select
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
          >
            {CARD_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <label className="mt-5 flex items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={allPaid}
            onChange={(e) => setAllPaid(e.target.checked)}
          />
          Apply coupon to all paid cards: Virtual + Physical
        </label>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button
            onClick={createCoupon}
            disabled={loading || !code || !discount}
            className="rounded-full bg-emerald-400 px-6 py-4 font-semibold text-black hover:bg-emerald-300 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create / Update Coupon"}
          </button>

          <button
            onClick={disableCoupon}
            disabled={loading || !code}
            className="rounded-full border border-red-400/30 px-6 py-4 font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          >
            Disable Coupon
          </button>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="text-2xl font-bold">How it works</h2>

        <div className="mt-4 space-y-3 text-sm text-zinc-400">
          <p>
            <span className="text-white">WELCOME20</span> with discount{" "}
            <span className="text-white">20</span> gives users 20% off.
          </p>
          <p>
            If “all paid cards” is enabled, the coupon works for Virtual and
            Physical cards.
          </p>
          <p>
            Free cards cannot use coupons.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <GlassCard className="p-6">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-3 break-all text-2xl font-bold">{value}</p>
    </GlassCard>
  );
}