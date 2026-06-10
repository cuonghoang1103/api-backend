import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * POST /api/auth/login
 *
 * Credentials login — proxies to the Node.js backend.
 * Backend sets backend_token as httpOnly cookie, then we also
 * set admin_role cookie for middleware/Edge access.
 */
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      let message = "Incorrect username or password";
      try {
        const err = await res.json();
        message = err.message ?? message;
      } catch {}
      return NextResponse.json({ success: false, message }, { status: res.status });
    }

    const data = await res.json();
    const { token, userId, email, role, roles } = data.data ?? {};

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication failed" },
        { status: 500 }
      );
    }

    // Determine admin status from backend roles
    const backendRoles: string[] = roles ?? [role].filter(Boolean);
    const isAdmin = backendRoles.some((r) => {
      const n = (r || "").replace(/^ROLE_/i, "").toUpperCase();
      return n === "ADMIN";
    });

    const response = NextResponse.json({
      success: true,
      data: { userId, username, email, role, roles: backendRoles },
    });

    // httpOnly cookie — backend JWT for all authenticated API calls
    response.cookies.set("backend_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // admin_role cookie — used by middleware to short-circuit admin checks
    // Edge Runtime CAN read httpOnly cookies from raw header, so this is safe
    response.cookies.set("admin_role", isAdmin ? "1" : "0", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[login] Error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
