import { NextRequest, NextResponse } from "next/server";

// Both containers on same Docker bridge network. Backend port 3001.
const BACKEND_URL = "http://backend:3001";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Reads the backend_token httpOnly cookie set by /api/auth/login or
 * /api/auth/register. Falls back to a NextAuth OAuth session when the
 * cookie isn't present (e.g. social-login users who never went through
 * the credentials flow).
 */
async function resolveToken(request: NextRequest): Promise<string | null> {
  const cookieToken = request.cookies.get("backend_token")?.value;
  if (cookieToken) return cookieToken;

  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    if (session?.user?.email) {
      const user = session.user as any;
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          fullName: session.user.name ?? session.user.email.split("@")[0],
          provider: user.provider ?? "google",
          providerId: user.id ?? "",
        }),
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        return data.data?.token ?? null;
      }
    }
  } catch (e) {
    console.error("[files/upload] OAuth token fetch failed:", e);
  }
  return null;
}

// ── Route handler ─────────────────────────────────────────────────────────
// We use the same pass-through pattern as the catch-all proxy
// `[[...path]]/route.ts`: read the body as an ArrayBuffer so the
// multipart boundary bytes are preserved exactly when we re-post to
// the backend. This is the safest approach for binary file uploads and
// avoids the brittle manual multipart parsing the previous version did.

export async function POST(request: NextRequest) {
  try {
    const token = await resolveToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Pass-through: forward the raw body and the original Content-Type
    // (which already contains the multipart boundary) to the backend.
    const body = await request.arrayBuffer();
    const contentType = request.headers.get("content-type") || "";

    const res = await fetch(`${BACKEND_URL}/api/v1/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(contentType ? { "Content-Type": contentType } : {}),
      },
      body: body.byteLength > 0 ? body : undefined,
    });

    const rawText = await res.text();
    let responseData: Record<string, unknown>;
    try {
      responseData = JSON.parse(rawText);
    } catch {
      responseData = { message: rawText.slice(0, 300) };
    }

    return NextResponse.json(responseData, { status: res.status });
  } catch (err) {
    console.error("[files/upload] Error:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
