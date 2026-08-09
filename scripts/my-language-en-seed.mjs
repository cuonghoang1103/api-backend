/**
 * my-language-en-seed.mjs — PHA 2: seed BÀI ĐỌC + BÀI NGHE tiếng Anh vào DB.
 * Idempotent (find-before-create theo languageId + title). Chạy được cả LOCAL
 * (test) lẫn trong container lúc deploy (ghi thẳng DB prod).
 *
 *   node scripts/my-language-en-seed.mjs            # DRY (không ghi)
 *   node scripts/my-language-en-seed.mjs --apply    # ghi DB
 *   node scripts/my-language-en-seed.mjs --apply --skip-audio-check   # bỏ kiểm audio R2
 *
 * Bài NGHE trỏ tới audio đã upload sẵn ở PHA 1 (scripts/en-listening-audio.mjs).
 * Mặc định seed KIỂM audio tồn tại trên R2 trước khi tạo item (đừng tạo item
 * trỏ audio 404). Deploy: chạy PHA 1 ở local trước, rồi PHA 2 seed trong container.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const SKIP_AUDIO_CHECK = args.includes('--skip-audio-check');

const readings = (await import(pathToFileURL(path.join(ROOT, 'content/my-language/en-reading.mjs')).href)).default;
const listenings = (await import(pathToFileURL(path.join(ROOT, 'content/my-language/en-listening.mjs')).href)).default;

const PUBLIC_BASE = (process.env.R2_PUBLIC_URL || 'https://media.cuongthai.com').replace(/\/$/, '');
const prisma = new PrismaClient();

console.log(`── my-language-en-seed : ${APPLY ? 'APPLY' : 'DRY'} · ${readings.length} đọc · ${listenings.length} nghe ──`);

/* ── 1. Ngôn ngữ 'en' (prod đã có; local có thể chưa → tạo tối thiểu) ─────── */
let lang = await prisma.language.findUnique({ where: { code: 'en' } });
if (!lang) {
  if (!APPLY) {
    console.log("   ngôn ngữ 'en': CHƯA CÓ (DRY — prod đã có id 1; sẽ tạo nếu chạy local --apply)");
  } else {
    lang = await prisma.language.create({
      data: { code: 'en', name: 'Tiếng Anh', nameEn: 'English', flagEmoji: '🇬🇧', order: 1, isActive: true },
    });
    console.log(`   ngôn ngữ 'en': TẠO MỚI #${lang.id}`);
  }
}
if (lang) console.log(`   ngôn ngữ 'en': #${lang.id}`);
const languageId = lang?.id ?? -1;

/* ── 2. Bài đọc ───────────────────────────────────────────────────────────── */
async function nextOrder(model) {
  if (languageId < 0) return 0;
  const agg = await prisma[model].aggregate({ where: { languageId }, _max: { order: true } });
  return (agg._max.order ?? -1) + 1;
}

let ord = await nextOrder('langReadingArticle');
for (const r of readings) {
  const existing = languageId > 0
    ? await prisma.langReadingArticle.findFirst({ where: { languageId, title: r.title }, select: { id: true, order: true } })
    : null;
  const data = {
    languageId,
    level: r.level ?? null,
    title: r.title,
    type: 'TEXT',
    images: [],
    content: r.content,
    translation: r.translation ?? null,
    questions: r.questions ?? null,
  };
  console.log(`   đọc "${r.title}" [${r.level}]: ${existing ? `CẬP NHẬT #${existing.id}` : 'TẠO MỚI'} · ${r.questions?.length ?? 0} câu hỏi`);
  if (APPLY && languageId > 0) {
    if (existing) await prisma.langReadingArticle.update({ where: { id: existing.id }, data });
    else await prisma.langReadingArticle.create({ data: { ...data, order: ord++ } });
  }
}

/* ── 3. Bài nghe (audio đã upload ở PHA 1) ────────────────────────────────── */
ord = await nextOrder('langListeningItem');
for (const it of listenings) {
  const key = `audio/my-language/en/${it.slug}.mp3`;
  const audioUrl = `${PUBLIC_BASE}/${key}`;

  if (!SKIP_AUDIO_CHECK) {
    let okAudio = false;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const res = await fetch(audioUrl, { method: 'GET' }).catch(() => null);
      if (res && res.ok) { okAudio = true; break; }
      if (attempt < 3) await new Promise((r) => setTimeout(r, 15_000));
    }
    if (!okAudio) {
      console.error(`   ✗ audio chưa có trên R2: ${audioUrl}`);
      console.error('     → chạy PHA 1 trước: node scripts/en-listening-audio.mjs --apply (ở local)');
      process.exit(1);
    }
  }

  const existing = languageId > 0
    ? await prisma.langListeningItem.findFirst({ where: { languageId, title: it.title }, select: { id: true } })
    : null;
  const data = {
    languageId,
    level: it.level ?? null,
    title: it.title,
    sourceType: 'UPLOAD',
    audioUrl,
    youtubeUrl: null,
    transcript: it.transcript,
    translation: it.translation ?? null,
    questions: it.questions ?? [],
  };
  console.log(`   nghe "${it.title}" [${it.level}]: ${existing ? `CẬP NHẬT #${existing.id}` : 'TẠO MỚI'} · audio ${SKIP_AUDIO_CHECK ? '(bỏ kiểm)' : 'OK'}`);
  if (APPLY && languageId > 0) {
    if (existing) await prisma.langListeningItem.update({ where: { id: existing.id }, data });
    else await prisma.langListeningItem.create({ data: { ...data, order: ord++ } });
  }
}

if (!APPLY) console.log('   chạy lại với --apply để ghi.');
await prisma.$disconnect();
