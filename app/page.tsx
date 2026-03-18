import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import OutfitCard from "@/components/OutfitCard";
import Link from "next/link";

const previewOutfits = [
  {
    title: "Soft Cafe Date",
    description:
      "Cardigan dusty pink, inner putih clean, rok satin krem, sneakers ivory. Rapih tapi tetap santai buat ngobrol lama.",
    occasion: "Date malam",
    vibeTag: "Romantic Calm",
    colors: ["#D4537E", "#F5D6E1", "#F4ECE3", "#CDBAA8"],
  },
  {
    title: "City Hangout Fit",
    description:
      "Oversized shirt abu muda, tank hitam, wide-leg jeans biru, sling bag pink nude. Effortless dan gampang dipaduin ulang.",
    occasion: "Hangout",
    vibeTag: "Chill Confident",
    colors: ["#2F2A2B", "#CBD0D4", "#D4537E", "#EDE1D8"],
  },
  {
    title: "Rainy Day Layer",
    description:
      "Trench coat light beige, knit top moka, straight pants charcoal, ankle boots waterproof. Tetap stylish pas hujan.",
    occasion: "Hujan",
    vibeTag: "Warm Minimal",
    colors: ["#B9A692", "#7C6C63", "#3E3B3C", "#F1EAE1"],
  },
  {
    title: "Heatwave Easy Look",
    description:
      "Linen shirt off-white, shorts high-waist rose sand, sandal netral, aksesori gold tipis. Adem, clean, dan tetap niat.",
    occasion: "Panas banget",
    vibeTag: "Fresh Bright",
    colors: ["#F7F0E7", "#DCA7B8", "#D4537E", "#8A7A72"],
  },
];

export default function HomePage() {
  return (
    <div className="pb-8">
      <HeroSection />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <p className="inline-flex rounded-full border border-[#f0d6de] bg-[#fff5f8] px-3 py-1 text-xs font-medium text-[#8a2f4f]">
                Outfit Preview
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#2f2a2b] sm:text-3xl">
                Inspirasi look buat berbagai occasion
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[#6e6467] sm:text-base">
                Ini sample rekomendasi dari Outfitly. Tinggal masuk ke generator, custom preferensi kamu, dan dapetin versi personal.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {previewOutfits.map((outfit) => (
              <OutfitCard
                key={outfit.title}
                title={outfit.title}
                description={outfit.description}
                occasion={outfit.occasion}
                vibeTag={outfit.vibeTag}
                colors={outfit.colors}
              />
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <footer className="border-t border-[#E8E4E0] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">Outfitly</p>
            <p className="mt-1 text-sm text-[#666666]">
              AI stylist buat bantu kamu tampil pede, tanpa ribet mikirin mix and match setiap hari.
            </p>
            <p className="mt-2 text-xs text-[#666666]">Outfitly by Fiyoraa.</p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="text-xs uppercase tracking-[0.14em] text-[#8a7b80]">Outfit kamu, dipilihin AI</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#666666]">
              <Link href="/terms" className="transition-all duration-300 hover:text-[#D4537E]">
                Terms of Service
              </Link>
              <Link href="/privacy" className="transition-all duration-300 hover:text-[#D4537E]">
                Privacy Policy
              </Link>
              <a
                href="https://github.com/fiyoraa/Oufitly"
                target="_blank"
                rel="noreferrer"
                className="transition-all duration-300 hover:text-[#D4537E]"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
