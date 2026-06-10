import { NextRequest, NextResponse } from "next/server";

// This route is intentionally OUTSIDE /api/v1/ to bypass Nginx proxy.
// Nginx proxies /api/v1/* → backend container, so a frontend route at /api/v1/* would
// never be reached. Instead, this route uses Docker internal networking to reach
// the backend directly at http://backend:3001.
export const runtime = 'nodejs';
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio") as File | null;
    const title = (formData.get("title") as string) || "";
    const artist = (formData.get("artist") as string) || "";
    const durationSeconds = parseInt((formData.get("durationSeconds") as string) || "0", 10);
    const coverFile = formData.get("cover") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No audio file provided" }, { status: 400 });
    }

    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: `File too large. Max 100MB.` },
        { status: 413 }
      );
    }

    // Read auth token from httpOnly backend_token cookie
    let token = request.cookies.get("backend_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Reconstruct FormData for the backend
    const backendFormData = new FormData();
    backendFormData.append("audio", file);
    backendFormData.append("title", title);
    backendFormData.append("artist", artist);
    backendFormData.append("durationSeconds", String(durationSeconds));
    if (coverFile) {
      backendFormData.append("cover", coverFile);
    }

    // Use Docker internal DNS to reach the backend container
    const res = await fetch("http://backend:3001/api/v1/music/tracks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    const rawText = await res.text();
    try {
      const data = JSON.parse(rawText);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json(
        { success: false, message: rawText.slice(0, 200) || "Invalid backend response" },
        { status: res.status || 502 }
      );
    }
  } catch (err) {
    console.error("[/api/music/upload] Error:", err);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
