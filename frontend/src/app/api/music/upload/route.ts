/**
 * POST /api/music/upload
 *
 * Bypasses Nginx /api/v1/ proxy by living at /api/music/upload.
 * Uses raw Buffer parsing of multipart body to preserve exact field names —
 * avoids request.formData() which can silently drop fields when forwarding.
 *
 * Flow: browser → this route (Docker internal) → backend:3001
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // ── Validate auth ──────────────────────────────────────────────────────────
    let token = request.cookies.get("backend_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ── Read raw body and parse multipart ─────────────────────────────────────
    const buffer = await request.arrayBuffer();
    const contentType = request.headers.get("content-type") || "";
    const boundary = getBoundary(contentType);

    if (!boundary) {
      console.error("[/api/music/upload] No boundary found in content-type:", contentType);
      return NextResponse.json({ success: false, message: "Invalid content type" }, { status: 400 });
    }

    const parts = parseMultipart(Buffer.from(buffer), boundary);

    // Debug log all parsed parts
    console.log("[/api/music/upload] Parsed parts:", parts.map((p) => ({
      name: p.name,
      hasFilename: !!p.filename,
      filename: p.filename,
      contentType: p.contentType,
      valueLength: p.value?.length,
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
      console.error("[/api/music/upload] Missing audio part. Fields found:", Object.keys(fields));
      return NextResponse.json({ success: false, message: "No audio file provided" }, { status: 400 });
    }

    const title = String((fields["title"]?.value || "").trim());
    const artist = String((fields["artist"]?.value || "").trim());
    const durationSeconds = parseInt(String(fields["durationSeconds"]?.value || "0"), 10);

    // ── Reconstruct FormData for the backend ─────────────────────────────────
    const backendFormData = new FormData();

    const audioBlob = new Blob([audioPart.data as BlobPart], {
      type: audioPart.contentType || "audio/mpeg",
    });
    backendFormData.append("audio", audioBlob, audioPart.filename!);

    backendFormData.append("title", title || "Untitled");
    backendFormData.append("artist", artist || "Unknown Artist");
    backendFormData.append("durationSeconds", String(durationSeconds || 0));

    // Cover file — if present
    const coverPart = fields["cover"];
    if (coverPart && coverPart.filename && coverPart.data) {
      const coverBlob = new Blob([coverPart.data as BlobPart], {
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

    console.log("[/api/music/upload] Backend response:", backendRes.status, responseData);

    return NextResponse.json(responseData, { status: backendRes.status });
  } catch (err) {
    console.error("[/api/music/upload] Unhandled error:", err);
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
    if (buffer[pos] === 0x0D && buffer[pos + 1] === 0x0A) pos += 2;

    let nextBoundary = buffer.indexOf(boundaryBuffer, pos);
    let endIdx = buffer.indexOf(endBoundary, pos);
    if (endIdx !== -1 && (nextBoundary === -1 || endIdx < nextBoundary)) {
      nextBoundary = endIdx;
    }
    if (nextBoundary === -1) nextBoundary = buffer.length;

    // Slice part content (between boundary markers)
    const partRaw = buffer.slice(pos, nextBoundary);
    // Strip trailing CRLF
    const trimmed = partRaw[partRaw.length - 1] === 0x0A ? partRaw.slice(0, -1) : partRaw;
    const partData = trimmed[trimmed.length - 1] === 0x0D ? trimmed.slice(0, -1) : trimmed;

    // Header block ends at first CRLF
    const headerEndIdx = partData.indexOf(Buffer.from("\r\n\r\n"));
    let headerBlock = "";
    let bodyData: Buffer = Buffer.alloc(0);

    if (headerEndIdx !== -1) {
      headerBlock = partData.slice(0, headerEndIdx).toString("utf8");
      bodyData = partData.slice(headerEndIdx + 4);
    } else {
      const singleCRLF = partData.indexOf(Buffer.from("\r\n"));
      if (singleCRLF !== -1) {
        headerBlock = partData.slice(0, singleCRLF).toString("utf8");
        bodyData = partData.slice(singleCRLF + 2);
      } else {
        headerBlock = partData.toString("utf8");
        bodyData = Buffer.alloc(0);
      }
    }

    const nameMatch = headerBlock.match(/name="([^"]+)"/);
    const filenameMatch = headerBlock.match(/filename="([^"]+)"/);
    const ctMatch = headerBlock.match(/Content-Type:\s*([^\r\n]+)/i);

    if (!nameMatch) { start = nextBoundary + boundaryBuffer.length; continue; }

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
