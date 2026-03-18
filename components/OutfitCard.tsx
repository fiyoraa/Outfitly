type OutfitCardProps = {
  title: string;
  description: string;
  occasion: string;
  vibeTag: string;
  colors: string[];
};

export default function OutfitCard({
  title,
  description,
  occasion,
  vibeTag,
  colors,
}: OutfitCardProps) {
  return (
    <article className="group rounded-2xl border border-[#E8E4E0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-3">
          <p className="inline-flex rounded-full border border-[#E8E4E0] bg-[#F5F3F0] px-3 py-1 text-xs font-medium text-[#D4537E]">
            {occasion}
          </p>
          <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">{title}</h3>
        </div>
        <span className="rounded-full bg-[#F5F3F0] px-3 py-1 text-xs text-[#666666]">{vibeTag}</span>
      </div>

      <p className="text-sm leading-relaxed text-[#666666]">{description}</p>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#E8E4E0] pt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-[#999999]">Color Palette</p>
        <div className="flex items-center gap-2">
          {colors.map((hex) => (
            <span
              key={hex}
              className="h-5 w-5 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: hex }}
              title={hex}
              aria-label={hex}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
