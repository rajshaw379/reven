import "dotenv/config";
import { Telegraf } from "telegraf";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const bot = new Telegraf(process.env.BOT_TOKEN!);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createOtp({
  telegramId,
  telegramUsername,
  flowType,
  userId = null,
}: {
  telegramId: string;
  telegramUsername: string | null;
  flowType: "signup" | "password_reset";
  userId?: string | null;
}) {
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await supabase
    .from("verification_sessions")
    .update({ status: "expired" })
    .eq("telegram_id", telegramId)
    .eq("flow_type", flowType)
    .eq("status", "pending");

  const { error } = await supabase.from("verification_sessions").insert({
    session_type: flowType,
    flow_type: flowType,
    user_id: userId,
    telegram_id: telegramId,
    telegram_username: telegramUsername,
    otp_hash: otpHash,
    status: "pending",
    expires_at: expiresAt,
  });

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  return otp;
}

bot.start(async (ctx) => {
  const telegramId = String(ctx.from.id);
  const telegramUsername = ctx.from.username || null;

  const { data: resetSession } = await supabase
    .from("verification_sessions")
    .select("id, user_id, expires_at")
    .eq("telegram_id", telegramId)
    .eq("flow_type", "password_reset")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (resetSession && new Date(resetSession.expires_at) > new Date()) {
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await supabase
      .from("verification_sessions")
      .update({ otp_hash: otpHash })
      .eq("id", resetSession.id);

    await ctx.reply(
`🔐 Reven Password Reset

Your reset code:

${otp}

Go back to the website and enter:
• Username
• Reset Code
• New Password

This code expires in 10 minutes.`
    );

    return;
  }

  const otp = await createOtp({
    telegramId,
    telegramUsername,
    flowType: "signup",
  });

  const username = telegramUsername ? telegramUsername : `tg_${telegramId}`;

  await ctx.reply(
`✅ Welcome to Reven

Your signup OTP:

${otp}

Your Reven username will be:

${username}

Go back to the website.

Enter:
• Full Name
• Password
• OTP

No username is required.

This OTP expires in 10 minutes.`
  );
});

bot.command("reset", async (ctx) => {
  const telegramId = String(ctx.from.id);
  const telegramUsername = ctx.from.username || null;

  const { data: resetSession } = await supabase
    .from("verification_sessions")
    .select("id, user_id, expires_at")
    .eq("telegram_id", telegramId)
    .eq("flow_type", "password_reset")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!resetSession || new Date(resetSession.expires_at) <= new Date()) {
    await ctx.reply(
      "❌ No active password reset request found. Please start from the website."
    );
    return;
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  await supabase
    .from("verification_sessions")
    .update({ otp_hash: otpHash })
    .eq("id", resetSession.id);

  await ctx.reply(
`🔐 Reven Password Reset

Your reset code:

${otp}

Go back to the website and enter:
• Username
• Reset Code
• New Password

This code expires in 10 minutes.`
  );
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

console.log("🤖 Reven Verify Bot is running...");