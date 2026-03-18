const steps = [
  {
    id: "01",
    title: "Tell Your Vibe",
    description:
      "Pilih mood, occasion, cuaca, dan style preference kamu. Semakin jujur sama vibe harianmu, semakin akurat hasil AI-nya.",
  },
  {
    id: "02",
    title: "AI Mix & Match",
    description:
      "Outfitly ngeramu kombinasi atasan, bawahan, sepatu, dan aksesoris yang nyambung. Bonus: palette warna biar look kamu konsisten.",
  },
  {
    id: "03",
    title: "Save Your Look",
    description:
      "Kalau udah cocok, simpan ke gallery biar bisa dipakai lagi kapan pun. Cocok buat daily inspo atau planning outfit mingguan.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 space-y-4">
          <p className="inline-flex rounded-full border border-[#E8E4E0] bg-[#F5F3F0] px-4 py-1.5 text-xs font-medium text-[#D4537E]">
            How It Works
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl leading-tight text-[#1A1A1A] sm:text-5xl">
            Cara kerja AI stylist di Outfitly
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#666666]">
            Prosesnya cepat, tapi hasilnya tetap personal. Cuma butuh tiga langkah buat dapetin look yang pas sama mood kamu.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.id}
              className="relative rounded-2xl border border-[#E8E4E0] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4537E] hover:shadow-xl"
            >
              <p className="text-7xl font-light text-[#E8E4E0]">{step.id}</p>
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A] mt-4">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#666666]">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
