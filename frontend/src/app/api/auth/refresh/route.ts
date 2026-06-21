import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BACKEND_URL = "http://cuonghoangdev_backend:3001";

/**
 * POST /api/auth/refresh
 *
 * Refreshes the backend JWT for credentials users by issuing a NEW token.
 * Sets the new token as an httpOnly cookie.
 * For OAuth users, NextAuth handles its own token refresh via its built-in mechanism.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Read the current backend_token from the cookie
    const currentToken = request.cookies.get("backend_token")?.value;

    if (!currentToken) {
      return NextResponse.json(
        { success: false, message: "No active session to refresh" },
        { status: 401 }
      );
    }

    // Call the backend refresh endpoint with the current token
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    const data = await res.json();
    const { token, userId, email, role } = data.data ?? {};

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Refresh failed" },
        { status: 500 }
      );
    }

    // Set the NEW token as an httpOnly cookie (7 days)
    const response = NextResponse.json({
      success: true,
      data: { userId, username: data.data?.username, email, role, token },
    });

    response.cookies.set("backend_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
