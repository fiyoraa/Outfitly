"use client";

import { useState } from "react";
import AIResultPanel from "@/components/AIResultPanel";
import ChipSelector from "@/components/ChipSelector";
import ColorPicker from "@/components/ColorPicker";

type GeneratePayload = {
  gender: string;
  mood: string[];
  occasion: string[];
  weather: string[];
  style: string[];
  favoriteColor: string;
};

type GenerateResultData = {
  outfit: string;
  items: string[];
  tips: string;
  images: string[];
};

type SavedOutfit = {
  outfit: string;
  items: string[];
  tips: string;
  images: string[];
  timestamp: string;
};

const moodOptions = ["Kalem", "Percaya diri", "Playful", "Bold", "Clean", "Moody", "Galau"];
const occasionOptions = [
  "Hangout",
  "Date malam",
  "Ngampus",
  "Kantor",
  "Wedding",
  "Staycation",
  "Kondangan",
  "Nongkrong cafe",
];
const weatherOptions = ["Panas banget", "Berangin", "Mendung", "Hujan", "Dingin", "Normal"];
const styleOptions = [
  "Casual",
  "Streetwear",
  "Minimalist",
  "Soft girl",
  "Korean",
  "Chic",
  "Cottagecore",
  "Old money",
  "Y2K",
];
const genderOptions = ["Perempuan", "Laki-laki"];
const favoriteColorOptions = [
  { label: "Blush Pink", value: "#d4537e" },
  { label: "Cream", value: "#f5eee6" },
  { label: "Soft Gray", value: "#d7d5d8" },
  { label: "Mocha", value: "#9f8679" },
  { label: "Sky Blue", value: "#9dbcd4" },
  { label: "Olive", value: "#8a9968" },
  { label: "Sage Green", value: "#9caf88" },
  { label: "Terracotta", value: "#c76d4e" },
  { label: "Navy", value: "#1f355d" },
];

const STORAGE_KEY = "outfitly-gallery";

export default function GeneratePage() {
  const [gender, setGender] = useState<string>("");
  const [mood, setMood] = useState<string[]>([]);
  const [occasion, setOccasion] = useState<string[]>([]);
  const [weather, setWeather] = useState<string[]>([]);
  const [style, setStyle] = useState<string[]>([]);
  const [favoriteColor, setFavoriteColor] = useState<string>("#d4537e");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [toast, setToast] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const parseResultData = (raw: string): GenerateResultData | null => {
    try {
      const parsed = JSON.parse(raw) as Partial<GenerateResultData>;

      return {
        outfit: typeof parsed.outfit === "string" ? parsed.outfit : "",
        items:
          Array.isArray(parsed.items) && parsed.items.every((item) => typeof item === "string")
            ? parsed.items
            : [],
        tips: typeof parsed.tips === "string" ? parsed.tips : "",
        images:
          Array.isArray(parsed.images) && parsed.images.every((item) => typeof item === "string")
            ? parsed.images
            : [],
      };
    } catch {
      return null;
    }
  };

  const buildPayload = (): GeneratePayload => ({
    gender,
    mood,
    occasion,
    weather,
    style,
    favoriteColor,
  });

  const handleGenerate = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(buildPayload()),
      });

      const data = (await response.json()) as {
        outfit?: string;
        items?: string[];
        tips?: string;
        images?: string[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Gagal generate outfit.");
      }

      const normalizedResult: GenerateResultData = {
        outfit: typeof data.outfit === "string" ? data.outfit : "",
        items:
          Array.isArray(data.items) && data.items.every((item) => typeof item === "string")
            ? data.items
            : [],
        tips: typeof data.tips === "string" ? data.tips : "",
        images:
          Array.isArray(data.images) && data.images.every((image) => typeof image === "string")
            ? data.images
            : [],
      };

      setResult(JSON.stringify(normalizedResult));
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Terjadi masalah saat generate outfit.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToGallery = () => {
    if (!result) {
      setError("Generate dulu outfit-nya sebelum disimpan ke gallery.");
      return;
    }

    const parsedResult = parseResultData(result);

    if (!parsedResult || !parsedResult.outfit) {
      setError("Hasil AI belum valid untuk disimpan.");
      return;
    }

    setError("");

    const newItem: SavedOutfit = {
      outfit: parsedResult.outfit,
      items: parsedResult.items,
      tips: parsedResult.tips,
      images: parsedResult.images,
      timestamp: new Date().toISOString(),
    };

    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as SavedOutfit[]) : [];
    const next = [newItem, ...parsed];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setToast("Outfit tersimpan!");
    window.setTimeout(() => setToast(""), 1800);
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl leading-tight text-[#1A1A1A] sm:text-5xl">
          Outfit Generator
        </h1>
        <p className="max-w-2xl text-base text-[#666666]">
          Isi preferensi kamu dulu, lalu klik Generate sekarang untuk dapetin rekomendasi outfit dari AI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="h-fit rounded-2xl border border-[#E8E4E0] bg-white p-6 lg:sticky lg:top-24">
          <div className="space-y-5">
            <ChipSelector
              label="Gender"
              options={genderOptions}
              selected={gender ? [gender] : []}
              onChange={(nextSelected) => {
                const lastSelected = nextSelected[nextSelected.length - 1] || "";
                setGender(lastSelected);
              }}
              allowManualInput={false}
            />
            <ChipSelector label="Mood" options={moodOptions} selected={mood} onChange={setMood} />
            <ChipSelector
              label="Occasion"
              options={occasionOptions}
              selected={occasion}
              onChange={setOccasion}
            />
            <ChipSelector label="Weather" options={weatherOptions} selected={weather} onChange={setWeather} />
            <ChipSelector label="Style Preference" options={styleOptions} selected={style} onChange={setStyle} />
            <ColorPicker
              selected={favoriteColor}
              onChange={setFavoriteColor}
              options={favoriteColorOptions}
            />

            <div className="space-y-3 border-t border-[#E8E4E0] pt-5">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full rounded-full bg-[#D4537E] px-6 py-3 text-sm font-medium text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#c1476f] hover:shadow-lg"
              >
                {isLoading ? "Generating..." : "Generate sekarang"}
              </button>

              <button
                type="button"
                onClick={handleSaveToGallery}
                className="w-full rounded-full border border-[#D4537E] px-6 py-3 text-sm font-medium text-[#D4537E] transition-all duration-200 hover:bg-[#F5F3F0]"
              >
                Simpan ke gallery
              </button>
            </div>

            {error ? <p className="text-sm text-[#c1476f] font-medium">{error}</p> : null}
            {toast ? <p className="text-sm text-[#2d7a45] font-medium">{toast}</p> : null}
          </div>
        </div>

        <AIResultPanel result={result} />
      </div>
    </section>
  );
}
