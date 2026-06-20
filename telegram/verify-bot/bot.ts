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

bot.start(async (ctx) => {
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  const telegramId = String(ctx.from.id);
  const telegramUsername = ctx.from.username || null;

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  await supabase
  .from("verification_sessions")
  .update({
    status: "expired",
  })
  .eq("telegram_id", telegramId)
  .eq("status", "pending");

  const { error } = await supabase.from("verification_sessions").insert({
  session_type: "signup",
  flow_type: "signup",
    telegram_id: telegramId,
    telegram_username: telegramUsername,
    otp_hash: otpHash,
    status: "pending",
    expires_at: expiresAt,
  });

  if (error) {
  console.error("Supabase error:", error);
  await ctx.reply("Something went wrong. Please try again.");
  return;
}

  const username = telegramUsername
  ? telegramUsername
  : `tg_${telegramId}`;

await ctx.reply(
`✅ Welcome to Reven

Your OTP:

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

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

console.log("🤖 Reven Verify Bot is running...");