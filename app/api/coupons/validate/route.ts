import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { code, cardType, priceEth } = await req.json();

    if (!code || !cardType || priceEth === undefined) {
      return NextResponse.json(
        { error: "Missing coupon data." },
        { status: 400 }
      );
    }

    const normalizedCode = String(code).trim().toUpperCase();

    const { data: coupon, error } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .eq("code", normalizedCode)
      .eq("active", true)
      .maybeSingle();

    if (error || !coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code." },
        { status: 404 }
      );
    }

    if (coupon.card_type !== "all" && coupon.card_type !== cardType) {
      return NextResponse.json(
        { error: "This coupon is not valid for this card." },
        { status: 400 }
      );
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "This coupon has expired." },
        { status: 400 }
      );
    }

    if (
      coupon.max_uses !== null &&
      Number(coupon.used_count || 0) >= Number(coupon.max_uses)
    ) {
      return NextResponse.json(
        { error: "This coupon has reached its usage limit." },
        { status: 400 }
      );
    }

    const originalPrice = Number(priceEth);
    let discountEth = 0;

    if (coupon.discount_type === "percent") {
      discountEth = originalPrice * (Number(coupon.discount_value) / 100);
    }

    if (coupon.discount_type === "fixed") {
      discountEth = Number(coupon.discount_value);
    }

    const finalPrice = Math.max(originalPrice - discountEth, 0);

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: Number(coupon.discount_value),
      discountEth,
      finalPriceEth: finalPrice,
    });
  } catch {
    return NextResponse.json(
      { error: "Coupon validation failed." },
      { status: 500 }
    );
  }
}