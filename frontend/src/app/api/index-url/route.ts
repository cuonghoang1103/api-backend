import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Runs on every invocation (we mutate the index queue immediately,
// so caching would just delay the request to Google's API).
// `nodejs` runtime is required because googleapis uses Node-only
// crypto APIs for JWT signing — the edge runtime can't sign.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ── Configuration ─────────────────────────────────────────
// We authenticate as a Google Service Account using a JSON
// key file. The key file lives in the project tree but is
// excluded by .gitignore — see the comment in src/config/
// below. In production the file is copied into the container
// out-of-band (see deploy-vps.sh).
//
// We deliberately resolve the key file path from the project
// root rather than `process.cwd()`. Both work locally, but
// during `next start` the cwd is the `.next/standalone`
// directory, which doesn't contain src/. Anchoring to
// `process.cwd()` would silently 503 in production.
const KEY_FILE = path.join(process.cwd(), 'src', 'config', 'google-key.json');

// Only allow this site to be the target of an index ping.
// Without this, anyone hitting the public endpoint could
// submit arbitrary URLs to Google's quota and burn through
// the daily index budget. Allow-list by hostname rather
// than full URL so that the rule keeps working when we
// add new paths or change query strings.
const ALLOWED_HOSTNAMES = new Set([
  'cuongthai.com',
  'www.cuongthai.com',
  'cuonghoang.xyz',
  'www.cuonghoang.xyz',
]);

// Google caps URL_UPDATED submissions at 200 per day per
// service account for first-time owners, then up to a few
// thousand for established owners. We additionally throttle
// per-process to prevent accidental loops from spamming
// Google's quota. The map holds the timestamp of the most
// recent submission per URL.
const RECENT_SUBMISSIONS = new Map<string, number>();
const MIN_INTERVAL_MS = 60_000; // 1 minute between same-URL calls

// ── Types ─────────────────────────────────────────────────
// We use a union of success/error response shapes rather than
// a single object with optional fields. This forces the caller
// to be explicit about which fields are present in each case
// (and TypeScript will catch a `success: true` response that's
// missing the URL — vs. an error response that accidentally
// leaks internal data).

type IndexRequestBody = {
  url?: unknown
}

type IndexSuccess = {
  success: true
  url: string
  notificationType: 'URL_UPDATED'
  metadata?: unknown
}

type IndexError = {
  success: false
  error: string
  // Optional debug fields — only set when the request reached
  // Google and Google returned a structured error. Helpful for
  // diagnosing ownership/permission issues from the response
  // body without having to dig into server logs.
  googleStatus?: number
  googleCode?: string | null
}

type IndexResponse = IndexSuccess | IndexError

// ── Helpers ───────────────────────────────────────────────
/**
 * Lightweight URL validation. We deliberately don't use
 * `new URL()` alone because it accepts a lot of forms
 * (mailto:, file:, javascript:, etc.) that we don't want
 * to forward to Google's indexer. The protocol allow-list
 * keeps the surface small.
 */
function validateUrl(raw: unknown): { ok: true; url: string } | { ok: false; error: string } {
  if (typeof raw !== 'string') {
    return { ok: false, error: 'url must be a string' }
  }
  const url = raw.trim()
  if (!url) {
    return { ok: false, error: 'url is required' }
  }
  if (url.length > 2048) {
    return { ok: false, error: 'url too long (max 2048 chars)' }
  }
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return { ok: false, error: 'url is not a valid URL' }
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { ok: false, error: `unsupported protocol: ${parsed.protocol}` }
  }
  if (!ALLOWED_HOSTNAMES.has(parsed.hostname)) {
    return {
      ok: false,
      error: `hostname not allowed: ${parsed.hostname}`,
    }
  }
  return { ok: true, url }
}

/**
 * Throttle repeated submissions of the same URL. We keep a
 * tiny in-memory map; it's per-process and lost on cold
 * start, which is the right behavior (cold start = no recent
 * history, which means we can submit again).
 */
function shouldThrottle(url: string): boolean {
  const last = RECENT_SUBMISSIONS.get(url)
  if (!last) return false
  return Date.now() - last < MIN_INTERVAL_MS
}

/**
 * Build a JWT auth client from the service-account JSON.
 * We read the file inside the handler (not at module top
 * level) so the build doesn't fail if the file is missing
 * during static analysis. The function throws if the key
 * can't be loaded — the caller turns that into a 503.
 */
async function getIndexingClient() {
  let raw: string
  try {
    raw = await readFile(KEY_FILE, 'utf-8')
  } catch (e: any) {
    throw new Error(
      `Google service-account key not found at ${KEY_FILE}. ` +
        `Copy google-key.json from your local machine and rebuild.`,
    )
  }
  let credentials: {
    client_email?: string
    private_key?: string
  }
  try {
    credentials = JSON.parse(raw)
  } catch {
    throw new Error('google-key.json is not valid JSON')
  }
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error(
      'google-key.json is missing client_email or private_key',
    )
  }
  // googleapis accepts a JWT client that signs requests on
  // our behalf. The scope is the indexing API specifically —
  // we don't want to ask for any wider read/write access than
  // we actually use.
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })
  await auth.authorize()
  return google.indexing({ version: 'v3', auth })
}

// ── Route handler ─────────────────────────────────────────
/**
 * POST /api/index-url
 *
 * Body: { url: "https://cuongthai.com/blog/my-new-post" }
 *
 * Asks Google to fetch + re-index the URL immediately.
 * Normally we'd submit a sitemap and wait for Google's
 * crawl cycle (a few days to a few weeks), but for time-
 * sensitive content (a new blog post, a flash sale, a
 * breaking tutorial) we can use the Indexing API to ask
 * Google to crawl the URL on demand.
 *
 * Quota: 200 URL_UPDATED calls per day per service account
 * (free). For higher volume you have to apply for elevated
 * quota.
 */
export async function POST(req: NextRequest) {
  // ── Parse + validate input ────────────────────────────
  let body: IndexRequestBody
  try {
    body = (await req.json()) as IndexRequestBody
  } catch {
    return NextResponse.json(
      { success: false, error: 'invalid JSON body' },
      { status: 400 },
    )
  }

  const validation = validateUrl(body?.url)
  if (!validation.ok) {
    return NextResponse.json(
      { success: false, error: validation.error } satisfies IndexResponse,
      { status: 400 },
    )
  }
  const url = validation.url

  // ── Throttle ──────────────────────────────────────────
  if (shouldThrottle(url)) {
    return NextResponse.json(
      {
        success: false,
        error: `URL was submitted less than ${MIN_INTERVAL_MS / 1000}s ago. ` +
          'Wait and try again.',
      } satisfies IndexResponse,
      { status: 429 },
    )
  }

  // ── Submit to Google ──────────────────────────────────
  try {
    const indexing = await getIndexingClient()
    const result = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: 'URL_UPDATED',
      },
    })
    // Record successful submission so we don't immediately
    // re-submit if the caller retries.
    RECENT_SUBMISSIONS.set(url, Date.now())

    const response: IndexResponse = {
      success: true,
      url,
      notificationType: 'URL_UPDATED',
      metadata: result.data,
    }
    return NextResponse.json(response, { status: 200 })
  } catch (err: any) {
    // Surface the Google error so the caller can decide
    // whether to retry (e.g. PERMISSION_DENIED needs the
    // service account added to the Search Console owners
    // list; NOT_FOUND means the URL returns 404; QUOTA_
    // EXCEEDED means wait 24h).
    const googleError = err?.response?.data?.error
    const message =
      googleError?.message ?? err?.message ?? 'Google Indexing API request failed'
    const status = err?.response?.status ?? 502
    // Include the Google error code in the response so the
    // caller (and our own debugging) can tell PERMISSION_DENIED
    // apart from a network failure or a quota error. We log the
    // full error on the server so we don't leak internal stack
    // details to clients.
    console.error('[index-url] Google API error', {
      url,
      httpStatus: status,
      googleCode: googleError?.status,
      googleMessage: message,
      errors: googleError?.errors,
    })
    return NextResponse.json(
      {
        success: false,
        error: message,
        googleStatus: status,
        googleCode: googleError?.status ?? null,
      } satisfies IndexResponse,
      { status: status >= 400 && status < 600 ? status : 502 },
    )
  }
}

// ── GET for documentation purposes ───────────────────────
// The endpoint only accepts POST, but a bare GET should
// return a friendly "use POST" message rather than a 405
// stack trace (which is what Next.js does by default).
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error:
        'POST a JSON body of { url: "https://cuongthai.com/..." } to this endpoint.',
    } satisfies IndexResponse,
    { status: 405 },
  )
}
