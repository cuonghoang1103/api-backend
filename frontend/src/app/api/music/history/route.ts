/**
 * GET /api/music/history — fetch listening history from backend
 * POST /api/music/history — record a track play event
 *
 * Both routes bypass Nginx /api/v1/ proxy via Docker internal networking.
 */
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

async function getBackendToken(request: NextRequest): Promise<string | null> {
  return request.cookies.get("backend_token")?.value ?? null;
}

async function proxyRequest(
  request: NextRequest,
  method: string,
  body?: Record<string, unknown>,
) {
  const token = await getBackendToken(request);
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch("http://cuonghoangdev_backend:3001/api/v1/music/history", {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const raw = await res.text();
  try {
    const data = JSON.parse(raw);
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid response" }, { status: res.status || 502 });
  }
}

export async function GET(request: NextRequest) {
  try {
    return proxyRequest(request, "GET");
  } catch (err) {
    console.error("[/api/music/history GET] Error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackId } = body;
    if (!trackId) {
      return NextResponse.json({ success: false, message: "trackId required" }, { status: 400 });
    }
    return proxyRequest(request, "POST", { trackId });
  } catch (err) {
    console.error("[/api/music/history POST] Error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    return proxyRequest(request, "DELETE");
  } catch (err) {
    console.error("[/api/music/history DELETE] Error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
