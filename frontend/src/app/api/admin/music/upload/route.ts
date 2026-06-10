/**
 * POST /api/admin/music/upload
 *
 * Admin upload proxy for /admin/music page.
 * Uses raw Buffer parsing of multipart body (same as /api/music/upload)
 * to correctly extract audio + cover files, then forwards to the backend.
 *
 * Flow: browser → this route → backend:3001/api/v1/music/tracks
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

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

    // ── Read raw body and parse multipart manually ────────────────────────────
    const buffer = await request.arrayBuffer();
    const contentType = request.headers.get("content-type") || "";
    const boundary = getBoundary(contentType);

    if (!boundary) {
      console.error("[admin/music/upload] No boundary found:", contentType);
      return NextResponse.json({ success: false, message: "Invalid content type" }, { status: 400 });
    }

    const parts = parseMultipart(Buffer.from(buffer), boundary);

    // Debug log all parsed parts
    console.log("[admin/music/upload] Parsed parts:", parts.map((p) => ({
      name: p.name,
      hasFilename: !!p.filename,
      filename: p.filename,
      contentType: p.contentType,
      dataLength: p.data?.length,
    })));

    // Extract named fields
    const fields: Record<string, MultipartPart> = {};
    for (const part of parts) {
      fields[part.name] = part;
    }

    // Validate required audio field
    const audioPart = fields["audio"];
    if (!audioPart || !audioPart.filename || !audioPart.data) {
      console.error("[admin/music/upload] Missing audio part. Fields found:", Object.keys(fields));
      return NextResponse.json({ success: false, message: "No audio file provided" }, { status: 400 });
    }

    const title = String((fields["title"]?.value || "").trim());
    const artist = String((fields["artist"]?.value || "").trim());
    const durationSeconds = parseInt(String(fields["durationSeconds"]?.value || "0"), 10);

    // ── Reconstruct FormData for the backend ─────────────────────────────────
    const backendFormData = new FormData();

    const audioBlob = new Blob([audioPart.data], {
      type: audioPart.contentType || "audio/mpeg",
    });
    backendFormData.append("audio", audioBlob, audioPart.filename!);

    backendFormData.append("title", title || "Untitled");
    backendFormData.append("artist", artist || "Unknown Artist");
    backendFormData.append("durationSeconds", String(durationSeconds || 0));

    // Cover file — if present
    const coverPart = fields["cover"];
    if (coverPart && coverPart.filename && coverPart.data) {
      const coverBlob = new Blob([coverPart.data], {
        type: coverPart.contentType || "image/jpeg",
      });
      backendFormData.append("cover", coverBlob, coverPart.filename);
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

    console.log("[admin/music/upload] Backend response:", backendRes.status, responseData, `(+${Date.now() - startedAt}ms)`);

    return NextResponse.json(responseData, { status: backendRes.status });
  } catch (err) {
    console.error("[admin/music/upload] Unhandled error:", err);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getBoundary(contentType: string): string | null {
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  return match ? (match[1] || match[2]) : null;
}

interface MultipartPart {
  name: string;
  value?: string;
  filename?: string;
  contentType?: string;
  data?: Buffer;
}

function parseMultipart(buffer: Buffer, boundary: string): MultipartPart[] {
  const parts: MultipartPart[] = [];
  const boundaryBuffer = Buffer.from("--" + boundary);
  const endBoundary = Buffer.from("--" + boundary + "--");

  let start = 0;

  while (start < buffer.length) {
    const boundaryIdx = buffer.indexOf(boundaryBuffer, start);
    if (boundaryIdx === -1) break;

    let pos = boundaryIdx + boundaryBuffer.length;
    // Skip CRLF after boundary
    if (buffer[pos] === 0x0D && buffer[pos + 1] === 0x0A) pos += 2;

    // Find end of this part
    let nextBoundary = buffer.indexOf(boundaryBuffer, pos);
    let endIdx = buffer.indexOf(endBoundary, pos);
    if (endIdx !== -1 && (nextBoundary === -1 || endIdx < nextBoundary)) {
      nextBoundary = endIdx;
    }
    if (nextBoundary === -1) nextBoundary = buffer.length;

    // Slice part content (between boundary markers)
    let partRaw = buffer.slice(pos, nextBoundary);
    // Strip trailing CRLF
    if (partRaw[partRaw.length - 1] === 0x0A) partRaw = partRaw.slice(0, -1);
    if (partRaw[partRaw.length - 1] === 0x0D) partRaw = partRaw.slice(0, -1);

    // Header block ends at first CRLFCRLF
    const headerEndIdx = partRaw.indexOf(Buffer.from("\r\n\r\n"));
    let headerBlock = "";
    let bodyData: Buffer = Buffer.alloc(0);

    if (headerEndIdx !== -1) {
      headerBlock = partRaw.slice(0, headerEndIdx).toString("utf8");
      bodyData = partRaw.slice(headerEndIdx + 4);
    } else {
      const singleCRLF = partRaw.indexOf(Buffer.from("\r\n"));
      if (singleCRLF !== -1) {
        headerBlock = partRaw.slice(0, singleCRLF).toString("utf8");
        bodyData = partRaw.slice(singleCRLF + 2);
      } else {
        headerBlock = partRaw.toString("utf8");
        bodyData = Buffer.alloc(0);
      }
    }

    const nameMatch = headerBlock.match(/name="([^"]+)"/);
    const filenameMatch = headerBlock.match(/filename="([^"]+)"/);
    const ctMatch = headerBlock.match(/Content-Type:\s*([^\r\n]+)/i);

    if (!nameMatch) {
      start = nextBoundary + boundaryBuffer.length;
      continue;
    }

    const part: MultipartPart = { name: nameMatch[1] };

    if (filenameMatch) {
      part.filename = filenameMatch[1];
      part.contentType = ctMatch ? ctMatch[1].trim() : "application/octet-stream";
      part.data = bodyData;
    } else {
      part.value = bodyData.toString("utf8");
    }

    parts.push(part);
    start = nextBoundary + boundaryBuffer.length;
  }

  return parts;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}
