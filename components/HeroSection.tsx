import Link from "next/link";

const moodChips = [
  "Hangout",
  "Date malam",
  "Panas banget",
  "Hujan",
  "Kalem",
  "Percaya diri",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-73px)] flex items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-[#E8E4E0] bg-[#F5F3F0] px-4 py-1.5 text-xs font-medium text-[#D4537E]">
            AI-Powered Personal Stylist
          </div>

          <div className="space-y-6">
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl leading-tight text-[#1A1A1A] sm:text-6xl lg:text-7xl">
              Outfit kamu,<br />
              <span className="text-[#D4537E]">dipilihin AI.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#666666]">
              Cerita mood kamu, kasih tau mau pergi ke mana, pilih warna favorit, lalu biar Outfitly ngeramu look yang pas buat kamu. Simple, cepat, tapi tetep berasa kamu banget.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/generate"
              className="rounded-full bg-[#D4537E] px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#c1476f] hover:shadow-lg"
            >
              Generate sekarang
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-[#D4537E] px-7 py-3 text-sm font-medium text-[#D4537E] transition-all duration-300 hover:bg-[#F5F3F0]"
            >
              Lihat Gallery
            </Link>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="rounded-3xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-medium text-[#1A1A1A]">Today&apos;s Outfit Suggestion</p>
              <span className="rounded-full bg-[#F5F3F0] px-3 py-1 text-xs text-[#D4537E] font-medium">AI Match 95%</span>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#F5F3F0] to-[#FAFAF8] p-6">
              <p className="text-sm font-semibold text-[#1A1A1A]">Soft Elegant Casual</p>
              <p className="mt-2 text-sm leading-relaxed text-[#666666]">
                Outer knit cream, inner white tank, pleated skirt blush, sneakers netral, dan mini bag rose nude.
              </p>
              <div className="mt-5 flex items-center gap-2">
                {[
                  "#D4537E",
                  "#F8D4E2",
                  "#F5EEE6",
                  "#C7B7A9",
                  "#1A1A1A",
                ].map((hex) => (
                  <span
                    key={hex}
                    className="h-6 w-6 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
