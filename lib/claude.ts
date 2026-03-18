import "server-only";

export type OutfitInput = {
  gender: string;
  mood: string[];
  occasion: string[];
  weather: string[];
  style: string[];
  favoriteColor: string;
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

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const toLabel = (values: string[]) => (values.length > 0 ? values.join(", ") : "Tidak dipilih");

export async function generateOutfit(input: OutfitInput): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY belum diset di environment variable.");
  }

  const keywordGender = input.gender === "Laki-laki" ? "men" : "women";

  const prompt = [
    "Kamu adalah stylist AI untuk web app Outfitly.",
    `Rekomendasikan outfit untuk ${input.gender || "Perempuan"}.`,
    "Gunakan Bahasa Indonesia untuk nilai outfit dan tips.",
    "Semua pilihan user (termasuk chip yang diketik manual) harus dianggap preferensi utama dan wajib diprioritaskan dalam rekomendasi.",
    "Aturan outfit harus realistis dan kontekstual.",
    'Jika occasion mengandung "Kerja" atau "Formal": wajib rekomendasikan celana panjang/rok, blazer atau kemeja, dan sepatu tertutup. Dilarang rekomendasikan celana pendek, sandal, atau kaos polos.',
    'Jika occasion mengandung "Date malam": rekomendasikan outfit elegan, bukan kasual.',
    'Jika occasion mengandung "Hangout" atau "Casual": outfit boleh lebih santai tapi tetap sopan.',
    'Jika cuaca mengandung "Panas banget": boleh pilih bahan tipis tetapi tetap wajib sesuai occasion.',
    "searchKeyword wajib mencerminkan outfit yang direkomendasikan, bukan mood atau cuaca.",
    `Jika gender Perempuan, searchKeyword wajib diakhiri women. Jika gender Laki-laki, searchKeyword wajib diakhiri men. Gender saat ini: ${input.gender || "Perempuan"}.`,
    "Format searchKeyword wajib: [style] [occasion] [warna dominan] outfit women atau [style] [occasion] [warna dominan] outfit men.",
    "Contoh searchKeyword yang baik: korean casual outfit women, streetwear hoodie men, elegant date night dress pink women.",
    "Balas JSON saja, tanpa markdown, tanpa code block, tanpa teks tambahan apa pun.",
    "Format JSON wajib:",
    `{"outfit":"deskripsi outfit lengkap dalam bahasa Indonesia","items":["item 1","item 2","item 3"],"tips":"style tips dalam bahasa Indonesia","searchKeyword":"[style] [occasion] [warna dominan] outfit ${keywordGender}"}`,
    "",
    `Mood: ${toLabel(input.mood)}`,
    `Acara: ${toLabel(input.occasion)}`,
    `Cuaca: ${toLabel(input.weather)}`,
    `Gaya: ${toLabel(input.style)}`,
    `Warna favorit: ${input.favoriteColor || "Tidak dipilih"}`,
  ].join("\n");

  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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

  const data = (await response.json()) as GroqResponse;

  if (!response.ok) {
    throw new Error(data.error?.message || "Gagal memanggil Groq API.");
  }

  const result = data.choices?.[0]?.message?.content?.trim();

  if (!result) {
    throw new Error("Groq tidak mengembalikan rekomendasi teks.");
  }

  return result;
}
