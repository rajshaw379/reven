import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("physical_card_orders")
    .select(`
      *,
      cards (
        token_id,
        card_type,
        card_holder_name,
        status
      ),
      users (
        username,
        full_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data || [] });
}

export async function PATCH(req: Request) {
  const { orderId, shippingStatus, carrier, trackingNumber } = await req.json();

  if (!orderId) {
    return NextResponse.json({ error: "Order ID required." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("physical_card_orders")
    .update({
      shipping_status: shippingStatus,
      carrier,
      tracking_number: trackingNumber,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}