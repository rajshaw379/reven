import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { username, otp, newPassword } = await req.json();

  if (!username || !otp || !newPassword) {
    return NextResponse.json(
      { error: "Username, reset code and new password required." },
      { status: 400 }
    );
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const { data: sessions } = await supabaseAdmin
    .from("verification_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("flow_type", "password_reset")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(10);

  if (!sessions || sessions.length === 0) {
    return NextResponse.json({ error: "No reset code found." }, { status: 400 });
  }

  let matchedSession: any = null;

  for (const session of sessions) {
    const valid = await bcrypt.compare(otp, session.otp_hash);

    if (valid && new Date(session.expires_at) > new Date()) {
      matchedSession = session;
      break;
    }
  }

  if (!matchedSession) {
    return NextResponse.json({ error: "Invalid or expired reset code." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await supabaseAdmin
    .from("users")
    .update({ password_hash: passwordHash })
    .eq("id", user.id);

  await supabaseAdmin
    .from("verification_sessions")
    .update({ status: "used", verified: true })
    .eq("id", matchedSession.id);

  return NextResponse.json({ success: true });
}