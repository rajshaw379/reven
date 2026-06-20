type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="mb-4 text-sm font-semibold text-emerald-300">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>

      {description && (
        <p className="mt-5 text-base leading-7 text-zinc-400 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}