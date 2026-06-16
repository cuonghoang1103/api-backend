/**
 * POST /api/admin/music/upload
 *
 * Admin upload proxy for /admin/music page.
 * Forwards to the Node.js backend /api/v1/music/tracks endpoint.
 *
 * Flow: browser → this route → backend:3001/api/v1/music/tracks
 */
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://backend:3001";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Magic bytes for type detection ─────────────────────────────────────────────

const AUDIO_MAGIC: { sig: number[]; mime: string }[] = [
  { sig: [0xFF, 0xFB], mime: 'audio/mpeg' },
  { sig: [0xFF, 0xFA], mime: 'audio/mpeg' },
  { sig: [0xFF, 0xF3], mime: 'audio/mpeg' },
  { sig: [0xFF, 0xF2], mime: 'audio/mpeg' },
  { sig: [0x49, 0x44, 0x33], mime: 'audio/mpeg' }, // ID3
  { sig: [0x4F, 0x67, 0x67, 0x53], mime: 'audio/ogg' },
  { sig: [0x52, 0x49, 0x46, 0x46], mime: 'audio/wav' },
  { sig: [0x66, 0x4C, 0x61, 0x43], mime: 'audio/flac' },
  { sig: [0x4D, 0x54, 0x72, 0x61], mime: 'audio/mp4' },
];

const IMAGE_MAGIC: { sig: number[]; mime: string }[] = [
  { sig: [0xFF, 0xD8, 0xFF], mime: 'image/jpeg' },
  { sig: [0x89, 0x50, 0x4E, 0x47], mime: 'image/png' },
  { sig: [0x47, 0x49, 0x46, 0x38], mime: 'image/gif' },
];

function detectMagicBytes(data: Buffer): string {
  const bytes = new Uint8Array(data.slice(0, 16));
  for (const { sig, mime } of [...AUDIO_MAGIC, ...IMAGE_MAGIC]) {
    if (sig.every((b, i) => bytes[i] === b)) return mime;
  }
  return '';
}

function getMimeFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac',
    ogg: 'audio/ogg', wav: 'audio/wav', flac: 'audio/flac',
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
  };
  return map[ext] || 'application/octet-stream';
}

// ── Multipart helpers ──────────────────────────────────────────────────────────

function getMultipartBoundary(contentType: string): string | null {
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  if (!match) return null;
  return (match[1] || match[2] || "").trim() || null;
}

interface MultipartPart {
  name: string;
  filename?: string;
  contentType?: string;
  data: Buffer;
}

function parseMultipartParts(buffer: Buffer, boundary: string): MultipartPart[] {
  const parts: MultipartPart[] = [];
  const boundaryDashed = "--" + boundary;
  const boundaryBytes = Buffer.from(boundaryDashed);
  const CRLF = Buffer.from("\r\n");

  const positions: number[] = [];

  // Check start of buffer
  if (
    buffer.length >= boundaryBytes.length &&
    buffer.compare(buffer, 0, boundaryBytes.length, 0, boundaryBytes.length) === 0
  ) {
    positions.push(0);
  }

  // Find all CRLF+boundary occurrences
  let pos = 0;
  while (pos < buffer.length) {
    const idx = buffer.indexOf(CRLF, pos);
    if (idx === -1) break;
    const after = idx + CRLF.length;
    if (
      after + boundaryBytes.length <= buffer.length &&
      buffer.compare(buffer, after, after + boundaryBytes.length, 0, boundaryBytes.length) === 0
    ) {
      if (positions[positions.length - 1] !== after) {
        positions.push(after);
      }
    }
    pos = idx + 1;
  }

  // Parse each part between boundaries
  for (let i = 0; i < positions.length - 1; i++) {
    const start = positions[i];
    const nextStart = positions[i + 1];

    let offset = start + boundaryBytes.length;
    if (offset + 2 <= buffer.length &&
        buffer[offset] === 0x2d && buffer[offset + 1] === 0x2d) {
      offset += 2;
    }
    if (offset + 2 <= buffer.length &&
        buffer[offset] === 0x0d && buffer[offset + 1] === 0x0a) {
      offset += 2;
    }

    if (offset >= nextStart) continue;

    let rawPart = buffer.slice(offset, nextStart);
    if (rawPart.length >= 2 &&
        rawPart[rawPart.length - 2] === 0x0d &&
        rawPart[rawPart.length - 1] === 0x0a) {
      rawPart = rawPart.slice(0, -2);
    }

    const headerEnd = rawPart.indexOf(Buffer.from("\r\n\r\n"));
    let headerBlock = "";
    let body: Buffer = Buffer.alloc(0);

    if (headerEnd !== -1) {
      headerBlock = rawPart.slice(0, headerEnd).toString("utf8");
      body = rawPart.slice(headerEnd + 4);
    } else {
      const firstCRLF = rawPart.indexOf(CRLF);
      if (firstCRLF !== -1) {
        headerBlock = rawPart.slice(0, firstCRLF).toString("utf8");
        body = rawPart.slice(firstCRLF + 2);
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
      data: body,
    });
  }

  return parts;
}

// ── Route handler ───────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
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

    // ── Parse incoming multipart ───────────────────────────────────────────────
    const buffer = await request.arrayBuffer();
    const contentType = request.headers.get("content-type") || "";
    const boundary = getMultipartBoundary(contentType);
    if (!boundary) {
      return NextResponse.json({ success: false, message: "Invalid content type" }, { status: 400 });
    }

    const parts = parseMultipartParts(Buffer.from(buffer), boundary);
    console.log('[admin/music/upload] Parsed parts:', parts.map(p => ({
      name: p.name, filename: p.filename, ct: p.contentType,
      len: p.data.length, hex: p.data.slice(0, 8).toString('hex'),
    })));

    const fields: Record<string, MultipartPart> = {};
    for (const part of parts) {
      fields[part.name] = part;
    }

    // ── Validate audio part ────────────────────────────────────────────────────
    const audioPart = fields["audio"];
    if (!audioPart || audioPart.data.length === 0) {
      return NextResponse.json({ success: false, message: "No audio file provided" }, { status: 400 });
    }

    // Use magic bytes to detect actual audio type
    const detectedMime = detectMagicBytes(audioPart.data);
    const audioFilename = audioPart.filename || "track.mp3";
    const audioMime = detectedMime || getMimeFromFilename(audioFilename);

    console.log('[admin/music/upload] Audio detected:', detectedMime, 'browser:', audioPart.contentType, 'file:', audioFilename);

    const validAudioMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/mp4', 'audio/x-m4a', 'audio/opus'];
    if (!validAudioMimes.includes(audioMime)) {
      return NextResponse.json({
        success: false,
        message: `Invalid audio file format. Detected: ${audioMime}, expected audio file.`,
      }, { status: 400 });
    }

    // ── Validate cover part (if provided) ───────────────────────────────────────
    const coverPart = fields["cover"];
    let coverMime = "";
    if (coverPart?.data && coverPart.data.length > 0) {
      const coverDetected = detectMagicBytes(coverPart.data);
      const coverFilename = coverPart.filename || "cover.jpg";
      coverMime = coverDetected || getMimeFromFilename(coverFilename);
      const validImageMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validImageMimes.includes(coverMime)) {
        return NextResponse.json({
          success: false,
          message: `Invalid cover image format. Detected: ${coverMime}`,
        }, { status: 400 });
      }
    }

    // ── Build FormData for backend (uses native fetch — no Buffer body issue) ──
    const formData = new FormData();

    // Append audio as a Blob with correct MIME type
    const audioBlob = new Blob([audioPart.data as BlobPart], { type: audioMime });
    formData.append("audio", audioBlob, audioFilename);

    // Append text fields
    formData.append("title", (fields["title"]?.data?.toString("utf8").trim() || "Untitled"));
    formData.append("artist", (fields["artist"]?.data?.toString("utf8").trim() || "Unknown Artist"));
    formData.append("durationSeconds", String(
      parseInt(fields["durationSeconds"]?.data?.toString("utf8").trim() || "0", 10) || 0
    ));

    // Append cover if provided
    if (coverPart?.data && coverPart.data.length > 0) {
      const coverBlob = new Blob([coverPart.data as BlobPart], { type: coverMime || "image/jpeg" });
      formData.append("cover", coverBlob, coverPart.filename || "cover.jpg");
    }

    console.log('[admin/music/upload] FWD audio:', audioMime, 'len:', audioPart.data.length, 'hex:', audioPart.data.slice(0, 8).toString('hex'));

    // ── Forward to backend ────────────────────────────────────────────────────
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/music/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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
