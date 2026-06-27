import { NextResponse } from "next/server";
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

  const { data: telegram } = await supabaseAdmin
    .from("telegram_accounts")
    .select("telegram_id, telegram_username")
    .eq("user_id", user.id)
    .eq("verified", true)
    .maybeSingle();

  if (!telegram) {
    return NextResponse.json(
      { error: "No linked Telegram account found." },
      { status: 400 }
    );
  }

  await supabaseAdmin
    .from("verification_sessions")
    .update({ status: "expired" })
    .eq("user_id", user.id)
    .eq("flow_type", "password_reset")
    .eq("status", "pending");

  await supabaseAdmin.from("verification_sessions").insert({
    session_type: "password_reset",
    flow_type: "password_reset",
    user_id: user.id,
    telegram_id: telegram.telegram_id,
    telegram_username: telegram.telegram_username,
    status: "pending",
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  });

  return NextResponse.json({ success: true });
}