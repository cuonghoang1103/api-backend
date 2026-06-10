/**
 * POST /api/admin/music/upload
 *
 * Admin upload proxy for /admin/music page.
 * Forwards to the Node.js backend /api/v1/music/tracks endpoint.
 *
 * Flow: browser → this route → backend:3001/api/v1/music/tracks
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // ── Validate auth via backend_token cookie ────────────────────────────────
    let token = request.cookies.get("backend_token")?.value;

    if (!token) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ── Forward the FormData directly to the backend ─────────────────────
    const backendFormData = await request.formData();

    const audioFile = backendFormData.get("audio");
    if (!audioFile || (audioFile instanceof File && audioFile.size === 0)) {
      console.error("[admin/music/upload] Missing or empty audio file in FormData");
      return NextResponse.json({ success: false, message: "No audio file provided" }, { status: 400 });
    }

    // ── Forward to backend container via Docker internal DNS ─────────────────
    const backendRes = await fetch("http://backend:3001/api/v1/music/tracks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    const rawText = await backendRes.text();
    let responseData: Record<string, unknown>;
    try {
      responseData = JSON.parse(rawText);
    } catch {
      responseData = { message: rawText.slice(0, 300) };
    }

    return NextResponse.json(responseData, { status: backendRes.status });
  } catch (err) {
    console.error("[admin/music/upload] Unhandled error:", err);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}
