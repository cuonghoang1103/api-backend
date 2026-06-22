import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Clears the backend_token cookie.
 * NextAuth session logout is handled separately via signOut() for OAuth users.
 */
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Xóa backend_token cookie
  response.cookies.set("backend_token", "", {
    httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  // Xóa admin_role cookie
  response.cookies.set("admin_role", "", {
    httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
