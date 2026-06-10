/**
 * POST /api/admin/music/upload
 *
 * Admin upload proxy for /admin/music page.
 * Forwards to the Node.js backend /api/v1/music/tracks endpoint.
 *
 * Flow: browser → this route → backend:3001/api/v1/music/tracks
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // ── Validate auth via backend_token cookie ────────────────────────────────
    let token = request.cookies.get("backend_token")?.value;

    if (!token) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Use arrayBuffer() to bypass Nginx stripping Content-Type header.
    // Nginx may not forward multipart/form-data Content-Type for large proxied requests.
    // We read raw bytes and parse multipart manually, then rebuild FormData.
    const buffer = await request.arrayBuffer();
    const contentType = request.headers.get("content-type") || "";
    const boundary = getMultipartBoundary(contentType);

    if (!boundary) {
      console.error("[admin/music/upload] No boundary found:", contentType);
      return NextResponse.json({ success: false, message: "Invalid content type" }, { status: 400 });
    }

    const parts = parseMultipartParts(Buffer.from(buffer), boundary);

    const fields: Record<string, MultipartPart> = {};
    for (const part of parts) {
      fields[part.name] = part;
    }

    const audioPart = fields["audio"];
    if (!audioPart || !audioPart.data || audioPart.data.length === 0) {
      console.error("[admin/music/upload] Missing or empty audio. Fields:", Object.keys(fields));
      return NextResponse.json({ success: false, message: "No audio file provided" }, { status: 400 });
    }

    const title = fields["title"]?.data?.toString("utf8").trim() || "";
    const artist = fields["artist"]?.data?.toString("utf8").trim() || "";
    const durationStr = fields["durationSeconds"]?.data?.toString("utf8").trim() || "0";
    const durationSeconds = parseInt(durationStr, 10) || 0;

    // ── Reconstruct FormData for the backend ─────────────────────────────────
    const backendFormData = new FormData();
    backendFormData.append(
      "audio",
      new Blob([audioPart.data], { type: audioPart.contentType || "audio/mpeg" }),
      audioPart.filename || "track.mp3"
    );
    backendFormData.append("title", title || "Untitled");
    backendFormData.append("artist", artist || "Unknown Artist");
    backendFormData.append("durationSeconds", String(durationSeconds || 0));

    const coverPart = fields["cover"];
    if (coverPart?.data && coverPart.data.length > 0) {
      backendFormData.append(
        "cover",
        new Blob([coverPart.data], { type: coverPart.contentType || "image/jpeg" }),
        coverPart.filename
      );
    }

    // ── Forward to backend container via Docker internal DNS ─────────────────
    const backendRes = await fetch("http://backend:3001/api/v1/music/tracks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    const rawText = await backendRes.text();
    let responseData: Record<string, unknown>;
    try {
      responseData = JSON.parse(rawText);
    } catch {
      responseData = { message: rawText.slice(0, 300) };
    }

    return NextResponse.json(responseData, { status: backendRes.status });
  } catch (err) {
    console.error("[admin/music/upload] Unhandled error:", err);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}

interface MultipartPart {
  name: string;
  filename?: string;
  contentType?: string;
  data: Buffer;
}

function getMultipartBoundary(contentType: string): string | null {
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  return match ? (match[1] || match[2]) : null;
}

function parseMultipartParts(buffer: Buffer, boundary: string): MultipartPart[] {
  const parts: MultipartPart[] = [];
  const boundaryStart = Buffer.from("--" + boundary);
  const boundaryEnd = Buffer.from("--" + boundary + "--");

  let pos = 0;
  while (pos < buffer.length) {
    const bIdx = buffer.indexOf(boundaryStart, pos);
    if (bIdx === -1) break;

    let p = bIdx + boundaryStart.length;
    if (buffer[p] === 0x0d && buffer[p + 1] === 0x0a) p += 2;

    let nextB = buffer.indexOf(boundaryStart, p);
    const endB = buffer.indexOf(boundaryEnd, p);
    if (endB !== -1 && (nextB === -1 || endB < nextB)) nextB = endB;
    if (nextB === -1) nextB = buffer.length;

    let rawPart = buffer.slice(p, nextB);
    // Only strip trailing CRLF if it's a delimiter BEFORE the next boundary, not binary content.
    // Binary files may legitimately contain 0x0D 0x0A bytes.
    // Look for the last CRLF before the next boundary marker.
    if (rawPart.length >= 2) {
      const possibleBoundaryStart = nextB - 4; // 4 = len("--" + "\r\n")
      if (bIdx < possibleBoundaryStart && rawPart[rawPart.length - 2] === 0x0d && rawPart[rawPart.length - 1] === 0x0a) {
        rawPart = rawPart.slice(0, -2);
      }
    }

    const headerEnd = rawPart.indexOf(Buffer.from("\r\n\r\n"));
    let headerBlock = "";
    let bodyData: Buffer = Buffer.alloc(0);

    if (headerEnd !== -1) {
      headerBlock = rawPart.slice(0, headerEnd).toString("utf8");
      bodyData = rawPart.slice(headerEnd + 4);
    } else {
      const crlf = rawPart.indexOf(Buffer.from("\r\n"));
      if (crlf !== -1) {
        headerBlock = rawPart.slice(0, crlf).toString("utf8");
        bodyData = rawPart.slice(crlf + 2);
      } else {
        headerBlock = rawPart.toString("utf8");
        bodyData = Buffer.alloc(0);
      }
    }

    const nameMatch = headerBlock.match(/name="([^"]+)"/);
    const filenameMatch = headerBlock.match(/filename="([^"]+)"/);
    const ctMatch = headerBlock.match(/Content-Type:\s*([^\r\n]+)/i);

    if (nameMatch) {
      parts.push({
        name: nameMatch[1],
        filename: filenameMatch?.[1],
        contentType: ctMatch ? ctMatch[1].trim() : undefined,
        data: bodyData,
      });
    }

    pos = nextB + boundaryStart.length;
  }

  return parts;
}
