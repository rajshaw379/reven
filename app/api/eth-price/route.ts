import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { next: { revalidate: 60 } }
    );

    const data = await res.json();

    return NextResponse.json({
      usd: data.ethereum.usd,
    });
  } catch {
    return NextResponse.json({ usd: 0 });
  }
}