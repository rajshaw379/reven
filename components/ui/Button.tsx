type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  children,
  href = "#",
  variant = "primary",
  className = "",
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-emerald-400 text-black hover:bg-emerald-300"
      : "border border-white/15 text-white hover:bg-white/10";

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-6 py-4 font-semibold transition ${styles} ${className}`}
    >
      {children}
    </a>
  );
}