import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Local Next.js route for chat — proxies to backend SSE endpoint.
 *
 * This route used to call Google Gemini directly, but the project
 * standardized on Groq via the Node.js backend at /api/v1/ai/chat.
 * To avoid duplicating AI provider configuration, we simply forward
 * the user's message to the backend and stream the response back.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || 'https://api.cuongthai.com';

    const upstream = await fetch(`${apiBase}/api/v1/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward auth cookie/header if browser sent it
        cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify({
        message,
        history: Array.isArray(body.history) ? body.history : [],
        topK: typeof body.topK === 'number' ? body.topK : 5,
      }),
      cache: 'no-store',
    });

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => 'Upstream error');
      return NextResponse.json(
        { error: `Backend error (${upstream.status}): ${errText}` },
        { status: upstream.status || 502 },
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Chat Proxy Error]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
