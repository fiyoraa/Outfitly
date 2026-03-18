export default function PrivacyPage() {
  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl leading-tight text-[#1A1A1A] sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#666666]">Terakhir diperbarui: 18 Maret 2026</p>
      </div>

      <div className="space-y-5 rounded-2xl border border-[#E8E4E0] bg-white p-6 text-sm leading-relaxed text-[#666666]">
        <p>
          Outfitly menghargai privasi kamu. Data preferensi seperti mood, style, occasion, dan hasil outfit
          diproses untuk memberikan rekomendasi yang lebih relevan.
        </p>
        <p>
          Sebagian data dapat disimpan secara lokal di browser (localStorage) agar kamu bisa melihat kembali
          outfit yang sudah disimpan di Gallery.
        </p>
        <p>
          Kami tidak menjual data pribadi pengguna. Jika kebijakan privasi diperbarui, halaman ini akan
          diperbarui untuk mencerminkan perubahan tersebut.
        </p>
      </div>
    </section>
  );
}