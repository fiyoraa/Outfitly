import { NextResponse } from "next/server";
import { generateOutfit, type OutfitInput } from "@/lib/claude";
import { fetchPinterestImages } from "@/lib/pinterest";

const hasValues = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

type OutfitResult = {
  outfit: string;
  items: string[];
  tips: string;
  searchKeyword: string;
};

const parseOutfitJson = (raw: string): OutfitResult => {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as Partial<OutfitResult>;

  return {
    outfit: typeof parsed.outfit === "string" ? parsed.outfit : "",
    items:
      Array.isArray(parsed.items) && parsed.items.every((item) => typeof item === "string")
        ? parsed.items
        : [],
    tips: typeof parsed.tips === "string" ? parsed.tips : "",
    searchKeyword: typeof parsed.searchKeyword === "string" ? parsed.searchKeyword : "",
  };
};

const resolveSearchKeyword = (parsed: OutfitResult, payload: OutfitInput): string => {
  const fromGroq = parsed.searchKeyword.trim();

  if (fromGroq) {
    return fromGroq;
  }

  const genderKeyword = payload.gender === "Laki-laki" ? "men" : "women";

  return [payload.style[0], payload.occasion[0], payload.favoriteColor, "outfit", genderKeyword]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join(" ");
};

export async function POST(request: Request) {
  try {
    const shouldIncludePinterestDebug = request.headers.get("x-debug-pinterest") === "1";
    const body = (await request.json()) as Partial<OutfitInput>;

    const payload: OutfitInput = {
      gender: typeof body.gender === "string" ? body.gender : "",
      mood: hasValues(body.mood) ? body.mood : [],
      occasion: hasValues(body.occasion) ? body.occasion : [],
      weather: hasValues(body.weather) ? body.weather : [],
      style: hasValues(body.style) ? body.style : [],
      favoriteColor: typeof body.favoriteColor === "string" ? body.favoriteColor : "",
    };

    const result = await generateOutfit(payload);
    const parsed = parseOutfitJson(result);
    const effectiveSearchKeyword = resolveSearchKeyword(parsed, payload);
    const pinterest = await fetchPinterestImages(effectiveSearchKeyword);
    const images = pinterest.images;

    return NextResponse.json({
      outfit: parsed.outfit,
      items: parsed.items,
      tips: parsed.tips,
      searchKeyword: effectiveSearchKeyword,
      images,
      ...(shouldIncludePinterestDebug ? { pinterestDebug: pinterest.debug } : {}),
      result: JSON.stringify({
        outfit: parsed.outfit,
        items: parsed.items,
        tips: parsed.tips,
        searchKeyword: effectiveSearchKeyword,
        images,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat memanggil Groq API.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
