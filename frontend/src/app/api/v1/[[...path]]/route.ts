import { NextRequest, NextResponse } from "next/server";

// Server-side proxy target. Order matters:
//   1. INTERNAL_BACKEND_URL / API_INTERNAL_URL — set in production
//      docker-compose to http://backend:3001 (the fast internal
//      Docker-network path; avoids a TLS handshake with public nginx
//      and works even though the VPS bridge has no outbound internet).
//   2. NEXT_PUBLIC_API_URL — local dev points this at localhost:3001.
//   3. Docker service hostname — last-resort fallback.
// NOTE: we deliberately do NOT read BACKEND_URL here — in production
// that var is set to the PUBLIC url (https://api.cuongthai.com), and
// routing internal container calls out through the public edge would
// reintroduce the ~4s cold-start latency and can fail outright.
const BACKEND_URL =
  process.env.INTERNAL_BACKEND_URL ||
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://cuonghoangdev_backend:3001";

/**
 * Sends a request to the backend, forwarding all necessary headers and body.
 *
 * For multipart/form-data: we must NOT read the body as text (which would corrupt
 * binary audio data). Instead we read it as an ArrayBuffer and send it as-is.
 * This preserves the multipart boundary bytes exactly.
 */
async function proxyRequest(
  method: string,
  backendPath: string,
  request: NextRequest,
): Promise<Response> {
  const token = request.cookies.get("backend_token")?.value;
  const search = request.nextUrl.search;
  const contentType = request.headers.get("content-type") || "";

  // Build headers to forward
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Forward the httpOnly backend_token cookie as-is so the backend
  // can read it directly (cookie-parser middleware).  Without this,
  // POST /api/v1/hub/scrape and POST /api/v1/hub/files/presign return 401
  // "No authentication token provided" on the api.cuongthai.com domain.
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  // ALWAYS forward Content-Type — including for multipart/form-data.
  // When request.body is consumed as ArrayBuffer, the browser-set Content-Type
  // header can be dropped by Next.js. Explicitly forwarding it fixes the issue.
  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  // Forward Range header for audio streaming
  const range = request.headers.get("range");
  if (range) headers["Range"] = range;

  // Read body as ArrayBuffer to avoid any text encoding corruption.
  // This is safe for all content types including multipart/form-data.
  const body = await request.arrayBuffer();

  return fetch(`${BACKEND_URL}${backendPath}${search}`, {
    method,
    headers,
    credentials: "include",
    body: body.byteLength > 0 ? body : undefined,
  });
}

/**
 * Converts a backend fetch Response to a NextResponse.
 * Handles SSE/text-streaming by piping directly — no buffering.
 */
async function toNextResponse(response: Response): Promise<NextResponse> {
  const contentType = response.headers.get("content-type") || "";

  // SSE or text streaming: pipe directly (no buffering)
  if (
    contentType.includes("text/event-stream") ||
    contentType.includes("text/stream") ||
    contentType.includes("application/stream"))
  {
    const streamingHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    };
    const forwarding = ["transfer-encoding", "content-encoding"];
    for (const h of forwarding) {
      const v = response.headers.get(h);
      if (v) streamingHeaders[h] = v;
    }
    // Stream the ReadableStream directly
    return new NextResponse(response.body, {
      status: response.status,
      headers: streamingHeaders,
    });
  }

  // Collect Set-Cookie headers from the backend response.
  // NextResponse does not support Set-Cookie via its constructor headers
  // param on all versions, so we handle it via cookies() helper.
  const setCookieHeaders = response.headers.getSetCookie?.() ?? [];

  // For JSON responses: parse and return as NextResponse.json
  if (contentType.includes("application/json")) {
    const text = await response.text();
    if (!text.trim()) {
      const next = new NextResponse(null, { status: response.status });
      for (const sc of setCookieHeaders) next.cookies.set(sc as unknown as string, "");
      return next;
    }
    try {
      const data = JSON.parse(text);
      const next = NextResponse.json(data, { status: response.status });
      for (const sc of setCookieHeaders) next.cookies.set(sc as unknown as string, "");
      return next;
    } catch {
      return NextResponse.json({ success: false, message: text }, { status: response.status });
    }
  }

  // For binary responses (audio, images): stream the ArrayBuffer directly
  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength === 0) {
    const next = new NextResponse(null, { status: response.status });
    for (const sc of setCookieHeaders) next.cookies.set(sc as unknown as string, "");
    return next;
  }

  const headers: Record<string, string> = {
    "Content-Type": contentType || "application/octet-stream",
    "Content-Length": String(arrayBuffer.byteLength),
  };

  // Forward streaming headers for audio/Range support
  const forwarding = [
    "accept-ranges", "content-range", "cache-control",
    "x-accel-buffering", "access-control-expose-headers",
  ];
  for (const h of forwarding) {
    const v = response.headers.get(h);
    if (v) headers[h] = v;
  }

  return new NextResponse(arrayBuffer, { status: response.status, headers });
}

// ─── GET ────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/v1", "");
  const response = await proxyRequest("GET", `/api/v1${path}`, request);
  return toNextResponse(response);
}

// ─── POST ───────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/v1", "");
  const response = await proxyRequest("POST", `/api/v1${path}`, request);
  return toNextResponse(response);
}

// ─── PUT ────────────────────────────────────────────────────────────────────
export async function PUT(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/v1", "");
  const response = await proxyRequest("PUT", `/api/v1${path}`, request);
  return toNextResponse(response);
}

// ─── PATCH ─────────────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/v1", "");
  const response = await proxyRequest("PATCH", `/api/v1${path}`, request);
  return toNextResponse(response);
}

// ─── DELETE ─────────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/v1", "");
  const response = await proxyRequest("DELETE", `/api/v1${path}`, request);
  return toNextResponse(response);
}
