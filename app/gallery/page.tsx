"use client";

import { useEffect, useState } from "react";

type GalleryResult = {
  outfit: string;
  items: string[];
  tips: string;
  images: string[];
  timestamp: string;
};

type GalleryEntry = {
  id: string;
  data: GalleryResult;
};

const STORAGE_KEY = "outfitly-gallery";

export default function GalleryPage() {
  const [entries, setEntries] = useState<GalleryEntry[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const saved = raw ? (JSON.parse(raw) as Partial<GalleryResult>[]) : [];

    const parsedEntries = saved
      .map((item) => {
        const parsed: GalleryResult = {
          outfit: typeof item.outfit === "string" ? item.outfit : "",
          items:
            Array.isArray(item.items) && item.items.every((entry) => typeof entry === "string")
              ? item.items
              : [],
          tips: typeof item.tips === "string" ? item.tips : "",
          images:
            Array.isArray(item.images) && item.images.every((url) => typeof url === "string")
              ? item.images.slice(0, 4)
              : [],
          timestamp: typeof item.timestamp === "string" ? item.timestamp : "",
        };

        if (!parsed.outfit) {
          return null;
        }

        return {
          id: `${parsed.timestamp}-${parsed.outfit}`,
          data: parsed,
        };
      })
      .filter((item): item is GalleryEntry => item !== null);

    setEntries(parsedEntries);
  }, []);

  const handleDelete = (id: string) => {
    const next = entries.filter((entry) => entry.id !== id);
    setEntries(next);

    const savedForStorage = next.map((entry) => entry.data);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedForStorage));
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl leading-tight text-[#1A1A1A] sm:text-5xl">
          Outfit Gallery
        </h1>
        <p className="text-base text-[#666666]">Koleksi outfit yang pernah kamu simpan dari hasil AI.</p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-[#E8E4E0] bg-[#F5F3F0] p-8 text-center">
          <p className="text-sm text-[#666666]">Belum ada outfit tersimpan. Coba generate dulu!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="group overflow-hidden rounded-2xl border border-[#E8E4E0] bg-white transition-all duration-300 hover:shadow-xl hover:border-[#D4537E]"
            >
              <div className="relative overflow-hidden bg-[#F5F3F0]">
                <div className="grid grid-cols-2 gap-1">
                  {entry.data.images.slice(0, 4).map((imageUrl, idx) => (
                    <img
                      key={imageUrl}
                      src={imageUrl}
                      alt="Saved outfit"
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4 p-5">
                <p className="text-xs text-[#999999]">
                  {entry.data.timestamp
                    ? new Date(entry.data.timestamp).toLocaleString("id-ID")
                    : "Waktu simpan tidak tersedia"}
                </p>

                <div className="border-t border-[#E8E4E0] pt-4">
                  <p className="text-sm font-semibold text-[#1A1A1A]">Outfit Combo</p>
                  <p className="mt-1 text-sm text-[#666666] line-clamp-2">{entry.data.outfit}</p>
                </div>

                <div className="border-t border-[#E8E4E0] pt-4">
                  <p className="text-sm font-semibold text-[#1A1A1A]">Items</p>
                  <ul className="mt-1 space-y-1 text-sm text-[#666666]">
                    {entry.data.items.slice(0, 2).map((item) => (
                      <li key={item} className="line-clamp-1">
                        • {item}
                      </li>
                    ))}
                    {entry.data.items.length > 2 && (
                      <li className="text-xs text-[#999999]">+{entry.data.items.length - 2} more</li>
                    )}
                  </ul>
                </div>

                <div className="border-t border-[#E8E4E0] pt-4">
                  <p className="text-sm font-semibold text-[#1A1A1A]">Style Tips</p>
                  <p className="mt-1 line-clamp-2 text-sm text-[#666666]">{entry.data.tips}</p>
                </div>
              </div>

              <div className="border-t border-[#E8E4E0] p-5">
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  className="w-full rounded-full border border-[#D4537E] px-4 py-2.5 text-sm font-medium text-[#D4537E] transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-[#F5F3F0]"
                >
                  Hapus
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
              <div className="mb-4 grid grid-cols-2 gap-2">
                {entry.data.images.map((imageUrl) => (
                  <img
                    key={imageUrl}
                    src={imageUrl}
                    alt="Saved outfit"
                    className="aspect-[3/4] w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[#8a7b80]">
                  {entry.data.timestamp
                    ? new Date(entry.data.timestamp).toLocaleString("id-ID")
                    : "Waktu simpan tidak tersedia"}
                </p>
                <div>
                  <p className="text-sm font-semibold text-[#2f2a2b]">Outfit Combo</p>
                  <p className="text-sm text-[#534a4d]">{entry.data.outfit}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#2f2a2b]">Items</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-[#534a4d]">
                    {entry.data.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#2f2a2b]">Style Tips</p>
                  <p className="whitespace-pre-wrap text-sm text-[#534a4d]">{entry.data.tips}</p>
                </div>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  className="rounded-full border border-[#d4537e] px-4 py-2 text-sm font-medium text-[#8a2f4f]"
                >
                  Hapus
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
