/**
 * POST /api/revalidate
 *
 * Triggers Next.js ISR cache revalidation from the browser after a data mutation.
 * Called by admin shop/project pages after successful create/update/delete operations
 * so the public shop/project pages instantly reflect the latest data.
 *
 * Usage from browser:
 *   fetch('/api/revalidate', {
 *     method: 'POST',
 *     body: JSON.stringify({ paths: ['/shop', '/projects'], tags: ['products'] }),
 *     headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': SECRET },
 *   });
 *
 * Or from backend (webhook / post-commit hook):
 *   POST with secret header from server environment.
 */
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? '';

export const dynamic = 'force-dynamic';

interface RevalidateBody {
  paths?: string[];
  tags?: string[];
}

function isValidPath(path: string): boolean {
  const valid = [
    '/',
    '/shop',
    '/projects',
    '/courses',
    '/academy',
    '/admin',
  ];
  return valid.some((v) => path === v || path.startsWith(v + '/'));
}

export async function POST(request: NextRequest) {
  try {
    // ── Auth: require secret token (prevents abuse) ─────────────────────────
    const secret = request.headers.get('x-revalidate-secret') ?? '';
    const envSecret = process.env.REVALIDATE_SECRET ?? '';

    if (envSecret && secret !== envSecret) {
      return NextResponse.json(
        { success: false, message: 'Invalid revalidation secret' },
        { status: 401 }
      );
    }

    // ── Parse request body ─────────────────────────────────────────────────
    let body: RevalidateBody = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { paths = [], tags = [] } = body;
    const revalidated: string[] = [];

    // ── Revalidate paths ─────────────────────────────────────────────────
    for (const path of paths) {
      if (typeof path !== 'string' || !isValidPath(path)) {
        console.warn(`[revalidate] Skipping invalid path: ${path}`);
        continue;
      }
      revalidatePath(path);
      revalidated.push(`path:${path}`);
    }

    // ── Revalidate tags ───────────────────────────────────────────────────
    for (const tag of tags) {
      if (typeof tag !== 'string') continue;
      revalidateTag(tag);
      revalidated.push(`tag:${tag}`);
    }

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[revalidate] Error:', msg);
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}

// Allow GET for easy testing
export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret') ?? '';
  const envSecret = process.env.REVALIDATE_SECRET ?? '';

  if (envSecret && secret !== envSecret) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    message: 'revalidate endpoint active',
    env: {
      hasSecret: !!envSecret,
      nodeEnv: process.env.NODE_ENV,
    },
  });
}
