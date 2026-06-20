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

  await ctx.reply(
    `Welcome to Reven ✅\n\nYour signup OTP is:\n\n${otp}\n\nThis code expires in 10 minutes.`
  );
});

bot.launch();

console.log("🤖 Reven Verify Bot is running...");