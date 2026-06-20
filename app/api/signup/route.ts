import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { fullName, password, otp } = await req.json();

    if (!fullName || !password || !otp) {
  return NextResponse.json(
    { error: "Full name, password and OTP are required." },
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

    const username =
  matchedSession.telegram_username?.trim()
    ? matchedSession.telegram_username
    : `tg_${matchedSession.telegram_id}`;

    const { data: usernameExists } = await supabaseAdmin
  .from("users")
  .select("id")
  .eq("username", username)
  .maybeSingle();

if (usernameExists) {
  return NextResponse.json(
    {
      error:
        "Your Telegram username is already being used. Please change your Telegram username and try again.",
    },
    { status: 400 }
  );
}

    const { data: existingTelegram } = await supabaseAdmin
  .from("telegram_accounts")
  .select("id")
  .eq("telegram_id", matchedSession.telegram_id)
  .maybeSingle();

if (existingTelegram) {
  return NextResponse.json(
    {
      error: "This Telegram account is already registered.",
    },
    { status: 400 }
  );
}

    const passwordHash = await bcrypt.hash(password, 10);

// Create the user
const { data: user, error: userError } = await supabaseAdmin
  .from("users")
  .insert({
    username,
    full_name: fullName,
    password_hash: passwordHash,
  })
  .select()
  .single();

if (userError) {
  return NextResponse.json(
    { error: userError.message },
    { status: 400 }
  );
}

// Link the Telegram account
const { error: telegramError } = await supabaseAdmin
  .from("telegram_accounts")
  .insert({
    user_id: user.id,
    telegram_id: matchedSession.telegram_id,
    telegram_username: matchedSession.telegram_username,
    verified: true,
  });

if (telegramError) {
  return NextResponse.json(
    { error: telegramError.message },
    { status: 400 }
  );
}

// Mark OTP as used
await supabaseAdmin
  .from("verification_sessions")
  .update({
    verified: true,
  })
  .eq("id", matchedSession.id);

return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Signup failed." }, { status: 500 });
  }
}