import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BACKEND_URL = "http://cuonghoangdev_backend:3001";

/**
 * GET /api/v1/profile/session
 *
 * Supports both auth flows:
 * 1. Credentials login via backend_token httpOnly cookie
 * 2. OAuth login via NextAuth JWT session
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const backendToken = request.cookies.get("backend_token")?.value;

  if (backendToken) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${backendToken}`,
        },
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      }
    } catch {
      // Fall through to NextAuth session fallback.
    }
  }

  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const user = session.user;
  const role = (user.role as string) || "USER";
  const username = (user.username as string) || (user.email?.split("@")[0] ?? "user");
  const name = user.name || username;

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      username,
      fullName: name,
      primaryRole: role,
      roles: [role],
    },
  });
}
