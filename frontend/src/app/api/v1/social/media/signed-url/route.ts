import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || "http://backend:3001";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/v1/social/media/signed-url
 *
 * Generates a signed upload URL for social feed media (images/videos).
 * The frontend uploads directly to the signed URL, bypassing the proxy.
 *
 * Query params:
 *   filename  — original filename
 *   type      — IMAGE | VIDEO | CODE_FILE  (default: IMAGE)
 *   size      — file size in bytes (optional, for validation)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filename = searchParams.get("filename");
  const type = searchParams.get("type") || "IMAGE";

  if (!filename) {
    return NextResponse.json(
      { success: false, message: "filename is required" },
      { status: 400 }
    );
  }

  try {
    const folder = type === "VIDEO" ? "social/videos" : type === "CODE_FILE" ? "social/files" : "social/images";
    const backendUrl = `${BACKEND_URL}/api/v1/files/upload/signed-url?filename=${encodeURIComponent(filename)}&folder=${encodeURIComponent(folder)}&contentType=${encodeURIComponent(type)}`;
    const res = await fetch(backendUrl, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[social/media/signed-url] Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
