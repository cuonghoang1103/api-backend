import { NextRequest, NextResponse } from "next/server";

// Both containers on same Docker bridge network. Backend port 3001.
const BACKEND_URL = "http://backend:3001";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Multipart helpers (same pattern as music upload route) ──────────────────

function getBoundary(contentType: string): string | null {
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  return match ? (match[1] || match[2]) : null;
}

interface Part {
  name: string;
  filename?: string;
  contentType?: string;
  data: Buffer;
}

function parseMultipart(buffer: Buffer, boundary: string): Part[] {
  const boundaryBytes = Buffer.from("--" + boundary);

  const positions: number[] = [];
  let searchFrom = 0;
  while (searchFrom < buffer.length) {
    const idx = buffer.indexOf(boundaryBytes, searchFrom);
    if (idx === -1) break;
    positions.push(idx);
    searchFrom = idx + 1;
  }

  const parts: Part[] = [];
  for (let i = 0; i < positions.length - 1; i++) {
    const bIdx = positions[i];
    const nextB = positions[i + 1];

    let p = bIdx + boundaryBytes.length + 2;
    if (p >= buffer.length) continue;

    let raw = buffer.slice(p, nextB);
    if (raw.length >= 2 && raw[raw.length - 2] === 0x0d && raw[raw.length - 1] === 0x0a) {
      raw = raw.slice(0, -2);
    }

    const headerEnd = raw.indexOf(Buffer.from("\r\n\r\n"));
    let headerBlock = "";
    let bodyData: Buffer = Buffer.alloc(0);

    if (headerEnd !== -1) {
      headerBlock = raw.slice(0, headerEnd).toString("utf8");
      bodyData = raw.slice(headerEnd + 4);
    } else {
      const crlf = raw.indexOf(Buffer.from("\r\n"));
      if (crlf !== -1) {
        headerBlock = raw.slice(0, crlf).toString("utf8");
        bodyData = raw.slice(crlf + 2);
      } else {
        headerBlock = raw.toString("utf8");
      }
    }

    const nameMatch = headerBlock.match(/name="([^"]+)"/);
    if (!nameMatch) continue;

    const filenameMatch = headerBlock.match(/filename="([^"]+)"/);
    const ctMatch = headerBlock.match(/Content-Type:\s*([^\r\n]+)/i);

    parts.push({
      name: nameMatch[1],
      filename: filenameMatch?.[1],
      contentType: ctMatch ? ctMatch[1].trim() : undefined,
      data: bodyData,
    });
  }

  return parts;
}

// ── Route handler ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    let token = request.cookies.get("backend_token")?.value;

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

    // Use arrayBuffer() to bypass Nginx stripping Content-Type multipart header.
    const buffer = await request.arrayBuffer();
    const contentType = request.headers.get("content-type") || "";
    const boundary = getBoundary(contentType);

    if (!boundary) {
      return NextResponse.json({ success: false, message: "Invalid content type" }, { status: 400 });
    }

    const parts = parseMultipart(Buffer.from(buffer), boundary);
    const fields: Record<string, Part> = {};
    for (const part of parts) {
      fields[part.name] = part;
    }

    const filePart = fields["file"];
    if (!filePart || !filePart.data || filePart.data.length === 0) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const category = fields["category"]?.data?.toString("utf8").trim() || "thumbnails";

    // Reject files > 100MB at the proxy level
    const MAX_SIZE = 100 * 1024 * 1024;
    if (filePart.data.length > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: `File too large. Max 100MB. Your file is ${(filePart.data.length / 1024 / 1024).toFixed(1)}MB.` },
        { status: 413 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append(
      "file",
      new Blob([filePart.data], { type: filePart.contentType || "application/octet-stream" }),
      filePart.filename || "file"
    );
    backendFormData.append("category", category);

    const res = await fetch(`${BACKEND_URL}/api/v1/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    const rawText = await res.text();
    let responseData: Record<string, unknown>;
    try {
      responseData = JSON.parse(rawText);
    } catch {
      responseData = { message: rawText.slice(0, 300) };
    }

    return NextResponse.json(responseData, { status: res.status });
  } catch (err) {
    console.error("[files/upload] Error:", err);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
