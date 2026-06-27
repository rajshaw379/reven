const faqs = [
  ["What is Reven?", "Reven is a crypto card ecosystem built on ETH."],
  ["How does the Free Card work?", "It is free to mint but stays locked until the first reload of $5."],
  ["Can I reload and withdraw from Telegram?", "No. Reload and withdraw happen only through the website dashboard."],
  ["How can I get discount on purchasing cards?", "Apply the coupon code at the time of purchasing to get discount."],
];

export default function FAQ() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="text-3xl font-bold md:text-5xl">FAQ</h2>

      <div className="mt-10 space-y-4">
        {faqs.map(([q, a]) => (
          <details key={q} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <summary className="cursor-pointer font-semibold">{q}</summary>
            <p className="mt-4 text-sm leading-6 text-zinc-400">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}