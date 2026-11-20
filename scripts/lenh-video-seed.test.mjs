/** scripts/lenh-video-seed.mjs với Prisma GIẢ (không cần CSDL) — node --test scripts/lenh-video-seed.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { napLenhVideo } from './lenh-video-seed.mjs';
import { vanTayLenh } from './lenh-video.lib.mjs';

const URL_A = 'https://media.cuongthai.com/videos/bai-giang/git/a-1.mp4';
function prismaGia(hangCu = []) {
  const ghi = [];
  return {
    ghi,
    course: { findUnique: async ({ where }) => (where.slug === 'git' ? { id: 1 } : null) },
    lesson: {
      findMany: async () => [
        { id: 10, slug: 'a', videoUrl: null, details: { videoUrlVi: URL_A, videoUrlEn: null } },
        { id: 11, slug: 'b', videoUrl: null, details: { videoUrlVi: 'https://media.cuongthai.com/khac.mp4', videoUrlEn: null } },
      ],
    },
    lessonVideoCommand: {
      findMany: async () => hangCu,
      upsert: async (x) => { ghi.push(x); return x.create; },
    },
  };
}
function thuMuc(lessons) {
  const d = mkdtempSync(path.join(os.tmpdir(), 'lenh-seed-'));
  writeFileSync(path.join(d, 'git.json'), JSON.stringify({ courseSlug: 'git', lessons }));
  writeFileSync(path.join(d, 'khong-co.json'), JSON.stringify({ courseSlug: 'khong-co', lessons: { x: {} } }));
  return d;
}
const items = [{ t: 1, loai: 'lenh', lenh: 'git status', giai: 'g' }];
const im = () => {};

test('ghi khi URL khớp; bỏ khi URL lệch / bài không có / khoá không có; chạy thử không ghi', async () => {
  const dir = thuMuc({ a: { track: 'VI', videoUrl: URL_A, items }, b: { track: 'VI', videoUrl: URL_A, items }, c: { videoUrl: URL_A, items } });
  const p1 = prismaGia();
  const thu = await napLenhVideo(p1, { dir, apply: false, log: im });
  assert.equal(thu.ghi, 1); assert.equal(p1.ghi.length, 0);
  assert.equal(thu.lechUrl, 1); assert.equal(thu.khongCoBai, 2);
  const p2 = prismaGia();
  await napLenhVideo(p2, { dir, apply: true, log: im });
  assert.equal(p2.ghi.length, 1);
  assert.deepEqual(p2.ghi[0].where, { uk_lesson_video_command_track: { lessonId: 10, track: 'VI' } });
  assert.equal(p2.ghi[0].create.soMuc, 1);
});

test('vân tay không đổi ⇒ không ghi; bài không có mục ⇒ không tạo hàng', async () => {
  const dir = thuMuc({ a: { track: 'VI', videoUrl: URL_A, items } });
  const p = prismaGia([{ lessonId: 10, track: 'VI', vanTay: vanTayLenh(URL_A, items) }]);
  const tk = await napLenhVideo(p, { dir, apply: true, log: im });
  assert.equal(tk.khongDoi, 1); assert.equal(p.ghi.length, 0);
  const p2 = prismaGia();
  await napLenhVideo(p2, { dir: thuMuc({ a: { track: 'VI', videoUrl: URL_A, items: [] } }), apply: true, log: im });
  assert.equal(p2.ghi.length, 0);
});
