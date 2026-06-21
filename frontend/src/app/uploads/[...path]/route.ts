/**
 * /uploads/[...path] — Serves uploaded static files.
 *
 * In PRODUCTION (Docker): Nginx serves /uploads/* directly from the Docker volume
 * (see nginx/nginx.conf). This Next.js route acts as a fallback for:
 *  - Edge Runtime contexts where Nginx can't reach
 *  - Development without Docker
 *
 * In LOCAL DEV: proxies to http://localhost:3001/uploads/* where the backend
 * Express server exposes the files via express.static.
 *
 * In STANDALONE BUILD: serves files directly from standalone/uploads/ directory.
 */
import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || 'http://cuonghoangdev_backend:3001';

// In Next.js standalone Docker builds, assets are copied here
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), 'standalone', 'uploads');

const MIME_MAP: Record<string, string> = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.aac': 'audio/aac',
  '.m4a': 'audio/mp4',
  '.opus': 'audio/opus',
  '.webm': 'audio/webm',
  '.mp4': 'video/mp4',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const filePath = (params.path || []).join('/');

  // Security: block path traversal attacks
  if (filePath.includes('..') || filePath.includes('~')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Strategy 1: Serve from local uploads directory (standalone Docker build)
  const localPath = path.join(LOCAL_UPLOADS_DIR, filePath);
  try {
    const stats = await stat(localPath);
    if (stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_MAP[ext] || 'application/octet-stream';
      const fileBuffer = await readFile(localPath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(fileBuffer.length),
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
  } catch {
    // Not found locally
  }

  // Strategy 2: Proxy to backend container (local dev or fallback)
  try {
    const res = await fetch(`${BACKEND_URL}/uploads/${filePath}`);
    if (res.ok || res.status === 206) {
      const headers: Record<string, string> = {};
      res.headers.forEach((val, key) => { headers[key] = val; });
      const body = await res.arrayBuffer();
      return new NextResponse(body, { status: res.status, headers });
    }
  } catch {
    // Backend unreachable
  }

  return new NextResponse('File not found', { status: 404 });
}
