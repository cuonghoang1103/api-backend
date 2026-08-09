/**
 * verify-youtube-videos.mjs — prove every curated YouTube link in a course
 * video map still resolves, and read back its real title + channel.
 * ─────────────────────────────────────────────────────────────────────────────
 * Borrowed lectures rot: videos get deleted, made private, region-locked, or
 * have embedding disabled. All of those show up in the learn page as a black
 * box with no error, so the only honest check is to ASK YouTube.
 *
 * Uses YouTube's public oEmbed endpoint (no API key, no quota):
 *   200 + JSON  → the video exists AND is embeddable
 *   401/403/404 → dead / private / embedding disabled
 *
 * It also flags a MISMATCH when the stored credit line disagrees with the
 * live title/channel, which is how you catch a link that was silently
 * re-pointed at different content.
 *
 *   node scripts/verify-youtube-videos.mjs --all
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/nextjs.mjs
 *   node scripts/verify-youtube-videos.mjs --all --fix-credits   # rewrite credits in place
 *
 * Exit code 1 when any link is dead, so CI / deploy can fail on link rot.
 */
import { pathToFileURL } from 'node:url';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const MAP_DIR = './content/course-videos';
const FIX = has('--fix-credits');
const CONCURRENCY = 6;

const files = has('--all')
  ? readdirSync(MAP_DIR).filter((f) => f.endsWith('.mjs')).sort().map((f) => path.join(MAP_DIR, f))
  : [val('--file')].filter(Boolean);
if (!files.length) { console.error('cần --file <map.mjs> hoặc --all'); process.exit(1); }

function ytId(raw) {
  const s = String(raw || '').trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m =
    s.match(/[?&]v=([A-Za-z0-9_-]{11})/) ||
    s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ||
    s.match(/\/embed\/([A-Za-z0-9_-]{11})/) ||
    s.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
  return m?.[1] ?? null;
}

async function probe(id) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 800 * (attempt + 1))); continue; }
      if (!res.ok) return { ok: false, status: res.status };
      const d = await res.json();
      return { ok: true, title: d.title, author: d.author_name };
    } catch (e) {
      if (attempt === 2) return { ok: false, status: 0, error: String(e?.message || e) };
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  return { ok: false, status: 0 };
}

/** Run `fn` over `items` with a fixed worker pool (oEmbed rate-limits bursts). */
async function pool(items, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  }));
  return out;
}

let dead = 0, mismatch = 0, checked = 0;

for (const file of files) {
  const map = (await import(pathToFileURL(path.resolve(file)).href)).default;
  const entries = Object.entries(map.lessons || {}).filter(([, e]) => e.yt);
  console.log(`\n── ${path.basename(file)} · ${map.courseSlug} · ${entries.length} link ──`);

  const results = await pool(entries, async ([slug, e]) => {
    const id = ytId(e.yt);
    if (!id) return { slug, id: null, verdict: 'BAD_ID' };
    const r = await probe(id);
    if (!r.ok) return { slug, id, verdict: 'DEAD', status: r.status };
    const live = `${r.author} — ${r.title}`;
    const stored = e.credit || '';
    // Only the CHANNEL has to match: titles get edited by their authors, and a
    // re-titled video is still the same lecture. A different channel is not.
    const sameChannel = stored.toLowerCase().startsWith(String(r.author || '').toLowerCase());
    return { slug, id, verdict: sameChannel || !stored ? 'OK' : 'MISMATCH', live, stored };
  });

  for (const r of results) {
    checked++;
    if (r.verdict === 'OK') continue;
    if (r.verdict === 'MISMATCH') {
      mismatch++;
      console.warn(`  ! ${r.slug} (${r.id}) nguồn lệch\n      lưu : ${r.stored}\n      thật: ${r.live}`);
    } else {
      dead++;
      console.error(`  ✗ ${r.slug} (${r.id ?? '—'}) ${r.verdict}${r.status ? ` HTTP ${r.status}` : ''}`);
    }
  }
  const ok = results.filter((r) => r.verdict === 'OK').length;
  console.log(`  · ${ok}/${results.length} sống và nhúng được`);

  // Rewrite the credit strings in the source file from the live values.
  if (FIX) {
    let src = readFileSync(file, 'utf8');
    let n = 0;
    for (const r of results) {
      if (!r.live || r.verdict === 'DEAD' || r.verdict === 'BAD_ID') continue;
      // Replace the `credit:` on the entry keyed by this lesson slug only.
      const re = new RegExp(`(['"\`]${r.slug.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}['"\`]\\s*:\\s*\\{[^}]*?credit:\\s*)(['"\`])((?:\\\\.|(?!\\2).)*)\\2`, 's');
      if (re.test(src)) {
        src = src.replace(re, (_m, head, q) => `${head}${q}${r.live.replace(/`/g, '\\`').replace(new RegExp(q, 'g'), `\\${q}`)}${q}`);
        n++;
      }
    }
    if (n) { writeFileSync(file, src); console.log(`  · viết lại ${n} dòng credit`); }
  }
}

console.log(`\nTổng: ${checked} link · ${dead} chết · ${mismatch} lệch nguồn.`);
process.exit(dead > 0 ? 1 : 0);
