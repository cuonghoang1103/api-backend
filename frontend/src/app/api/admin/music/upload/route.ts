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

// ── Multipart helpers ──────────────────────────────────────────────────────────

function getMultipartBoundary(contentType: string): string | null {
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  return match ? (match[1] || match[2]) : null;
}

interface MultipartPart {
  name: string;
  filename?: string;
  contentType?: string;
  data: Buffer;
}

function parseMultipartParts(buffer: Buffer, boundary: string): MultipartPart[] {
  const parts: MultipartPart[] = [];
  const boundaryBytes = Buffer.from("--" + boundary);

  const boundaryPositions: number[] = [];
  let searchFrom = 0;
  while (searchFrom < buffer.length) {
    const idx = buffer.indexOf(boundaryBytes, searchFrom);
    if (idx === -1) break;
    boundaryPositions.push(idx);
    searchFrom = idx + 1;
  }

  for (let i = 0; i < boundaryPositions.length - 1; i++) {
    const bIdx = boundaryPositions[i];
    const nextB = boundaryPositions[i + 1];

    let p = bIdx + boundaryBytes.length + 2;
    if (p >= buffer.length) continue;

    let rawPart = buffer.slice(p, nextB);
    if (rawPart.length >= 2 && rawPart[rawPart.length - 2] === 0x0d && rawPart[rawPart.length - 1] === 0x0a) {
      rawPart = rawPart.slice(0, -2);
    }

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

/**
 * Build a multipart/form-data body from parts, returning raw bytes + boundary.
 * Uses a random boundary so it can't conflict with content.
 */
function buildMultipartBody(fields: {
  name: string;
  filename?: string;
  contentType?: string;
  data: Buffer;
}[]): { body: Buffer; boundary: string } {
  // Random boundary that won't appear in binary content
  const boundary = "----UploadBoundary" + Math.random().toString(36).slice(2, 10);
  const CRLF = Buffer.from("\r\n");
  const boundaryStart = Buffer.from("--" + boundary);
  const boundaryEnd = Buffer.from("--" + boundary + "--");

  const chunks: Buffer[] = [];

  for (const field of fields) {
    chunks.push(boundaryStart, CRLF);

    const headerLines: string[] = [
      `Content-Disposition: form-data; name="${field.name}"${
        field.filename ? `; filename="${field.filename}"` : ""
      }`,
    ];
    if (field.filename && field.contentType) {
      headerLines.push(`Content-Type: ${field.contentType}`);
    }

    chunks.push(Buffer.from(headerLines.join("\r\n") + "\r\n\r\n"));
    chunks.push(field.data);
    chunks.push(CRLF);
  }

  chunks.push(boundaryEnd, CRLF);
  return { body: Buffer.concat(chunks), boundary };
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

    const fields: Record<string, MultipartPart> = {};
    for (const part of parts) {
      fields[part.name] = part;
    }

    const audioPart = fields["audio"];
    if (!audioPart || !audioPart.data || audioPart.data.length === 0) {
      return NextResponse.json({ success: false, message: "No audio file provided" }, { status: 400 });
    }

    // ── Build forwarded multipart body with fresh boundary ─────────────────────
    const forwardedFields: { name: string; filename?: string; contentType?: string; data: Buffer }[] = [
      {
        name: "audio",
        filename: audioPart.filename || "track.mp3",
        contentType: audioPart.contentType || "audio/mpeg",
        data: audioPart.data,
      },
      {
        name: "title",
        data: Buffer.from((fields["title"]?.data?.toString("utf8").trim() || "Untitled"), "utf8"),
      },
      {
        name: "artist",
        data: Buffer.from((fields["artist"]?.data?.toString("utf8").trim() || "Unknown Artist"), "utf8"),
      },
      {
        name: "durationSeconds",
        data: Buffer.from(
          String(parseInt(fields["durationSeconds"]?.data?.toString("utf8").trim() || "0", 10) || 0),
          "utf8"
        ),
      },
    ];

    const coverPart = fields["cover"];
    if (coverPart?.data && coverPart.data.length > 0) {
      forwardedFields.push({
        name: "cover",
        filename: coverPart.filename,
        contentType: coverPart.contentType || "image/jpeg",
        data: coverPart.data,
      });
    }

    const { body: forwardedBody, boundary: forwardedBoundary } = buildMultipartBody(forwardedFields);

    // ── Forward to backend ────────────────────────────────────────────────────
    const backendRes = await fetch("http://backend:3001/api/v1/music/tracks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/form-data; boundary=${forwardedBoundary}`,
      },
      body: forwardedBody,
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
