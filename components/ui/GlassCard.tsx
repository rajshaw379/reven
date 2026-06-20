type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}