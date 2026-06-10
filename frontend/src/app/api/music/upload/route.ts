/**
 * POST /api/music/upload
 *
 * Bypasses Nginx /api/v1/ proxy by living at /api/music/upload.
 * Manually iterates form fields to preserve exact field names and types —
 * no reliance on request.formData() which can silently drop or swap fields.
 *
 * Flow: browser → this route → backend container (http://backend:3001)
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

    // ── Read raw body as buffer and manually parse multipart ──────────────────
    const buffer = await request.arrayBuffer();
    const boundary = getBoundary(request.headers.get("content-type") || "");

    if (!boundary) {
      return NextResponse.json({ success: false, message: "Invalid content type" }, { status: 400 });
    }

    const parts = parseMultipart(Buffer.from(buffer), boundary);

    // Extract named fields
    const fields: Record<string, { value: string } | { value: Buffer; filename: string; contentType: string }> = {};
    for (const part of parts) {
      fields[part.name] = part;
    }

    // Validate required audio field
    const audioPart = fields["audio"];
    if (!audioPart || !("filename" in audioPart) || !audioPart.filename) {
      return NextResponse.json({ success: false, message: "No audio file provided" }, { status: 400 });
    }

    const title = String((fields["title"] as any)?.value || "");
    const artist = String((fields["artist"] as any)?.value || "");
    const durationSeconds = parseInt(String((fields["durationSeconds"] as any)?.value || "0"), 10);

    // ── Reconstruct FormData for the backend ─────────────────────────────────
    const backendFormData = new FormData();

    // Audio file — use the raw Buffer to avoid any type mangling
    const audioBlob = new Blob([audioPart.value], { type: audioPart.contentType || "audio/mpeg" });
    backendFormData.append("audio", audioBlob, audioPart.filename);

    backendFormData.append("title", title);
    backendFormData.append("artist", artist);
    backendFormData.append("durationSeconds", String(durationSeconds || 0));

    // Cover file — if present, forward it
    const coverPart = fields["cover"];
    if (coverPart && "filename" in coverPart && coverPart.filename) {
      const coverBlob = new Blob([coverPart.value], { type: coverPart.contentType || "image/jpeg" });
      backendFormData.append("cover", coverBlob, coverPart.filename);
    }

    // ── Forward to backend container via Docker internal DNS ─────────────────
    const res = await fetch("http://backend:3001/api/v1/music/tracks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // NOTE: Do NOT set Content-Type — fetch sets it with boundary automatically
      },
      body: backendFormData,
    });

    const rawText = await res.text();
    try {
      const data = JSON.parse(rawText);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json(
        { success: false, message: rawText.slice(0, 300) || "Invalid backend response" },
        { status: res.status || 502 }
      );
    }
  } catch (err) {
    console.error("[/api/music/upload] Error:", err);
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
    // Find next boundary
    let boundaryIdx = buffer.indexOf(boundaryBuffer, start);
    if (boundaryIdx === -1) break;

    boundaryIdx += boundaryBuffer.length;
    // Skip \r\n after boundary
    if (buffer[boundaryIdx] === 0x0D && buffer[boundaryIdx + 1] === 0x0A) boundaryIdx += 2;

    // Find next boundary (or end)
    let nextBoundaryIdx = buffer.indexOf(boundaryBuffer, boundaryIdx);
    let endBoundaryIdx = buffer.indexOf(endBoundary, boundaryIdx);

    if (endBoundaryIdx !== -1 && (nextBoundaryIdx === -1 || endBoundaryIdx < nextBoundaryIdx)) {
      nextBoundaryIdx = endBoundaryIdx;
    }

    if (nextBoundaryIdx === -1) nextBoundaryIdx = buffer.length;

    const partData = buffer.slice(boundaryIdx, nextBoundaryIdx);
    // Trim trailing \r\n
    const trimmed = partData[partData.length - 1] === 0x0A ? partData.slice(0, -1) : partData;
    const finalData = trimmed[trimmed.length - 1] === 0x0D ? trimmed.slice(0, -1) : trimmed;

    // Parse Content-Disposition header
    const headerEnd = finalData.indexOf(0x0D, 0x0A);
    const headerBlock = headerEnd !== -1 ? finalData.slice(0, headerEnd).toString("utf8") : "";
    const bodyStart = headerEnd !== -1 ? headerEnd + 2 : 0;
    const bodyData = finalData.slice(bodyStart);

    // Extract name and filename from Content-Disposition
    const nameMatch = headerBlock.match(/name="([^"]+)"/);
    const filenameMatch = headerBlock.match(/filename="([^"]+)"/);
    const contentTypeMatch = headerBlock.match(/Content-Type:\s*([^\r\n]+)/i);

    if (!nameMatch) { start = nextBoundaryIdx + boundaryBuffer.length; continue; }

    const part: MultipartPart = { name: nameMatch[1] };

    if (filenameMatch) {
      part.filename = filenameMatch[1];
      part.contentType = contentTypeMatch ? contentTypeMatch[1].trim() : "application/octet-stream";
      part.data = bodyData;
    } else {
      part.value = bodyData.toString("utf8");
    }

    parts.push(part);
    start = nextBoundaryIdx + boundaryBuffer.length;
  }

  return parts;
}
