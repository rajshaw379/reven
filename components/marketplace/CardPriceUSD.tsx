"use client";

import { useEffect, useState } from "react";

export default function CardPriceUSD({ priceEth }: { priceEth: number }) {
  const [usd, setUsd] = useState<string>("");

  useEffect(() => {
    async function loadPrice() {
      if (priceEth === 0) {
        setUsd("Free");
        return;
      }

      const res = await fetch("/api/eth-price");
      const data = await res.json();

      const value = priceEth * Number(data.usd || 0);
      setUsd(`$${value.toFixed(2)}`);
    }

    loadPrice();
  }, [priceEth]);

  return <span>{usd || "Loading..."}</span>;
}