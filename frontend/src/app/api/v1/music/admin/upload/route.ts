import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Node.js runtime to handle larger file uploads through the proxy.
// The file travels: browser → proxy → backend server → VPS /uploads storage.
// Since the upload is initiated from the backend server (not the browser),
// the browser body-size limitations of edge/serverless routes do not apply here.
export const runtime = 'nodejs';
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  try {
    console.log('[v1/music/admin/upload] Request content-type:', request.headers.get('content-type'));
    const formData = await request.formData();
    // Match backend MusicController.uploadFiles field name: "audio"
    const file = formData.get("audio") as File | null;
    const title = (formData.get("title") as string) || "";
    const artist = (formData.get("artist") as string) || "";
    const durationSeconds = parseInt((formData.get("durationSeconds") as string) || "0", 10);

    console.log("[v1/music/admin/upload] Incoming fields:", Array.from(formData.keys()));
    console.log("[v1/music/admin/upload] Incoming metadata:", {
      title,
      artist,
      durationSeconds,
      hasFile: !!file,
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
    });

    if (!file) {
      const fields: string[] = [];
      formData.forEach((_, key) => fields.push(key));
      console.error(`[v1/music/admin/upload] No "audio" field. Available: ${fields.join(", ")}`);
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

    // Get auth token
    let token = request.cookies.get("backend_token")?.value;
    const authHeader = request.headers.get("Authorization");
    if (!token && authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }

    // OAuth users: get token from NextAuth session
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
        console.error("[music/upload] OAuth token fetch failed:", e);
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Forward audio file to backend track creation route on VPS storage.
    const backendFormData = new FormData();
    backendFormData.append("audio", file);
    backendFormData.append("title", title);
    backendFormData.append("artist", artist);
    backendFormData.append("durationSeconds", String(durationSeconds));

    console.log("[v1/music/admin/upload] Forwarding to backend:", `${BACKEND_URL}/api/v1/music/admin/upload`);

    const res = await fetch(`${BACKEND_URL}/api/v1/music/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    const rawText = await res.text();
    console.log("[v1/music/admin/upload] Backend response:", {
      status: res.status,
      elapsedMs: Date.now() - startedAt,
      bodyPreview: rawText.slice(0, 500),
    });

    try {
      const data = JSON.parse(rawText);
      return NextResponse.json(data, { status: res.status });
    } catch (parseError) {
      console.error("[v1/music/admin/upload] Failed to parse backend JSON:", parseError);
      return NextResponse.json(
        {
          success: false,
          message: rawText.slice(0, 200) || "Invalid backend response",
        },
        { status: res.status || 502 }
      );
    }
  } catch (err) {
    console.error("[music/upload] Error:", err);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
