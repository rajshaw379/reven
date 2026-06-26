"use client";

import { useEffect, useState } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";
import AdminOrders from "@/components/admin/AdminOrders";

import {
  REVEN_CARD_ABI,
  REVEN_CARD_ADDRESS,
} from "@/lib/contract/revenCard";

const CARD_TYPES = [
  { label: "Virtual", value: 0 },
  { label: "Physical", value: 1 },
  { label: "Free", value: 2 },
];

const STATUSES = [
  { label: "Pending", value: 0 },
  { label: "Active", value: 1 },
  { label: "Locked", value: 2 },
  { label: "Suspended", value: 3 },
];

export default function AdminDashboardClient() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<any>({});
  const [selectedType, setSelectedType] = useState("0");

  const [newMaxSupply, setNewMaxSupply] = useState("");
  const [typeSupply, setTypeSupply] = useState("");
  const [priceEth, setPriceEth] = useState("");
  const [walletLimit, setWalletLimit] = useState("");

  const [tokenId, setTokenId] = useState("");
  const [status, setStatus] = useState("1");

  const [reserveTo, setReserveTo] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("");
  const [couponMaxUses, setCouponMaxUses] = useState("");
  const [couponAllPaid, setCouponAllPaid] = useState(true);

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const walletAllowed = isConnected && address?.toLowerCase() === adminWallet;

  function login() {
    if (password !== adminPassword) {
      alert("Invalid admin password.");
      return;
    }
    setUnlocked(true);
  }

  async function getWriteContract() {
    if (!walletClient) throw new Error("Wallet not connected");
    const provider = new BrowserProvider(walletClient.transport);
    const signer = await provider.getSigner();

    return new Contract(REVEN_CARD_ADDRESS, REVEN_CARD_ABI, signer);
  }

  async function runTx(fn: () => Promise<any>, success: string) {
    try {
      setLoading(true);
      const tx = await fn();
      await tx.wait();
      alert(success);
      await loadStats();
    } catch (err: any) {
      alert(err?.shortMessage || err?.reason || err?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    if (!publicClient) return;

    const read = async (functionName: string, args: any[] = []) =>
      publicClient.readContract({
        address: REVEN_CARD_ADDRESS as `0x${string}`,
        abi: REVEN_CARD_ABI,
        functionName,
        args,
      });

    const [
      maxSupply,
      totalMinted,
      paused,
      contractBalance,
      virtualMax,
      physicalMax,
      freeMax,
      virtualMinted,
      physicalMinted,
      freeMinted,
      virtualPrice,
      physicalPrice,
      freePrice,
      virtualLimit,
      physicalLimit,
      freeLimit,
      virtualPaused,
      physicalPaused,
      freePaused,
    ] = await Promise.all([
      read("maxSupply"),
      read("totalMinted"),
      read("paused"),
      publicClient.getBalance({ address: REVEN_CARD_ADDRESS as `0x${string}` }),
      read("maxSupplyByType", [0]),
      read("maxSupplyByType", [1]),
      read("maxSupplyByType", [2]),
      read("mintedByType", [0]),
      read("mintedByType", [1]),
      read("mintedByType", [2]),
      read("priceByType", [0]),
      read("priceByType", [1]),
      read("priceByType", [2]),
      read("walletLimitByType", [0]),
      read("walletLimitByType", [1]),
      read("walletLimitByType", [2]),
      read("cardTypePaused", [0]),
      read("cardTypePaused", [1]),
      read("cardTypePaused", [2]),
    ]);

    setStats({
      maxSupply: String(maxSupply),
      totalMinted: String(totalMinted),
      paused,
      contractBalance: formatEther(contractBalance),
      virtualMax: String(virtualMax),
      physicalMax: String(physicalMax),
      freeMax: String(freeMax),
      virtualMinted: String(virtualMinted),
      physicalMinted: String(physicalMinted),
      freeMinted: String(freeMinted),
      virtualPrice: formatEther(virtualPrice as bigint),
      physicalPrice: formatEther(physicalPrice as bigint),
      freePrice: formatEther(freePrice as bigint),
      virtualLimit: String(virtualLimit),
      physicalLimit: String(physicalLimit),
      freeLimit: String(freeLimit),
      virtualPaused,
      physicalPaused,
      freePaused,
    });
  }

  useEffect(() => {
    if (walletAllowed) loadStats();
  }, [walletAllowed, publicClient]);

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-black py-24 text-white">
        <Container>
          <GlassCard className="mx-auto max-w-md p-6">
            <h1 className="text-3xl font-bold">Admin Login</h1>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Admin password"
              className="mt-6 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
            />

            <button
              onClick={login}
              className="mt-4 w-full rounded-full bg-emerald-400 px-6 py-4 font-semibold text-black"
            >
              Unlock Admin
            </button>
          </GlassCard>
        </Container>
      </main>
    );
  }

  if (!walletAllowed) {
    return (
      <main className="min-h-screen bg-black py-24 text-white">
        <Container>
          <GlassCard className="mx-auto max-w-xl p-6">
            <h1 className="text-3xl font-bold">Admin Wallet Required</h1>
            <p className="mt-4 text-zinc-400">
              Connect the contract owner wallet.
            </p>
            <div className="mt-6">
              <WalletConnectButton />
            </div>
          </GlassCard>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black py-24 text-white">
      <Container>
        <h1 className="text-4xl font-bold">Reven Admin Dashboard</h1>
        <p className="mt-3 break-all text-zinc-400">Owner: {address}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <Stat title="Total Minted" value={`${stats.totalMinted ?? "-"} / ${stats.maxSupply ?? "-"}`} />
          <Stat title="Contract Balance" value={`${stats.contractBalance ?? "0"} ETH`} />
          <Stat title="Global Mint" value={stats.paused ? "Paused" : "Active"} />
          <Stat title="Contract" value={`${REVEN_CARD_ADDRESS.slice(0, 6)}...${REVEN_CARD_ADDRESS.slice(-4)}`} />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Stat title="Virtual" value={`${stats.virtualMinted ?? "-"} / ${stats.virtualMax ?? "-"}`} sub={`${stats.virtualPrice ?? "-"} ETH`} />
          <Stat title="Physical" value={`${stats.physicalMinted ?? "-"} / ${stats.physicalMax ?? "-"}`} sub={`${stats.physicalPrice ?? "-"} ETH`} />
          <Stat title="Free" value={`${stats.freeMinted ?? "-"} / ${stats.freeMax ?? "-"}`} sub={`${stats.freePrice ?? "-"} ETH`} />
        </div>

        <AdminSection title="Global Mint Controls">
          <ButtonRow>
            <ActionButton
              label="Start Mint"
              loading={loading}
              onClick={() =>
                runTx(async () => (await getWriteContract()).startMint(), "Minting started")
              }
            />
            <ActionButton
              label="Pause Mint"
              loading={loading}
              danger
              onClick={() =>
                runTx(async () => (await getWriteContract()).pauseMint(), "Minting paused")
              }
            />
          </ButtonRow>
        </AdminSection>

        <AdminSection title="Card Type Controls">
          <Select value={selectedType} onChange={setSelectedType} options={CARD_TYPES} />

          <ButtonRow>
            <ActionButton
              label="Pause Type"
              loading={loading}
              danger
              onClick={() =>
                runTx(
                  async () =>
                    (await getWriteContract()).setCardTypePaused(Number(selectedType), true),
                  "Card type paused"
                )
              }
            />
            <ActionButton
              label="Unpause Type"
              loading={loading}
              onClick={() =>
                runTx(
                  async () =>
                    (await getWriteContract()).setCardTypePaused(Number(selectedType), false),
                  "Card type unpaused"
                )
              }
            />
          </ButtonRow>
        </AdminSection>

        <AdminSection title="Supply Controls">
          <Input value={newMaxSupply} onChange={setNewMaxSupply} placeholder="Total max supply" />
          <ActionButton
            label="Update Total Supply"
            loading={loading}
            onClick={() =>
              runTx(
                async () => (await getWriteContract()).setMaxSupply(Number(newMaxSupply)),
                "Total supply updated"
              )
            }
          />

          <div className="mt-4" />
          <Select value={selectedType} onChange={setSelectedType} options={CARD_TYPES} />
          <Input value={typeSupply} onChange={setTypeSupply} placeholder="Type max supply" />
          <ActionButton
            label="Update Type Supply"
            loading={loading}
            onClick={() =>
              runTx(
                async () =>
                  (await getWriteContract()).setTypeMaxSupply(Number(selectedType), Number(typeSupply)),
                "Type supply updated"
              )
            }
          />
        </AdminSection>

        <AdminSection title="Price Controls">
          <Select value={selectedType} onChange={setSelectedType} options={CARD_TYPES} />
          <Input value={priceEth} onChange={setPriceEth} placeholder="Price in ETH" />
          <ActionButton
            label="Update Price"
            loading={loading}
            onClick={() =>
              runTx(
                async () =>
                  (await getWriteContract()).setPrice(Number(selectedType), parseEther(priceEth || "0")),
                "Price updated"
              )
            }
          />
        </AdminSection>

        <AdminSection title="Wallet Limit Controls">
          <Select value={selectedType} onChange={setSelectedType} options={CARD_TYPES} />
          <Input value={walletLimit} onChange={setWalletLimit} placeholder="Max per wallet" />
          <ActionButton
            label="Update Wallet Limit"
            loading={loading}
            onClick={() =>
              runTx(
                async () =>
                  (await getWriteContract()).setWalletLimit(Number(selectedType), Number(walletLimit)),
                "Wallet limit updated"
              )
            }
          />
        </AdminSection>

        <AdminSection title="Coupon Management">
          <Input value={couponCode} onChange={setCouponCode} placeholder="Coupon code e.g. WELCOME20" />
          <Select value={selectedType} onChange={setSelectedType} options={CARD_TYPES} />
          <Input value={couponDiscount} onChange={setCouponDiscount} placeholder="Discount % e.g. 20" />
          <Input value={couponMaxUses} onChange={setCouponMaxUses} placeholder="Max uses e.g. 100" />

          <label className="mt-3 flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={couponAllPaid}
              onChange={(e) => setCouponAllPaid(e.target.checked)}
            />
            Applies to all paid cards
          </label>

          <ButtonRow>
            <ActionButton
              label="Create / Update Coupon"
              loading={loading}
              onClick={() =>
                runTx(
                  async () =>
                    (await getWriteContract()).setCoupon(
                      couponCode,
                      true,
                      Number(selectedType),
                      couponAllPaid,
                      Number(couponDiscount) * 100,
                      Number(couponMaxUses || 0),
                      0
                    ),
                  "Coupon saved"
                )
              }
            />

            <ActionButton
              label="Disable Coupon"
              loading={loading}
              danger
              onClick={() =>
                runTx(
                  async () => (await getWriteContract()).disableCoupon(couponCode),
                  "Coupon disabled"
                )
              }
            />
          </ButtonRow>
        </AdminSection>

        <AdminSection title="Card Status Controls">
          <Input value={tokenId} onChange={setTokenId} placeholder="Token ID" />
          <Select value={status} onChange={setStatus} options={STATUSES} />
          <ActionButton
            label="Update Card Status"
            loading={loading}
            onClick={() =>
              runTx(
                async () =>
                  (await getWriteContract()).setCardStatus(Number(tokenId), Number(status)),
                "Card status updated"
              )
            }
          />
        </AdminSection>

        <AdminSection title="Reserve Mint">
          <Input value={reserveTo} onChange={setReserveTo} placeholder="Recipient wallet address" />
          <Select value={selectedType} onChange={setSelectedType} options={CARD_TYPES} />
          <ActionButton
            label="Reserve Mint"
            loading={loading}
            onClick={() =>
              runTx(
                async () =>
                  (await getWriteContract()).reserveMint(reserveTo, Number(selectedType)),
                "Reserved card minted"
              )
            }
          />
        </AdminSection>

        <AdminSection title="Withdraw">
          <ButtonRow>
            <ActionButton
              label="Withdraw to Owner"
              loading={loading}
              onClick={() =>
                runTx(async () => (await getWriteContract()).withdraw(), "Withdraw complete")
              }
            />
          </ButtonRow>
        </AdminSection>

        <AdminOrders />
      </Container>
    </main>
  );
}

function Stat({ title, value, sub }: any) {
  return (
    <GlassCard className="p-6">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-3 break-all text-2xl font-bold">{value}</p>
      {sub && <p className="mt-2 text-sm text-zinc-500">{sub}</p>}
    </GlassCard>
  );
}

function AdminSection({ title, children }: any) {
  return (
    <GlassCard className="mt-8 p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-6 space-y-4">{children}</div>
    </GlassCard>
  );
}

function Input({ value, onChange, placeholder }: any) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
    />
  );
}

function Select({ value, onChange, options }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-emerald-400"
    >
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function ButtonRow({ children }: any) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function ActionButton({ label, onClick, loading, danger }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`rounded-full px-6 py-4 font-semibold disabled:opacity-50 ${
        danger
          ? "border border-red-400/30 text-red-300 hover:bg-red-500/10"
          : "bg-emerald-400 text-black hover:bg-emerald-300"
      }`}
    >
      {loading ? "Processing..." : label}
    </button>
  );
}