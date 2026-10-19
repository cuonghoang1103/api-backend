#!/usr/bin/env node
/**
 * Nạp phụ đề VIDEO RIÊNG (content/lesson-transcripts/<courseSlug>.json) vào `lesson_own_transcripts`.
 * Sinh tệp bằng `npx tsx scripts/phu-de-tu-video-rieng.mjs` (máy có dữ liệu dựng video).
 *
 *   node scripts/phu-de-video-rieng-seed.mjs            # chạy thử: in sẽ ghi gì
 *   node scripts/phu-de-video-rieng-seed.mjs --apply    # ghi (deploy.sh chạy dòng này, sau seed track video)
 *
 * ⚠️ Idempotent: upsert theo (lessonId, track); `vanTay` (sha1 nội dung) không đổi thì không ghi gì.
 * KHÔNG xoá hàng nào, và KHÔNG đụng `lesson_transcripts` (phụ đề YouTube của bài khác/của cùng bài) — hai bảng
 * tách hẳn, xem chú thích `LessonOwnTranscript` trong schema.prisma.
 *
 * ⚠️ Chỉ ghi khi URL video trong tệp KHỚP URL track đó đang gắn ở bài (`lesson_details.video_url_vi`). Lệch ⇒
 * video đã thay mà phụ đề chưa sinh lại (hoặc ngược lại: tệp sinh trước khi bản đồ track được seed) — ghi vào là
 * đem mốc của video này đi tua video kia. Báo ⚠ rồi bỏ qua; máy chủ còn kiểm lại lúc đọc.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const isYouTube = (u) => /(?:youtube\.com|youtu\.be)/i.test(String(u ?? ''));

/** sha1 của đúng những gì được ghi — đổi một chữ hay một mốc là đổi. */
export function vanTayMuc(m) {
  return createHash('sha1').update(JSON.stringify([m.videoUrl, m.lang, m.source, m.cues, m.parts, m.durationSec ?? null])).digest('hex');
}

const demTu = (cues) => cues.reduce((n, c) => n + String(c?.vi ?? c?.en ?? '').split(/\s+/).filter(Boolean).length, 0);

/**
 * @param {import('@prisma/client').PrismaClient} prisma
 * @param {{ dir?: string, apply?: boolean, log?: (s: string) => void }} [o]
 */
export async function napPhuDeRieng(prisma, { dir = 'content/lesson-transcripts', apply = false, log = console.log } = {}) {
  const tk = { tep: 0, muc: 0, ghi: 0, khongDoi: 0, khongCoBai: 0, lechUrl: 0, hong: 0 };
  if (!existsSync(dir)) { log(` phụ đề video riêng: không có ${dir} — bỏ qua`); return tk; }

  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
    let tep;
    try { tep = JSON.parse(readFileSync(path.join(dir, f), 'utf8')); } catch (e) { tk.hong++; log(`  ⚠ ${f}: JSON hỏng — ${e.message}`); continue; }
    tk.tep++;
    const lessons = Object.entries(tep?.lessons ?? {});
    const course = tep?.courseSlug
      ? await prisma.course.findUnique({ where: { slug: tep.courseSlug }, select: { id: true } })
      : null;
    if (!course) { tk.khongCoBai += lessons.length; log(`  ⚠ ${f}: không có khoá "${tep?.courseSlug}" — bỏ ${lessons.length} bài`); continue; }

    const bai = await prisma.lesson.findMany({
      where: { section: { courseId: course.id }, slug: { in: lessons.map(([s]) => s) } },
      select: { id: true, slug: true, videoUrl: true, details: { select: { videoUrlVi: true, videoUrlEn: true } } },
    });
    const theoSlug = new Map(bai.map((b) => [b.slug, b]));
    const ids = bai.map((b) => b.id);
    const cu = ids.length
      ? await prisma.lessonOwnTranscript.findMany({ where: { lessonId: { in: ids } }, select: { lessonId: true, track: true, vanTay: true } })
      : [];
    const vanTayCu = new Map(cu.map((r) => [`${r.lessonId}/${r.track}`, r.vanTay]));

    let ghiTep = 0;
    for (const [slug, m] of lessons) {
      tk.muc++;
      const b = theoSlug.get(slug);
      if (!b) { tk.khongCoBai++; log(`  ⚠ ${tep.courseSlug}/${slug}: không có bài này`); continue; }
      if (!m?.videoUrl || !Array.isArray(m.cues) || !m.cues.length) { tk.hong++; log(`  ⚠ ${tep.courseSlug}/${slug}: mục thiếu videoUrl/cues`); continue; }
      const track = String(m.track ?? 'VI').toUpperCase() === 'EN' ? 'EN' : 'VI';
      const urlBai = track === 'VI'
        ? (b.details?.videoUrlVi ?? (b.videoUrl && !isYouTube(b.videoUrl) ? b.videoUrl : null))
        : b.details?.videoUrlEn ?? null;
      if (urlBai !== m.videoUrl) {
        tk.lechUrl++;
        log(`  ⚠ ${tep.courseSlug}/${slug}: URL video ${track} của bài khác URL trong tệp — bỏ qua (sinh lại phụ đề / seed lại track video)`);
        continue;
      }
      const parts = Array.isArray(m.parts) ? m.parts : [];
      const vanTay = vanTayMuc({ ...m, parts });
      if (vanTayCu.get(`${b.id}/${track}`) === vanTay) { tk.khongDoi++; continue; }
      if (apply) {
        const data = {
          lang: String(m.lang || 'vi').slice(0, 12), source: String(m.source || 'r2').slice(0, 16), videoUrl: m.videoUrl,
          cues: m.cues, parts, soCau: m.cues.length, soTu: demTu(m.cues),
          durationSec: Number.isFinite(Number(m.durationSec)) ? Number(m.durationSec) : null, vanTay,
        };
        await prisma.lessonOwnTranscript.upsert({
          where: { uk_lesson_own_transcript_track: { lessonId: b.id, track } },
          create: { lessonId: b.id, track, ...data },
          update: data,
        });
      }
      tk.ghi++; ghiTep++;
    }
    log(`  · ${tep.courseSlug}: ${lessons.length} bài trong tệp · ${apply ? 'ghi' : 'sẽ ghi'} ${ghiTep}`);
  }
  log(` phụ đề video riêng: ${tk.tep} tệp · ${tk.muc} bài · ${apply ? 'ghi' : 'sẽ ghi'} ${tk.ghi} · không đổi ${tk.khongDoi}`
    + ` · lệch URL ${tk.lechUrl} · không có bài ${tk.khongCoBai} · hỏng ${tk.hong}`);
  return tk;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    await napPhuDeRieng(prisma, { apply: process.argv.includes('--apply') });
  } catch (e) {
    console.error(`✗ phụ đề video riêng: ${e?.message ?? e}`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}
