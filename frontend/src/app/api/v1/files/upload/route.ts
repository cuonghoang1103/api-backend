import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Use Node.js runtime (not Edge) so we can handle large file uploads.
export const runtime = 'nodejs';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "thumbnails";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // Reject files > 100MB at the proxy level
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: `File too large. Max 100MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.` },
        { status: 413 }
      );
    }

    // Read backend_token cookie (credentials users)
    let token = request.cookies.get("backend_token")?.value;

    // For OAuth users, get token from NextAuth session
    if (!token) {
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
          });

          if (res.ok) {
            const data = await res.json();
            token = data.data?.token ?? "";
          }
        }
      } catch (e) {
        console.error("[files/upload] OAuth token fetch failed:", e);
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Forward the multipart form data to backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);
    backendFormData.append("category", category);

    const res = await fetch(`${BACKEND_URL}/api/v1/files/upload`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: backendFormData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[files/upload] Error:", err);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
