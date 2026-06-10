import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || "http://backend:3001";

/**
 * GET /api/auth/admin-check
 *
 * Server-side proxy that reads the backend_token from the httpOnly cookie
 * and passes it as Authorization: Bearer header to the backend profile API.
 *
 * This is needed because:
 * 1. JavaScript CANNOT read httpOnly cookies (by design)
 * 2. The admin layout needs to verify the user is logged in and has ADMIN role
 * 3. We use Authorization header (same as login page) so backend validates correctly
 *
 * Returns profile data if authenticated as admin, 401 otherwise.
 */
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("backend_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "No token" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await res.json();
    const roles: string[] = data.data?.roles || [];
    const isAdmin = roles.some(
      (r: string) => (r || "").replace("ROLE_", "").toUpperCase() === "ADMIN"
    );

    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Not admin" }, { status: 403 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
