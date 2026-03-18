export default function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl leading-tight text-[#1A1A1A] sm:text-5xl">
          Terms of Service
        </h1>
        <p className="text-sm text-[#666666]">Terakhir diperbarui: 18 Maret 2026</p>
      </div>

      <div className="space-y-5 rounded-2xl border border-[#E8E4E0] bg-white p-6 text-sm leading-relaxed text-[#666666]">
        <p>
          Dengan menggunakan Outfitly, kamu setuju menggunakan layanan ini untuk kebutuhan personal styling
          dan referensi outfit harian. Rekomendasi AI bersifat saran, bukan jaminan hasil tertentu.
        </p>
        <p>
          Kamu bertanggung jawab atas keputusan penggunaan rekomendasi, termasuk pembelian item fashion,
          kenyamanan, dan kesesuaian konteks acara.
        </p>
        <p>
          Outfitly berhak memperbarui fitur, desain, maupun kebijakan layanan sewaktu-waktu untuk
          peningkatan pengalaman pengguna.
        </p>
      </div>
    </section>
  );
}