import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://backend:3001";

/**
 * Compatibility proxy for legacy raw-binary audio uploads.
 *
 * Older callers still PUT raw bytes to this route with `?filename=track.mp3`.
 * The backend endpoint now expects `multipart/form-data` with field `file`, so
 * this proxy repackages the bytes into FormData before forwarding.
 */
export const runtime = 'nodejs';
const isDebug = process.env.NODE_ENV !== 'production';

function debugLog(...args: unknown[]) {
  if (isDebug) console.log('[music/upload/audio/raw]', ...args);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}

export async function PUT(request: NextRequest) {
  const search = request.nextUrl.search;
  const token = request.cookies.get("backend_token")?.value || "";
  const backendUrl = `${BACKEND_URL}/api/v1/music/admin/upload/audio/raw${search}`;
  const filename = request.nextUrl.searchParams.get('filename') || 'track.mp3';
  const contentType = request.headers.get('content-type') || 'application/octet-stream';

  debugLog('Forwarding compat PUT to:', backendUrl, { filename, contentType });

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const bytes = await request.arrayBuffer();
  debugLog(`Received ${bytes.byteLength} bytes`);

  const formData = new FormData();
  formData.append('file', new File([bytes], filename, { type: contentType }));

  try {
    const response = await fetch(backendUrl, {
      method: "PUT",
      headers,
      body: formData,
      credentials: "include",
    });

    const data = await response.json().catch(() => ({ message: "Failed to parse response" }));
    debugLog('Backend response: HTTP', response.status);

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("[music/upload/audio/raw] Proxy error:", err);
    return NextResponse.json(
      { success: false, message: "Proxy error: " + (err instanceof Error ? err.message : String(err)) },
      { status: 502 }
    );
  }
}
