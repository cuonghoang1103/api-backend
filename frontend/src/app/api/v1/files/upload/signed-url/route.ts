import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://backend:3001";

export const runtime = 'nodejs';
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filename = searchParams.get("filename");
  const folder = searchParams.get("folder") || "products";
  const contentType = searchParams.get("contentType") || "images";

  if (!filename) {
    return NextResponse.json({ success: false, message: "filename is required" }, { status: 400 });
  }

  try {
    const backendUrl = `${BACKEND_URL}/api/v1/files/upload/signed-url?filename=${encodeURIComponent(filename)}&folder=${encodeURIComponent(folder)}&contentType=${encodeURIComponent(contentType)}`;
    const res = await fetch(backendUrl, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[files/upload/signed-url] Error:", err);
    return NextResponse.json({ success: false, message: "Failed to generate upload URL" }, { status: 500 });
  }
}
