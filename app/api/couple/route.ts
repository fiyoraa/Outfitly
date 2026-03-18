import { NextResponse } from "next/server";

type PersonInput = {
  gender: string;
  mood: string[];
  occasion: string[];
  weather: string[];
  style: string[];
};

type CouplePayload = {
  person1: PersonInput;
  person2: PersonInput;
};

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

type PersonResult = {
  outfit: string;
  items: string[];
  tips: string;
  searchKeyword: string;
};

type CoupleResult = {
  person1: PersonResult;
  person2: PersonResult;
};

type UnsplashResponse = {
  results?: Array<{
    urls?: {
      regular?: string;
    };
  }>;
};

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const hasValues = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

const toLabel = (values: string[]) => (values.length > 0 ? values.join(", ") : "Tidak dipilih");

const parseCoupleJson = (raw: string): CoupleResult => {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as Partial<CoupleResult>;

  const normalize = (value: Partial<PersonResult> | undefined): PersonResult => ({
    outfit: typeof value?.outfit === "string" ? value.outfit : "",
    items:
      Array.isArray(value?.items) && value.items.every((item) => typeof item === "string")
        ? value.items
        : [],
    tips: typeof value?.tips === "string" ? value.tips : "",
    searchKeyword: typeof value?.searchKeyword === "string" ? value.searchKeyword : "outfit fashion",
  });

  return {
    person1: normalize(parsed.person1),
    person2: normalize(parsed.person2),
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
    const body = (await request.json()) as Partial<CouplePayload>;

    const payload: CouplePayload = {
      person1: {
        gender: typeof body.person1?.gender === "string" ? body.person1.gender : "Laki-laki",
        mood: hasValues(body.person1?.mood) ? body.person1.mood : [],
        occasion: hasValues(body.person1?.occasion) ? body.person1.occasion : [],
        weather: hasValues(body.person1?.weather) ? body.person1.weather : [],
        style: hasValues(body.person1?.style) ? body.person1.style : [],
      },
      person2: {
        gender: typeof body.person2?.gender === "string" ? body.person2.gender : "Perempuan",
        mood: hasValues(body.person2?.mood) ? body.person2.mood : [],
        occasion: hasValues(body.person2?.occasion) ? body.person2.occasion : [],
        weather: hasValues(body.person2?.weather) ? body.person2.weather : [],
        style: hasValues(body.person2?.style) ? body.person2.style : [],
      },
    };

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY belum diset di environment variable.");
    }

    const prompt = [
      "Kamu adalah stylist AI untuk fitur Couple Mode di Outfitly.",
      "Tugasmu mencocokkan outfit dua orang agar serasi tapi tetap punya karakter masing-masing.",
      "Person 1 adalah Laki-laki, Person 2 adalah Perempuan. Recommendasi outfit wajib sesuai gender masing-masing.",
      "Gunakan Bahasa Indonesia untuk outfit dan tips.",
      "searchKeyword wajib bahasa Inggris, maksimal 4 kata.",
      "Untuk Person 1 (Laki-laki): searchKeyword WAJIB diakhiri dengan 'men'.",
      "Untuk Person 2 (Perempuan): searchKeyword WAJIB diakhiri dengan 'women'.",
      "Balas JSON saja tanpa markdown/code block/teks tambahan.",
      "Format JSON wajib:",
      '{"person1":{"outfit":"deskripsi outfit lengkap bahasa Indonesia","items":["item 1","item 2","item 3"],"tips":"style tips bahasa Indonesia","searchKeyword":"english keyword max 4 words men"},"person2":{"outfit":"deskripsi outfit lengkap bahasa Indonesia","items":["item 1","item 2","item 3"],"tips":"style tips bahasa Indonesia","searchKeyword":"english keyword max 4 words women"}}',
      "",
      `Person 1 Gender: ${payload.person1.gender}`,
      `Person 1 Mood: ${toLabel(payload.person1.mood)}`,
      `Person 1 Occasion: ${toLabel(payload.person1.occasion)}`,
      `Person 1 Weather: ${toLabel(payload.person1.weather)}`,
      `Person 1 Style: ${toLabel(payload.person1.style)}`,
      "",
      `Person 2 Gender: ${payload.person2.gender}`,
      `Person 2 Mood: ${toLabel(payload.person2.mood)}`,
      `Person 2 Occasion: ${toLabel(payload.person2.occasion)}`,
      `Person 2 Weather: ${toLabel(payload.person2.weather)}`,
      `Person 2 Style: ${toLabel(payload.person2.style)}`,
    ].join("\n");

    const groqResponse = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = (await groqResponse.json()) as GroqResponse;

    if (!groqResponse.ok) {
      throw new Error(data.error?.message || "Gagal memanggil Groq API.");
    }

    const resultText = data.choices?.[0]?.message?.content?.trim();

    if (!resultText) {
      throw new Error("Groq tidak mengembalikan rekomendasi couple.");
    }

    const parsed = parseCoupleJson(resultText);
    const [images1, images2] = await Promise.all([
      fetchUnsplashImages(parsed.person1.searchKeyword),
      fetchUnsplashImages(parsed.person2.searchKeyword),
    ]);

    return NextResponse.json({
      person1: {
        outfit: parsed.person1.outfit,
        items: parsed.person1.items,
        tips: parsed.person1.tips,
        images: images1,
      },
      person2: {
        outfit: parsed.person2.outfit,
        items: parsed.person2.items,
        tips: parsed.person2.tips,
        images: images2,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat memproses Couple Mode.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
