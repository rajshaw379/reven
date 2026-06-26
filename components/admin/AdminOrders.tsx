"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();

    setOrders(data.orders || []);
    setLoading(false);
  }

  async function updateOrder(order: any) {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        shippingStatus: order.shipping_status,
        carrier: order.carrier,
        trackingNumber: order.tracking_number,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Update failed.");
      return;
    }

    alert("Order updated.");
    loadOrders();
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <GlassCard className="mt-8 p-6">
      <h2 className="text-2xl font-bold">Physical Orders</h2>

      {loading ? (
        <p className="mt-4 text-zinc-400">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-zinc-400">No physical orders yet.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-white/10 bg-black p-5"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-zinc-500">Customer</p>
                  <p className="mt-1 font-semibold">
                    {order.users?.full_name || "Unknown"}
                  </p>
                  <p className="text-sm text-zinc-400">
                    @{order.users?.username || "unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Card</p>
                  <p className="mt-1 font-semibold">
                    Token #{order.cards?.token_id}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {order.cards?.card_holder_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Receiver</p>
                  <p className="mt-1 font-semibold">{order.shipping_name}</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 p-4 text-sm text-zinc-300">
                {order.shipping_address}
                <br />
                {order.shipping_city}, {order.shipping_state}
                <br />
                {order.shipping_country} {order.shipping_postal_code}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <select
                  value={order.shipping_status || "preparing"}
                  onChange={(e) =>
                    setOrders((prev) =>
                      prev.map((item) =>
                        item.id === order.id
                          ? { ...item, shipping_status: e.target.value }
                          : item
                      )
                    )
                  }
                  className="rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
                >
                  <option value="preparing">Preparing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <input
                  value={order.carrier || ""}
                  onChange={(e) =>
                    setOrders((prev) =>
                      prev.map((item) =>
                        item.id === order.id
                          ? { ...item, carrier: e.target.value }
                          : item
                      )
                    )
                  }
                  placeholder="Carrier"
                  className="rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
                />

                <input
                  value={order.tracking_number || ""}
                  onChange={(e) =>
                    setOrders((prev) =>
                      prev.map((item) =>
                        item.id === order.id
                          ? { ...item, tracking_number: e.target.value }
                          : item
                      )
                    )
                  }
                  placeholder="Tracking number"
                  className="rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
                />
              </div>

              <button
                onClick={() => updateOrder(order)}
                className="mt-5 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-black hover:bg-emerald-300"
              >
                Save Order
              </button>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}