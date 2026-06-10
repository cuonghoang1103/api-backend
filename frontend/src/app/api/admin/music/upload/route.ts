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

    // ── Read raw body and parse multipart ─────────────────────────────────────
    // Nginx may not forward multipart/form-data Content-Type, so we use
    // arrayBuffer() and parse the multipart body manually.
    const buffer = await request.arrayBuffer();
    const contentType = request.headers.get("content-type") || "";
    const boundary = getMultipartBoundary(contentType);

    if (!boundary) {
      return NextResponse.json({ success: false, message: "Invalid content type" }, { status: 400 });
    }

    // DEBUG: log raw incoming data
    const parts = parseMultipartParts(Buffer.from(buffer), boundary);

    const fields: Record<string, MultipartPart> = {};
    for (const part of parts) {
      fields[part.name] = part;
    }

    // DEBUG: log all parsed parts
    console.log("[admin/music/upload] Fields after parsing:", Object.keys(fields));

    const audioPart = fields["audio"];
    if (!audioPart || !audioPart.data || audioPart.data.length === 0) {
      console.error("[admin/music/upload] Missing audio. Fields found:", Object.keys(fields));
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
    backendFormData.append("durationSeconds", String(durationSeconds));

    const coverPart = fields["cover"];
    if (coverPart?.data && coverPart.data.length > 0) {
      backendFormData.append(
        "cover",
        new Blob([coverPart.data], { type: coverPart.contentType || "image/jpeg" }),
        coverPart.filename
      );
    }

    // ── Forward to backend container via Docker internal DNS ─────────────────
    console.log("[admin/music/upload] → backend: audioContentType:", audioPart.contentType, "size:", audioPart.data.length, "audioFilename:", audioPart.filename);
    console.log("[admin/music/upload] → backend: cover:", coverPart?.filename, coverPart?.contentType);
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

// ── Types ────────────────────────────────────────────────────────────────────

interface MultipartPart {
  name: string;
  filename?: string;
  contentType?: string;
  data: Buffer;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getMultipartBoundary(contentType: string): string | null {
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  return match ? (match[1] || match[2]) : null;
}

/**
 * Parse a multipart/form-data body into parts.
 *
 * Key fix: collect ALL boundary positions first (indexOf with +1 search),
 * then iterate pairs [boundary_i, boundary_i+1] to extract each part.
 * The old approach (pos = nextB + boundaryLen) skipped boundaries whose
 * "--boundary\r\n" was absorbed into the previous slice's offset range.
 */
function parseMultipartParts(buffer: Buffer, boundary: string): MultipartPart[] {
  const parts: MultipartPart[] = [];
  const boundaryBytes = Buffer.from("--" + boundary);

  // Collect all boundary positions — O(n) single pass
  const boundaryPositions: number[] = [];
  let searchFrom = 0;
  while (searchFrom < buffer.length) {
    const idx = buffer.indexOf(boundaryBytes, searchFrom);
    if (idx === -1) break;
    boundaryPositions.push(idx);
    searchFrom = idx + 1;
  }

  // Iterate over consecutive boundary pairs
  for (let i = 0; i < boundaryPositions.length - 1; i++) {
    const bIdx = boundaryPositions[i];
    const nextB = boundaryPositions[i + 1];

    // Content starts after "--boundary\r\n"
    let p = bIdx + boundaryBytes.length + 2;
    if (p >= buffer.length) continue;

    // Raw content ends before the next "--boundary\r\n"
    let rawPart = buffer.slice(p, nextB);

    // Strip trailing "\r\n" that precedes the next boundary delimiter
    if (rawPart.length >= 2 && rawPart[rawPart.length - 2] === 0x0d && rawPart[rawPart.length - 1] === 0x0a) {
      rawPart = rawPart.slice(0, -2);
    }

    // Header block ends at first CRLFCRLF
    const headerEndIdx = rawPart.indexOf(Buffer.from("\r\n\r\n"));
    let headerBlock = "";
    let bodyData: Buffer = Buffer.alloc(0);

    if (headerEndIdx !== -1) {
      headerBlock = rawPart.slice(0, headerEndIdx).toString("utf8");
      bodyData = rawPart.slice(headerEndIdx + 4);
    } else {
      const crlfIdx = rawPart.indexOf(Buffer.from("\r\n"));
      if (crlfIdx !== -1) {
        headerBlock = rawPart.slice(0, crlfIdx).toString("utf8");
        bodyData = rawPart.slice(crlfIdx + 2);
      } else {
        headerBlock = rawPart.toString("utf8");
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
