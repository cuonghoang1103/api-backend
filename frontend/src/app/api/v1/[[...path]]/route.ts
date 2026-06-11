import { NextRequest, NextResponse } from "next/server";

// Use Docker internal DNS for frontend→backend communication within the container.
// This bypasses Nginx and avoids circular routing (frontend → Nginx → backend).
// process.env.INTERNAL_BACKEND_URL is set in the frontend Dockerfile/container env.
const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || "http://backend:3001";

/**
 * Converts a backend fetch Response to a NextResponse.
 * Handles both JSON and binary (audio) responses.
 */
async function toNextResponse(response: Response): Promise<NextResponse> {
  const contentType = response.headers.get("content-type") || "";

  // For JSON responses: parse and return as NextResponse.json
  if (contentType.includes("application/json")) {
    const text = await response.text();
    if (!text.trim()) return new NextResponse(null, { status: response.status });
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } catch {
      return NextResponse.json({ success: false, message: text }, { status: response.status });
    }
  }

  // For binary responses (audio, images): stream the ArrayBuffer directly
  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength === 0) {
    return new NextResponse(null, { status: response.status });
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
