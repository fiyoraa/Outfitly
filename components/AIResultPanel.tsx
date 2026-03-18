type AIResultPanelProps = {
  result: string;
};

type ParsedResult = {
  outfit: string;
  items: string[];
  tips: string;
  images: string[];
};

const parseResult = (raw: string): ParsedResult | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ParsedResult>;

    return {
      outfit: typeof parsed.outfit === "string" ? parsed.outfit : "",
      items:
        Array.isArray(parsed.items) && parsed.items.every((item) => typeof item === "string")
          ? parsed.items
          : [],
      tips: typeof parsed.tips === "string" ? parsed.tips : "",
      images:
        Array.isArray(parsed.images) && parsed.images.every((item) => typeof item === "string")
          ? parsed.images.slice(0, 4)
          : [],
    };
  } catch {
    return null;
  }
};

export default function AIResultPanel({ result }: AIResultPanelProps) {
  const parsed = parseResult(result);

  return (
    <section className="rounded-2xl border border-[#E8E4E0] bg-white p-6">
      <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">AI Recommendation</h3>

      {!result ? (
        <p className="mt-4 text-sm text-[#999999]">
          Hasil rekomendasi akan tampil di sini setelah kamu klik Generate sekarang.
        </p>
      ) : parsed ? (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {parsed.images.map((imageUrl) => (
              <img
                key={imageUrl}
                src={imageUrl}
                alt="Outfit inspiration"
                className="aspect-square w-full rounded-xl object-cover"
                loading="lazy"
              />
            ))}
          </div>

          <div className="space-y-4 border-t border-[#E8E4E0] pt-5">
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">Outfit Combo</p>
              <p className="mt-2 text-sm leading-relaxed text-[#666666]">{parsed.outfit}</p>
            </div>

            <div className="border-t border-[#E8E4E0] pt-4">
              <p className="text-sm font-semibold text-[#1A1A1A]">Items</p>
              <ul className="mt-2 space-y-1 text-sm text-[#666666]">
                {parsed.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4537E] mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#E8E4E0] pt-4">
              <p className="text-sm font-semibold text-[#1A1A1A]">Style Tips</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#666666]">{parsed.tips}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#666666]">{result}</p>
      )}
    </section>
  );
}
