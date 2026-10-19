/**
 * Phụ đề VIDEO RIÊNG trên CSDL thật — seed + đường đọc của phòng video + gia sư.
 *
 * Điều phải đúng (đọc mã không chứng minh được, phải chạy):
 *   1. Seed idempotent: chạy lại không ghi; đổi một chữ thì ghi; chạy thử không ghi gì.
 *   2. Seed KHÔNG đụng phụ đề YouTube (`lesson_transcripts`) của cùng bài, và bỏ qua mục có URL lệch video
 *      đang gắn ở bài (phụ đề của video cũ).
 *   3. Gia sư: track VI đọc phụ đề riêng + các phần; YT/không truyền đọc phụ đề YouTube; track VI mà phụ đề
 *      riêng không hợp lệ ⇒ lời dặn "chưa có phụ đề", KHÔNG lùi về phụ đề YouTube.
 *   4. `/video-hoc/phong` không truyền track (app iOS) trả y như cũ.
 *
 * Không có CSDL (hoặc CSDL không phải máy cục bộ) ⇒ TỰ BỎ QUA. Dựng bằng khoá/bài tạm `ptr-test-<ngẫu nhiên>`
 * rồi xoá sạch theo id đã ghi lại ở cuối.
 *   DATABASE_URL=postgresql://…@localhost:5432/<csdl test> npx tsx --test src/services/video/phuDeRieng.db.test.ts
 */
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { prisma } from '../../config/database.js';
import { buildTutorCall } from '../courseTutor.service.js';
import { coPhuDe, phongHoc } from './phuDe.service.js';

type TongKet = { ghi: number; khongDoi: number; lechUrl: number; khongCoBai: number; hong: number };
type NapPhuDeRieng = (p: typeof prisma, o: { dir: string; apply: boolean; log?: (s: string) => void }) => Promise<TongKet>;

async function coCsdl(): Promise<boolean> {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  try {
    const host = new URL(url).hostname;
    if (!['localhost', '127.0.0.1', '::1', 'postgres'].includes(host)) return false; // không bao giờ chạy lên máy khác
    await Promise.race([
      prisma.$queryRaw`SELECT 1 FROM "lesson_own_transcripts" LIMIT 1`,
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
    ]);
    return true;
  } catch {
    return false;
  }
}

const tag = randomBytes(4).toString('hex');
let courseId: number | null = null;
const lessonIds: number[] = [];
let thuMuc: string | null = null;

after(async () => {
  if (lessonIds.length) {
    await prisma.lessonOwnTranscript.deleteMany({ where: { lessonId: { in: lessonIds } } }).catch(() => {});
    await prisma.lessonTranscript.deleteMany({ where: { lessonId: { in: lessonIds } } }).catch(() => {});
    await prisma.lessonDetail.deleteMany({ where: { lessonId: { in: lessonIds } } }).catch(() => {});
    await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } }).catch(() => {});
  }
  if (courseId) {
    await prisma.courseSection.deleteMany({ where: { courseId } }).catch(() => {});
    await prisma.course.delete({ where: { id: courseId } }).catch(() => {});
  }
  if (thuMuc) rmSync(thuMuc, { recursive: true, force: true });
  await prisma.$disconnect().catch(() => {});
});

test('phụ đề video riêng: seed idempotent + phòng video + gia sư chọn đúng nguồn (CSDL thật)', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ'); return; }

  const slugKhoa = `ptr-test-${tag}`;
  const URL_A = `https://media.cuongthai.com/videos/bai-giang/test/${tag}-a.mp4`;
  const URL_B_MOI = `https://media.cuongthai.com/videos/bai-giang/test/${tag}-b-moi.mp4`;
  const URL_B_CU = `https://media.cuongthai.com/videos/bai-giang/test/${tag}-b-cu.mp4`;

  const c = await prisma.course.create({ data: { title: `Khoá thử ${tag}`, slug: slugKhoa } });
  courseId = c.id;
  const s = await prisma.courseSection.create({ data: { courseId: c.id, title: 'Mục 0' } });
  const mkBai = async (slug: string, vi: string) => {
    const l = await prisma.lesson.create({
      data: {
        sectionId: s.id, title: `Bài ${slug}`, slug, content: '<p>Nội dung bài</p>',
        videoUrl: 'https://www.youtube.com/watch?v=abcdefghijk',
      },
    });
    lessonIds.push(l.id);
    await prisma.lessonDetail.create({
      data: {
        lessonId: l.id, videoUrlVi: vi, videoPlatformVi: 'DIRECT',
        videoUrlYt: 'https://www.youtube.com/watch?v=abcdefghijk', defaultVideoTrack: 'VI',
      },
    });
    return l;
  };
  const a = await mkBai(`${slugKhoa}-a`, URL_A);
  const b = await mkBai(`${slugKhoa}-b`, URL_B_MOI);

  // Phụ đề YouTube có sẵn của bài A — seed video riêng không được đụng tới.
  const CAU_EN = [{ t: 3, en: 'Hello from the YouTube lecture.' }, { t: 200, en: 'Branches are pointers.' }];
  await prisma.lessonTranscript.create({ data: { lessonId: a.id, videoId: 'abcdefghijk', lang: 'en', cues: CAU_EN, soCau: 2, soTu: 9 } });

  const mucA = {
    lang: 'vi', source: 'r2', track: 'VI', videoUrl: URL_A, durationSec: 330, nguonCau: 'thoigian',
    parts: [{ t: 4.6, den: 199.9, ten: 'Chào bạn' }, { t: 199.9, den: 330, ten: 'Nhánh là con trỏ' }],
    cues: [{ t: 5.1, vi: 'Chào bạn, đến với bài thử.' }, { t: 200, vi: 'Nhánh chỉ là một con trỏ tới commit.' }],
  };
  const ghiTep = (lessons: Record<string, unknown>) =>
    writeFileSync(path.join(thuMuc!, `${slugKhoa}.json`), JSON.stringify({ courseSlug: slugKhoa, lessons }));
  thuMuc = mkdtempSync(path.join(os.tmpdir(), 'ptr-test-'));
  ghiTep({
    [a.slug!]: mucA,
    [b.slug!]: { ...mucA, videoUrl: URL_B_CU }, // phụ đề của video CŨ ⇒ phải bị bỏ
    [`${slugKhoa}-khong-co`]: mucA,               // bài không tồn tại
  });

  const { napPhuDeRieng } = (await import(new URL('../../../scripts/phu-de-video-rieng-seed.mjs', import.meta.url).href)) as { napPhuDeRieng: NapPhuDeRieng };
  const im = () => {};

  // Chạy thử: đếm nhưng không ghi.
  const thu = await napPhuDeRieng(prisma, { dir: thuMuc, apply: false, log: im });
  assert.equal(thu.ghi, 1);
  assert.equal(await prisma.lessonOwnTranscript.count({ where: { lessonId: { in: lessonIds } } }), 0);

  // Ghi thật.
  const lan1 = await napPhuDeRieng(prisma, { dir: thuMuc, apply: true, log: im });
  assert.deepEqual([lan1.ghi, lan1.lechUrl, lan1.khongCoBai], [1, 1, 1]);
  const r1 = await prisma.lessonOwnTranscript.findUniqueOrThrow({ where: { uk_lesson_own_transcript_track: { lessonId: a.id, track: 'VI' } } });
  assert.equal(r1.soCau, 2);
  assert.equal(r1.videoUrl, URL_A);
  assert.equal(await prisma.lessonOwnTranscript.count({ where: { lessonId: b.id } }), 0, 'URL lệch ⇒ không ghi');
  const yt = await prisma.lessonTranscript.findUniqueOrThrow({ where: { lessonId: a.id } });
  assert.deepEqual(yt.cues, CAU_EN, 'phụ đề YouTube của cùng bài không bị đụng');

  // Chạy lại y nguyên: không ghi gì.
  const lan2 = await napPhuDeRieng(prisma, { dir: thuMuc, apply: true, log: im });
  assert.deepEqual([lan2.ghi, lan2.khongDoi], [0, 1]);
  const r2 = await prisma.lessonOwnTranscript.findUniqueOrThrow({ where: { id: r1.id } });
  assert.equal(r2.updatedAt.getTime(), r1.updatedAt.getTime());

  // Đổi một chữ: ghi đè đúng hàng đó (không thêm hàng).
  ghiTep({ [a.slug!]: { ...mucA, cues: [mucA.cues[0], { t: 200, vi: 'Nhánh chỉ là một con trỏ nhẹ tới commit.' }] } });
  const lan3 = await napPhuDeRieng(prisma, { dir: thuMuc, apply: true, log: im });
  assert.equal(lan3.ghi, 1);
  assert.equal(await prisma.lessonOwnTranscript.count({ where: { lessonId: a.id } }), 1);

  // ── Gia sư ──
  const hoi = { userId: 0, question: 'chỗ 3:20 em chưa hiểu', phongVideo: true, phuDeGiay: 200 };
  const vi = await buildTutorCall(a.id, { ...hoi, videoTrack: 'VI' });
  const ngCanhVi = String(vi.messages[0].content);
  assert.match(ngCanhVi, /CÁC PHẦN CỦA VIDEO \(2 phần/);
  assert.match(ngCanhVi, /\[3:19 - 5:30\] Nhánh là con trỏ/);
  assert.match(ngCanhVi, /\[3:20\] Nhánh chỉ là một con trỏ nhẹ tới commit\./);
  assert.doesNotMatch(ngCanhVi, /Branches are pointers/);
  assert.match(vi.system, /Use EXACTLY the parts listed/);

  const ytCall = await buildTutorCall(a.id, { ...hoi, videoTrack: 'YT' });
  assert.match(String(ytCall.messages[0].content), /\[3:20\] Branches are pointers\./);
  assert.doesNotMatch(String(ytCall.messages[0].content), /CÁC PHẦN CỦA VIDEO/);
  const cu = await buildTutorCall(a.id, hoi); // app iOS / bản web cũ: không gửi track
  assert.equal(cu.system, ytCall.system);

  const viB = await buildTutorCall(b.id, { ...hoi, videoTrack: 'VI' });
  assert.match(viB.system, /HAS NO TRANSCRIPT YET/, 'track VI chưa có phụ đề riêng ⇒ lời dặn chưa có phụ đề');
  assert.doesNotMatch(String(viB.messages[0].content), /PHỤ ĐỀ TOÀN VIDEO/);

  // ── Phòng video ──
  const pVi = await phongHoc(a.id, 'VI') as Awaited<ReturnType<typeof phongHoc>> & { nguon?: string; parts?: unknown[]; courseId?: number };
  assert.equal(pVi.nguon, 'r2');
  assert.equal(pVi.videoId, null);
  assert.equal(pVi.courseId, c.id);
  assert.equal(pVi.coPhuDe, true);
  assert.equal(pVi.parts?.length, 2);
  assert.equal((pVi.cues[1] as { vi?: string }).vi, 'Nhánh chỉ là một con trỏ nhẹ tới commit.');
  assert.equal((await phongHoc(a.id, 'auto') as { nguon?: string }).nguon, 'r2', 'auto theo track mặc định VI');
  const pCu = await phongHoc(a.id) as { videoId: string | null; nguon?: string; cues: unknown[] };
  assert.equal(pCu.videoId, 'abcdefghijk');
  assert.equal(pCu.nguon, undefined, 'không truyền track ⇒ hợp đồng cũ y nguyên');
  assert.deepEqual(pCu.cues, CAU_EN);
  const pB = await phongHoc(b.id, 'VI') as { coPhuDe: boolean; cues: unknown[] };
  assert.equal(pB.coPhuDe, false);
  assert.deepEqual(pB.cues, []);

  assert.equal((await coPhuDe(a.id, 'VI')).co, true);
  const coB = await coPhuDe(b.id, 'VI');
  assert.deepEqual([coB.co, coB.moDuoc], [false, true]);
  assert.equal((await coPhuDe(a.id)).videoId, 'abcdefghijk', 'không truyền track ⇒ như cũ');
});
