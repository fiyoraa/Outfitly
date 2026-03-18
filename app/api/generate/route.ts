import { NextResponse } from "next/server";
import { generateOutfit, type OutfitInput } from "@/lib/claude";

const hasValues = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

type OutfitResult = {
  outfit: string;
  items: string[];
  tips: string;
  searchKeyword: string;
};

type UnsplashResponse = {
  results?: Array<{
    urls?: {
      regular?: string;
    };
  }>;
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
    searchKeyword: typeof parsed.searchKeyword === "string" ? parsed.searchKeyword : "outfit fashion",
  };
};

const fetchUnsplashImages = async (searchKeyword: string): Promise<string[]> => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return [];
  }

  const query = encodeURIComponent(searchKeyword);
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=4&orientation=portrait`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as UnsplashResponse;

  return (data.results || [])
    .map((item) => item.urls?.regular)
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl));
};

export async function POST(request: Request) {
  try {
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
    const images = await fetchUnsplashImages(parsed.searchKeyword);

    return NextResponse.json({
      outfit: parsed.outfit,
      items: parsed.items,
      tips: parsed.tips,
      images,
      result: JSON.stringify({
        outfit: parsed.outfit,
        items: parsed.items,
        tips: parsed.tips,
        images,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat memanggil Groq API.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
