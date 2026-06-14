import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Backend URL — ưu tiên BACKEND_URL (server-only), fallback NEXT_PUBLIC_API_URL,
 * cuối cùng là Docker service name. Trên Vercel, set BACKEND_URL trong env vars
 * (Settings → Environment Variables) trỏ tới https://api.cuongthai.com.
 */
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://backend:3001";

/**
 * POST /api/auth/oauth/token
 *
 * Generates a backend JWT for an OAuth user (Google/GitHub) who just signed in.
 * This sets the backend_token cookie so ALL authenticated backend API calls work
 * for both credentials and OAuth users.
 *
 * Called by the /oauth-callback page after NextAuth session is established.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let session;
  try {
    session = await auth();
    console.log("[oauth/token] Session:", JSON.stringify(session?.user));
  } catch (err) {
    console.error("[oauth/token] auth() failed:", err);
    return NextResponse.json({ success: false, message: "Auth session error" }, { status: 500 });
  }

  if (!session?.user?.email) {
    console.warn("[oauth/token] No session or email. Session:", JSON.stringify(session));
    return NextResponse.json({ success: false, message: "Unauthorized - no session" }, { status: 401 });
  }

  const user = session.user as any;
  const email = session.user.email;
  const fullName = session.user.name ?? email.split("@")[0];
  const provider = user.provider ?? "google";
  const userId = user.id ?? "";

  let backendRes;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, fullName, provider, providerId: userId }),
    });
  } catch (err) {
    console.error("[oauth/token] Backend fetch error:", err);
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 500 });
  }

  if (!backendRes.ok) {
    const err = await backendRes.json().catch(() => ({}));
    console.error("[oauth/token] Backend error:", err);
    return NextResponse.json({ success: false, message: "Failed to generate token" }, { status: 500 });
  }

  const data = await backendRes.json();
  const token = data.data?.token ?? "";

  if (!token) {
    return NextResponse.json({ success: false, message: "No token received" }, { status: 500 });
  }

  // Also read the admin_role from backend response and set it as a cookie
  const roles: string[] = data.data?.roles ?? [data.data?.role ?? "ROLE_USER"];
  const isAdmin = roles.some(
    (r: string) => (r || "").replace("ROLE_", "").toUpperCase() === "ADMIN"
  );

  // Set backend_token cookie (httpOnly, 7 days)
  const response = NextResponse.json({ success: true, token });
  response.cookies.set("backend_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  // admin_role cookie: httpOnly=true vì middleware Edge Runtime vẫn đọc được raw cookie header
  response.cookies.set("admin_role", isAdmin ? "1" : "0", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
