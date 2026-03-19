"use client";

import { useState } from "react";
import AIResultPanel from "@/components/AIResultPanel";
import ChipSelector from "@/components/ChipSelector";

type PersonInput = {
  gender: string;
  mood: string[];
  occasion: string[];
  weather: string[];
  style: string[];
};

type CoupleApiResponse = {
  person1?: {
    outfit: string;
    items: string[];
    tips: string;
    images: string[];
  };
  person2?: {
    outfit: string;
    items: string[];
    tips: string;
    images: string[];
  };
  error?: string;
};

const parseApiResponse = (raw: string): CoupleApiResponse => {
  try {
    return JSON.parse(raw) as CoupleApiResponse;
  } catch {
    return { error: "Respons server tidak valid (bukan JSON)." };
  }
};

const moodOptions = ["Kalem", "Percaya diri", "Playful", "Bold", "Clean", "Moody", "Galau"];
const occasionOptions = ["Hangout", "Date malam", "Ngampus", "Kantor", "Wedding", "Staycation", "Kondangan", "Nongkrong cafe"];
const weatherOptions = ["Panas", "Hujan", "Sejuk"];
const maleStyleOptions = ["Casual", "Streetwear", "Minimalist", "Old money", "Y2K", "Chic"];
const femaleStyleOptions = ["Casual", "Soft girl", "Minimalist", "Cottagecore", "Korean", "Old money", "Y2K", "Chic"];

export default function CouplePage() {
  const [person1, setPerson1] = useState<PersonInput>({
    gender: "Laki-laki",
    mood: [],
    occasion: [],
    weather: [],
    style: [],
  });
  const [person2, setPerson2] = useState<PersonInput>({
    gender: "Perempuan",
    mood: [],
    occasion: [],
    weather: [],
    style: [],
  });
  const [result1, setResult1] = useState<string>("");
  const [result2, setResult2] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMatch = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/couple", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ person1, person2 }),
      });

      const raw = await response.text();
      const data = parseApiResponse(raw);

      if (!response.ok) {
        const fallback = raw.slice(0, 120).replace(/\s+/g, " ").trim();
        throw new Error(data.error || `Gagal mencocokkan outfit (${response.status}). ${fallback}`);
      }

      setResult1(data.person1 ? JSON.stringify(data.person1) : "");
      setResult2(data.person2 ? JSON.stringify(data.person2) : "");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Terjadi masalah saat mencocokkan outfit.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl leading-tight text-[#1A1A1A] sm:text-5xl">
          Couple Mode
        </h1>
        <p className="max-w-2xl text-base text-[#666666]">
          Isi mood dan style masing-masing, lalu biar AI nyocokin outfit kalian biar serasi.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E8E4E0] bg-white p-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A] mb-6">
            Dia 👦
          </h2>
          <div className="space-y-6">
            <ChipSelector
              label="Mood"
              options={moodOptions}
              selected={person1.mood}
              onChange={(nextMood) => setPerson1((prev) => ({ ...prev, mood: nextMood }))}
            />
            <ChipSelector
              label="Occasion"
              options={occasionOptions}
              selected={person1.occasion}
              onChange={(nextOccasion) => setPerson1((prev) => ({ ...prev, occasion: nextOccasion }))}
            />
            <ChipSelector
              label="Weather"
              options={weatherOptions}
              selected={person1.weather}
              onChange={(nextWeather) => setPerson1((prev) => ({ ...prev, weather: nextWeather }))}
            />
            <ChipSelector
              label="Style"
              options={maleStyleOptions}
              selected={person1.style}
              onChange={(nextStyle) => setPerson1((prev) => ({ ...prev, style: nextStyle }))}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8E4E0] bg-white p-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A] mb-6">
            Kamu 👧
          </h2>
          <div className="space-y-6">
            <ChipSelector
              label="Mood"
              options={moodOptions}
              selected={person2.mood}
              onChange={(nextMood) => setPerson2((prev) => ({ ...prev, mood: nextMood }))}
            />
            <ChipSelector
              label="Occasion"
              options={occasionOptions}
              selected={person2.occasion}
              onChange={(nextOccasion) => setPerson2((prev) => ({ ...prev, occasion: nextOccasion }))}
            />
            <ChipSelector
              label="Weather"
              options={weatherOptions}
              selected={person2.weather}
              onChange={(nextWeather) => setPerson2((prev) => ({ ...prev, weather: nextWeather }))}
            />
            <ChipSelector
              label="Style"
              options={femaleStyleOptions}
              selected={person2.style}
              onChange={(nextStyle) => setPerson2((prev) => ({ ...prev, style: nextStyle }))}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleMatch}
          disabled={isLoading}
          className="rounded-full bg-[#D4537E] px-7 py-3 text-sm font-medium text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#c1476f] hover:shadow-lg"
        >
          {isLoading ? "Mencocokkan..." : "Cocokkan Outfit"}
        </button>
        {error ? <p className="text-sm text-[#c1476f] font-medium">{error}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AIResultPanel result={result1} />
        <AIResultPanel result={result2} />
      </div>
    </section>
  );
}
