import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://cuonghoangdev_backend:3001";

/**
 * POST /api/auth/register
 *
 * Credentials registration — proxies to the Node.js backend.
 * Backend returns a token (registration auto-logs the user in), and
 * we set the `backend_token` httpOnly cookie here so subsequent
 * authenticated requests (e.g. /api/v1/courses/:id/enroll) carry
 * the right credential. Without this cookie the user would be
 * authenticated in the client store (Zustand) but every server-side
 * auth middleware call would 401 with "No authentication token
 * provided".
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, email, fullName, captchaToken } = body;

    if (!username || !password || !email) {
      return NextResponse.json(
        { success: false, message: "Username, email and password are required" },
        { status: 400 },
      );
    }

    // Forward to backend. The captcha token rides along in the body
    // under the same `cf-turnstile-response` key the backend's
    // captchaMiddleware reads.
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        email,
        fullName,
        "cf-turnstile-response": captchaToken,
      }),
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok || !data?.success) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message ?? "Registration failed",
          code: data?.code,
        },
        { status: backendRes.status },
      );
    }

    const { token, userId, role, roles } = data.data ?? {};
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Registration succeeded but no token returned" },
        { status: 500 },
      );
    }

    const backendRoles: string[] = roles ?? [role].filter(Boolean);
    const isAdmin = backendRoles.some((r) => {
      const n = (r || "").replace(/^ROLE_/i, "").toUpperCase();
      return n === "ADMIN";
    });

    const response = NextResponse.json({
      success: true,
      data: { userId, username, email, role, roles: backendRoles },
    });

    // httpOnly cookie — JWT for all subsequent /api/v1/* calls
    response.cookies.set("backend_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    response.cookies.set("admin_role", isAdmin ? "1" : "0", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[register] Error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
