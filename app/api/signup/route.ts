import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { username, fullName, password, otp } = await req.json();

    if (!username || !fullName || !password || !otp) {
      return NextResponse.json(
        { error: "Username, full name, password, and OTP are required." },
        { status: 400 }
      );
    }

    const { data: sessions, error: sessionError } = await supabaseAdmin
      .from("verification_sessions")
      .select("*")
      .eq("flow_type", "signup")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(10);

    if (sessionError || !sessions || sessions.length === 0) {
      return NextResponse.json(
        { error: "No valid Telegram OTP found. Please start the bot first." },
        { status: 400 }
      );
    }

    let matchedSession = null;

    for (const session of sessions) {
      const isValidOtp = await bcrypt.compare(otp, session.otp_hash);

      if (isValidOtp && new Date(session.expires_at) > new Date()) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      return NextResponse.json(
        { error: "Invalid or expired Telegram OTP." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .insert({
        username,
        full_name: fullName,
        password_hash: passwordHash,
        status: "active",
        telegram_id: matchedSession.telegram_id,
        telegram_username: matchedSession.telegram_username,
      })
      .select()
      .single();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    await supabaseAdmin
      .from("verification_sessions")
      .update({
        status: "verified",
        verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq("id", matchedSession.id);

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Signup failed." }, { status: 500 });
  }
}