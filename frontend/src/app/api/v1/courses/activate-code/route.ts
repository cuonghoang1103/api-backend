import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://cuonghoangdev_backend:3001";

// POST /api/v1/courses/activate-code
// Proxy server-side so httpOnly backend_token cookie is forwarded correctly.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, code } = body;

    if (!courseId || !code) {
      return NextResponse.json(
        { success: false, message: "courseId and code are required" },
        { status: 400 }
      );
    }

    const token = request.cookies.get("backend_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Vui long dang nhap de kich hoat ma", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/academy/activate-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId, code }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[activate-code] Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
