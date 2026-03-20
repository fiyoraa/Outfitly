# Outfitly

Outfitly adalah web app AI personal stylist untuk bantu pengguna memilih outfit berdasarkan mood, occasion, weather, style, dan warna favorit.

## Features

- AI Outfit Generator dengan input preferensi personal
- Couple Mode (Dia dan Kamu) untuk outfit yang serasi
- Gallery penyimpanan outfit (localStorage)
- Pinterest image recommendation berdasarkan keyword hasil Groq
- UI premium clean estetik dengan Playfair Display + DM Sans
- Terms of Service dan Privacy Policy

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Groq API (LLM)
- Pinterest API

## Project Structure

```text
app/
  api/
    couple/route.ts
    generate/route.ts
  couple/page.tsx
  gallery/page.tsx
  generate/page.tsx
  privacy/page.tsx
  terms/page.tsx
  layout.tsx
  page.tsx
components/
lib/
  claude.ts
```

## Environment Variables

Buat file `.env.local` dari `.env.example`, lalu isi value aslinya:

```bash
cp .env.example .env.local
```

Wajib diisi:

- `GROQ_API_KEY`
- `PINTEREST_ACCESS_TOKEN`

Opsional (legacy):

- `GEMINI_API_KEY`

> Jangan pernah commit `.env.local` ke Git.

## Installation

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

Default: `http://localhost:3000` (atau port lain jika 3000 sedang dipakai).

## Production Build

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## API Endpoints

- `POST /api/generate` - Generate outfit recommendation untuk single user
- `POST /api/couple` - Generate pasangan outfit yang matching

## Security Notes

- API key disimpan di environment variable server-side.
- Jika key pernah terekspos, segera rotate/regenerate di dashboard.

## Author

Outfitly by Fiyoraa

- GitHub: https://github.com/fiyoraa/Outfitly
