import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { username } = await req.json();

  if (!username) {
    return NextResponse.json({ error: "Username required." }, { status: 400 });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, username")
    .eq("username", username)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const otpHash = await bcrypt.hash(otp, 10);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await supabaseAdmin.from("verification_sessions").insert({
    user_id: user.id,
    flow_type: "password_reset",
    status: "pending",
    otp_hash: otpHash,
    expires_at: expiresAt,
  });

  return NextResponse.json({
    success: true,
    message: "Reset code requested. Open Reven Verify Bot.",
  });
}