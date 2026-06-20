import "dotenv/config";
import { Telegraf, Markup } from "telegraf";
import { createClient } from "@supabase/supabase-js";

const bot = new Telegraf(process.env.BOT_TOKEN!);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🏠 Dashboard", "dashboard")],
    [
      Markup.button.callback("💰 Balance", "balance"),
      Markup.button.callback("💳 Cards", "cards"),
    ],
    [Markup.button.callback("📜 Transactions", "transactions")],
    [
      Markup.button.callback("🔒 Freeze", "freeze"),
      Markup.button.callback("🔓 Unfreeze", "unfreeze"),
    ],
  ]);
}

async function getUserByTelegramId(telegramId: string) {
  const { data, error } = await supabase
    .from("telegram_accounts")
    .select("user_id, telegram_username, users(id, username, full_name)")
    .eq("telegram_id", telegramId)
    .eq("verified", true)
    .single();

  if (error || !data) return null;

  return data;
}

bot.start(async (ctx) => {
  const telegramId = String(ctx.from.id);
  const account = await getUserByTelegramId(telegramId);

  if (!account) {
    await ctx.reply(
      "❌ Your Telegram is not linked yet.\n\nPlease signup on the Reven website first using Reven Verify Bot."
    );
    return;
  }

  const user: any = account.users;

  await ctx.reply(
    `👋 Welcome to Reven Card Bot, ${user.full_name}.\n\nYour account is linked successfully.`,
    mainMenu()
  );
});

bot.action("dashboard", async (ctx) => {
  await ctx.answerCbQuery();

  const telegramId = String(ctx.from.id);

  const { data: account, error } = await supabase
    .from("telegram_accounts")
    .select(`
      user_id,
      users (
        id,
        username,
        full_name
      )
    `)
    .eq("telegram_id", telegramId)
    .single();

  if (error || !account) {
    await ctx.reply("❌ Account not found.");
    return;
  }

  const user: any = account.users;

  const { count: cardCount } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", account.user_id);

  const { data: wallet } = await supabase
    .from("wallets")
    .select("wallet_address")
    .eq("user_id", account.user_id)
    .eq("is_primary", true)
    .maybeSingle();

  const walletAddress = wallet?.wallet_address
    ? `${wallet.wallet_address.slice(0, 6)}...${wallet.wallet_address.slice(-4)}`
    : "Not Connected";

  await ctx.reply(
`🏦 Reven Dashboard

👤 ${user.full_name}

🆔 ${user.username}

💳 Cards : ${cardCount ?? 0}

👛 Wallet :
${walletAddress}

🟢 Status : Active`
  );
});

bot.action("balance", async (ctx) => {
  await ctx.answerCbQuery();

  const telegramId = String(ctx.from.id);

  const { data: account } = await supabase
    .from("telegram_accounts")
    .select("user_id")
    .eq("telegram_id", telegramId)
    .single();

  if (!account) {
    await ctx.reply("❌ Account not linked.");
    return;
  }

  const { data: card } = await supabase
    .from("cards")
    .select("id, card_type, status")
    .eq("user_id", account.user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!card) {
    await ctx.reply(
`💰 Reven Balance

No card found.

Mint your first card from the Reven website.`
    );
    return;
  }

  const { data: balance } = await supabase
    .from("card_balances")
    .select("balance_eth, locked, updated_at")
    .eq("card_id", card.id)
    .maybeSingle();

  await ctx.reply(
`💰 Reven Balance

💳 Card
${card.card_type}

📍 Status
${card.status}

💎 Available Balance
${balance?.balance_eth ?? 0} ETH

🔒 Locked
${balance?.locked ? "Yes" : "No"}

🕒 Updated
${balance?.updated_at ? new Date(balance.updated_at).toLocaleString() : "Not available"}`
  );
});

bot.action("cards", async (ctx) => {
  await ctx.answerCbQuery();

  const telegramId = String(ctx.from.id);

  // Find linked account
  const { data: account, error: accountError } = await supabase
    .from("telegram_accounts")
    .select("user_id")
    .eq("telegram_id", telegramId)
    .single();

  if (accountError || !account) {
    await ctx.reply("❌ Account not linked.");
    return;
  }

  // Get the latest card
  const { data: card } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", account.user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!card) {
    await ctx.reply(
`💳 My Card

You don't have any card yet.

Visit the Reven website and mint your first card.`
    );
    return;
  }

  const wallet =
    card.wallet_address.length > 12
      ? `${card.wallet_address.slice(0, 6)}...${card.wallet_address.slice(-4)}`
      : card.wallet_address;

  await ctx.reply(
`💳 Reven Card

🆔 Token ID
${card.token_id ?? "Not Minted"}

🎖 Card Type
${card.card_type}

📍 Status
${card.status}

👛 Wallet
${wallet}

🔗 Telegram Linked
${card.telegram_linked ? "✅ Yes" : "❌ No"}

📅 Created
${new Date(card.created_at).toLocaleDateString()}`
  );
});

bot.action("transactions", async (ctx) => {
  await ctx.answerCbQuery();

  const telegramId = String(ctx.from.id);

  const { data: account } = await supabase
    .from("telegram_accounts")
    .select("user_id")
    .eq("telegram_id", telegramId)
    .single();

  if (!account) {
    await ctx.reply("❌ Account not linked.");
    return;
  }

  const { data: cards } = await supabase
    .from("cards")
    .select("id")
    .eq("user_id", account.user_id);

  if (!cards || cards.length === 0) {
    await ctx.reply(
`📜 Transactions

No card found.

Mint your first card from the Reven website.`
    );
    return;
  }

  const cardIds = cards.map((card) => card.id);

  const { data: transactions } = await supabase
    .from("transactions")
    .select("transaction_type, amount_eth, tx_hash, status, created_at")
    .in("card_id", cardIds)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!transactions || transactions.length === 0) {
    await ctx.reply(
`📜 Transactions

No transactions found yet.`
    );
    return;
  }

  const text = transactions
    .map((tx, index) => {
      const statusIcon = tx.status === "completed" ? "🟢" : "🟡";
      const shortHash = tx.tx_hash
        ? `${tx.tx_hash.slice(0, 8)}...${tx.tx_hash.slice(-6)}`
        : "No hash";

      return `${index + 1}. ${statusIcon} ${tx.transaction_type}

Amount: ${tx.amount_eth ?? 0} ETH
Status: ${tx.status}
Tx: ${shortHash}
Date: ${new Date(tx.created_at).toLocaleString()}`;
    })
    .join("\n\n");

  await ctx.reply(`📜 Recent Transactions\n\n${text}`);
});

bot.action("freeze", async (ctx) => {
  await ctx.answerCbQuery();

  const telegramId = String(ctx.from.id);

  const { data: account } = await supabase
    .from("telegram_accounts")
    .select("user_id")
    .eq("telegram_id", telegramId)
    .single();

  if (!account) {
    await ctx.reply("❌ Account not linked.");
    return;
  }

  const { data: card } = await supabase
    .from("cards")
    .select("id,status")
    .eq("user_id", account.user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!card) {
    await ctx.reply("❌ No card found.");
    return;
  }

  if (card.status === "frozen") {
    await ctx.reply("🔒 Your card is already frozen.");
    return;
  }

  await supabase
    .from("cards")
    .update({ status: "frozen" })
    .eq("id", card.id);

  await ctx.reply("✅ Your card has been frozen successfully.");
});

bot.action("unfreeze", async (ctx) => {
  await ctx.answerCbQuery();

  const telegramId = String(ctx.from.id);

  const { data: account } = await supabase
    .from("telegram_accounts")
    .select("user_id")
    .eq("telegram_id", telegramId)
    .single();

  if (!account) {
    await ctx.reply("❌ Account not linked.");
    return;
  }

  const { data: card } = await supabase
    .from("cards")
    .select("id,status")
    .eq("user_id", account.user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!card) {
    await ctx.reply("❌ No card found.");
    return;
  }

  if (card.status === "active") {
    await ctx.reply("✅ Your card is already active.");
    return;
  }

  await supabase
    .from("cards")
    .update({ status: "active" })
    .eq("id", card.id);

  await ctx.reply("🎉 Your card has been activated.");
});

async function sendPendingNotifications() {
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("id, telegram_id, title, message")
    .eq("sent", false)
    .limit(10);

  if (error || !notifications) return;

  for (const notification of notifications) {
    try {
      await bot.telegram.sendMessage(
        notification.telegram_id,
        `🔔 ${notification.title}\n\n${notification.message}`
      );

      await supabase
        .from("notifications")
        .update({ sent: true })
        .eq("id", notification.id);
    } catch (err) {
      console.error("Notification send failed:", err);
    }
  }
}

setInterval(sendPendingNotifications, 10000);

bot.launch();

console.log("💳 Reven Card Bot is running...");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));