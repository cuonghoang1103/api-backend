import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users/nextauth
 * Supports both credentials auth via backend_token cookie and OAuth via NextAuth.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "15");
    const keyword = searchParams.get("keyword") || "";

    const backendToken = request.cookies.get("backend_token")?.value;
    if (backendToken) {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/users?page=${page}&size=${size}&keyword=${encodeURIComponent(keyword)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${backendToken}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/api/v1/admin/users?page=${page}&size=${size}&keyword=${encodeURIComponent(keyword)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[AdminUsers] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
