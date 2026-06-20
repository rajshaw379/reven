import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Params = {
  userId: string;
  title: string;
  message: string;
};

export async function createTransactionNotification({
  userId,
  title,
  message,
}: Params) {
  const { data: telegram } = await supabaseAdmin
    .from("telegram_accounts")
    .select("telegram_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!telegram) return;

  await supabaseAdmin.from("notifications").insert({
    user_id: userId,
    telegram_id: telegram.telegram_id,
    title,
    message,
    sent: false,
  });
}