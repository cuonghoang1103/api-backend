import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://cuonghoangdev_backend:3001";

// Node.js runtime to handle larger file uploads through the proxy.
// The file travels: browser → proxy → backend server → VPS /uploads storage.
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
        { success: false, message: `File too large. Max 100MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.` },
        { status: 413 }
      );
    }

    let token = request.cookies.get("backend_token")?.value;
    const authHeader = request.headers.get("Authorization");
    if (!token && authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const backendFormData = new FormData();
    backendFormData.append("audio", file);
    backendFormData.append("title", title);
    backendFormData.append("artist", artist);
    backendFormData.append("durationSeconds", String(durationSeconds));
    if (coverFile) {
      backendFormData.append("cover", coverFile);
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/music/tracks`, {
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
    console.error("[music/upload] Error:", err);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
