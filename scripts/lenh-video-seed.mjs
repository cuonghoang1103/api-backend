#!/usr/bin/env node
/**
 * Nạp "💻 Lệnh & code trong video" (content/lesson-commands/<courseSlug>.json) vào `lesson_video_commands`.
 * Sinh tệp bằng `npx tsx scripts/lenh-video.mjs` (máy có dữ liệu dựng video) — xem đầu tệp đó.
 *
 *   node scripts/lenh-video-seed.mjs            # chạy thử: in sẽ ghi gì
 *   node scripts/lenh-video-seed.mjs --apply    # ghi (deploy.sh: SAU "Course video-track seed", TRƯỚC mốc cắt IELTS)
 *
 * Cùng luật với phu-de-video-rieng-seed.mjs: upsert theo (lessonId, track), vân tay không đổi thì không ghi, KHÔNG xoá
 * gì, và chỉ ghi khi URL video trong tệp KHỚP URL track đang gắn ở bài (lệch ⇒ video đã thay, mốc trỏ sai chỗ).
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { vanTayLenh } from './lenh-video.lib.mjs';

const isYouTube = (u) => /(?:youtube\.com|youtu\.be)/i.test(String(u ?? ''));

/**
 * @param {import('@prisma/client').PrismaClient} prisma
 * @param {{ dir?: string, apply?: boolean, log?: (s: string) => void }} [o]
 */
export async function napLenhVideo(prisma, { dir = 'content/lesson-commands', apply = false, log = console.log } = {}) {
  const tk = { tep: 0, muc: 0, ghi: 0, khongDoi: 0, khongCoBai: 0, lechUrl: 0, hong: 0 };
  if (!existsSync(dir)) { log(` lệnh trong video: không có ${dir} — bỏ qua`); return tk; }

  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
    let tep;
    try { tep = JSON.parse(readFileSync(path.join(dir, f), 'utf8')); } catch (e) { tk.hong++; log(`  ⚠ ${f}: JSON hỏng — ${e.message}`); continue; }
    tk.tep++;
    const lessons = Object.entries(tep?.lessons ?? {});
    const course = tep?.courseSlug ? await prisma.course.findUnique({ where: { slug: tep.courseSlug }, select: { id: true } }) : null;
    if (!course) { tk.khongCoBai += lessons.length; log(`  ⚠ ${f}: không có khoá "${tep?.courseSlug}" — bỏ ${lessons.length} bài`); continue; }

    const bai = await prisma.lesson.findMany({
      where: { section: { courseId: course.id }, slug: { in: lessons.map(([s]) => s) } },
      select: { id: true, slug: true, videoUrl: true, details: { select: { videoUrlVi: true, videoUrlEn: true } } },
    });
    const theoSlug = new Map(bai.map((b) => [b.slug, b]));
    const ids = bai.map((b) => b.id);
    const cu = ids.length ? await prisma.lessonVideoCommand.findMany({ where: { lessonId: { in: ids } }, select: { lessonId: true, track: true, vanTay: true } }) : [];
    const vanTayCu = new Map(cu.map((r) => [`${r.lessonId}/${r.track}`, r.vanTay]));

    let ghiTep = 0;
    for (const [slug, m] of lessons) {
      tk.muc++;
      const b = theoSlug.get(slug);
      if (!b) { tk.khongCoBai++; log(`  ⚠ ${tep.courseSlug}/${slug}: không có bài này`); continue; }
      if (!m?.videoUrl || !Array.isArray(m.items)) { tk.hong++; log(`  ⚠ ${tep.courseSlug}/${slug}: mục thiếu videoUrl/items`); continue; }
      if (!m.items.length) continue; // video không có lệnh/code nào ⇒ không cần hàng
      const track = String(m.track ?? 'VI').toUpperCase() === 'EN' ? 'EN' : 'VI';
      const urlBai = track === 'VI'
        ? (b.details?.videoUrlVi ?? (b.videoUrl && !isYouTube(b.videoUrl) ? b.videoUrl : null))
        : b.details?.videoUrlEn ?? null;
      if (urlBai !== m.videoUrl) { tk.lechUrl++; log(`  ⚠ ${tep.courseSlug}/${slug}: URL video ${track} của bài khác URL trong tệp — bỏ qua (trích lại lệnh / seed lại track video)`); continue; }
      const vanTay = vanTayLenh(m.videoUrl, m.items);
      if (vanTayCu.get(`${b.id}/${track}`) === vanTay) { tk.khongDoi++; continue; }
      if (apply) {
        const data = { videoUrl: m.videoUrl, items: m.items, soMuc: m.items.length, vanTay };
        await prisma.lessonVideoCommand.upsert({
          where: { uk_lesson_video_command_track: { lessonId: b.id, track } },
          create: { lessonId: b.id, track, ...data },
          update: data,
        });
      }
      tk.ghi++; ghiTep++;
    }
    log(`  · ${tep.courseSlug}: ${lessons.length} bài trong tệp · ${apply ? 'ghi' : 'sẽ ghi'} ${ghiTep}`);
  }
  log(` lệnh trong video: ${tk.tep} tệp · ${tk.muc} bài · ${apply ? 'ghi' : 'sẽ ghi'} ${tk.ghi} · không đổi ${tk.khongDoi}`
    + ` · lệch URL ${tk.lechUrl} · không có bài ${tk.khongCoBai} · hỏng ${tk.hong}`);
  return tk;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    await napLenhVideo(prisma, { apply: process.argv.includes('--apply') });
  } catch (e) {
    console.error(`✗ lệnh trong video: ${e?.message ?? e}`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}
