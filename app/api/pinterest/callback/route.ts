import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Pinterest OAuth gagal.",
        error,
        errorDescription,
      },
      { status: 400 },
    );
  }

  if (!code) {
    return NextResponse.json(
      {
        ok: false,
        message: "Callback diterima, tetapi authorization code tidak ada.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "Authorization code berhasil diterima. Tukar code ini ke access token di Pinterest token endpoint, lalu simpan token-nya ke Netlify env PINTEREST_ACCESS_TOKEN.",
    code,
    state,
  });
}
