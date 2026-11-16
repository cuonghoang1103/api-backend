/**
 * Thêm video ĐA NGÔN NGỮ chạy nền (CT Language, 16/11/2026) trên CSDL thật, với một `yt-dlp` GIẢ (không mạng):
 *   1. Hàng đợi đi đủ bước ⇒ `xong`; hàng lưu `lang='ja'`, `track_goc`, `tu_dong`, phụ đề đã làm sạch kiểu CJK.
 *   2. `/thu-vien?nn=ja` thấy video; thư viện CŨ (không nn — app CuongThai) KHÔNG thấy (video Nhật không học được ở đó).
 *   3. Phụ đề của video tự thêm trả thêm `lang/trackGoc/tuDong/kenh` nhưng giữ trường cũ.
 *   4. Đòi tiếng Trung trên video Nhật ⇒ lỗi tiếng Việt nói rõ video nói tiếng Nhật.
 *   5. Dịch theo lô (AI giả) lưu `dich_vi` + `so_dich`; người thứ hai thêm cùng video ⇒ lấy lại bản dịch, không gọi AI.
 * Không có CSDL cục bộ ⇒ TỰ BỎ QUA.
 *   DATABASE_URL=postgresql://…@localhost:5434/<csdl> npx tsx --test src/services/video/themVideoDaNgu.db.test.ts
 */
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const thuMuc = mkdtempSync(path.join(os.tmpdir(), 'ytdlp-gia-'));
const gia = path.join(thuMuc, 'yt-dlp');
// yt-dlp GIẢ: lượt 1 (--write-info-json) ghi info; lượt 2 (--load-info-json) ghi phụ đề của --sub-langs.
writeFileSync(gia, `#!/usr/bin/env node
const fs = require('fs');
const a = process.argv.slice(2);
const o = a[a.indexOf('-o') + 1];
if (a.includes('--write-info-json')) {
  fs.writeFileSync(o + '.info.json', JSON.stringify({
    id: 'AbCdEfGhIj0', title: 'カフェで注文しよう', uploader: 'Kênh Thử', duration: 120, language: 'ja',
    thumbnail: 'https://i.ytimg.com/vi/AbCdEfGhIj0/hqdefault.jpg', categories: ['Education'],
    subtitles: {}, automatic_captions: { 'ja-orig': [{}], en: [{}] },
  }));
} else {
  const lang = a[a.indexOf('--sub-langs') + 1].replace(/\\\\/g, '');
  const dong = ['こんにちは皆さん。', '今日はカフェで注文する方法を勉強しましょう。', 'すみません、コーヒーを一つください。',
    'ホットとアイス、どちらにしますか。', 'アイスでお願いします。', 'かしこまりました、少々お待ちください。'];
  let s = 'WEBVTT\\n\\n';
  dong.forEach((d, i) => { s += '00:00:' + String(i * 3 + 1).padStart(2, '0') + '.000 --> 00:00:' + String(i * 3 + 3).padStart(2, '0') + '.000\\n' + d + '\\n\\n'; });
  fs.writeFileSync(o + '.' + lang + '.vtt', s);
}
`);
chmodSync(gia, 0o755);
process.env.YT_DLP_PATH = gia;

type Mod = typeof import('./themVideo.service.js');
let them: Mod;
let thuVien: (typeof import('./phuDe.service.js'))['thuVien'];
let dich: typeof import('./dichPhuDe.js');
let prisma: (typeof import('../../config/database.js'))['prisma'];
let coDb = false;
const tag = `vdn${randomBytes(3).toString('hex')}`;
const ids: number[] = [];

before(async () => {
  ({ prisma } = await import('../../config/database.js'));
  const url = process.env.DATABASE_URL;
  try {
    if (url && ['localhost', '127.0.0.1', '::1', 'postgres'].includes(new URL(url).hostname)) {
      await prisma.$queryRaw`SELECT "lang", "so_dich" FROM "video_nguoi_dung" LIMIT 1`;
      coDb = true;
    }
  } catch { coDb = false; }
  if (!coDb) return;
  them = await import('./themVideo.service.js');
  ({ thuVien } = await import('./phuDe.service.js'));
  dich = await import('./dichPhuDe.js');
  for (let i = 0; i < 2; i++) {
    ids.push((await prisma.user.create({ data: { username: `${tag}${i}`, email: `${tag}${i}@test.invalid`, fullName: `Thử Video ${i}` } })).id);
  }
});

after(async () => {
  rmSync(thuMuc, { recursive: true, force: true });
  if (!coDb) return;
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
});

async function choXong(userId: number, ma: string) {
  const buoc: string[] = [];
  for (let k = 0; k < 100; k++) {
    const v = them.xemViecThem(userId, ma);
    if (buoc[buoc.length - 1] !== v.buoc) buoc.push(v.buoc);
    if (v.buoc === 'xong' || v.buoc === 'loi') return { v, buoc };
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error('quá lâu');
}

test('hàng đợi thêm video tiếng Nhật ⇒ xong, lưu đúng ngôn ngữ, thư viện tách theo ngôn ngữ', async (t) => {
  if (!coDb) return t.skip('không có CSDL cục bộ');
  const [a] = ids;
  const g = them.guiViecThem(a, 'https://youtu.be/AbCdEfGhIj0', { nn: 'auto' });
  assert.equal(g.buoc, 'xep_hang');
  const { v, buoc } = await choXong(a, g.ma);
  assert.equal(v.buoc, 'xong', v.loi ?? '');
  assert.ok(buoc.includes('xong'));
  assert.equal(v.video?.lang, 'ja');
  assert.equal(v.video?.trackGoc, 'ja-orig');
  assert.equal(v.video?.tuDong, true);
  assert.equal(v.video?.kenh, 'Kênh Thử');
  assert.ok((v.video?.soCau ?? 0) >= 5);

  const ja = await thuVien(a, 'ja');
  assert.equal(ja.cuaToi.length, 1);
  assert.equal(ja.khoa.some((k) => k.nhomLon === 'academy'), false, 'thư viện tiếng Nhật không kèm bài giảng tiếng Anh');
  const cu = await thuVien(a);
  assert.equal(cu.cuaToi.length, 0, 'app CuongThai (không nn) không thấy video tiếng Nhật');

  const pd = await them.phuDeCuaToi(a, -v.video!.lessonId);
  assert.equal(pd.lang, 'ja');
  assert.equal(pd.cues[0].en, 'こんにちは皆さん。');
  assert.equal(pd.dichVi, null);

  // Mã việc của người khác ⇒ như không có.
  assert.throws(() => them.xemViecThem(ids[1], g.ma), /Không còn việc/);
});

test('đòi tiếng Trung trên video tiếng Nhật ⇒ lỗi nói rõ', async (t) => {
  if (!coDb) return t.skip('không có CSDL cục bộ');
  const g = them.guiViecThem(ids[1], 'https://www.youtube.com/watch?v=AbCdEfGhIj0', { nn: 'zh' });
  const { v } = await choXong(ids[1], g.ma);
  assert.equal(v.buoc, 'loi');
  assert.match(v.loi ?? '', /tiếng Trung.*tiếng Nhật/);
});

test('dịch theo lô lưu lại; người thứ hai cùng video lấy lại bản dịch không gọi AI', async (t) => {
  if (!coDb) return t.skip('không có CSDL cục bộ');
  const [a, b] = ids;
  const hangA = await prisma.videoNguoiDung.findFirstOrThrow({ where: { userId: a } });
  let goi = 0;
  const giaAi = {
    laPro: async () => false,
    goiAi: async ({ user }: { user: string }) => {
      goi++;
      const so = [...user.matchAll(/^(\d+): /gm)].map((m) => Number(m[1]));
      return JSON.stringify({ d: so.map((i) => ({ i, v: `Dịch ${i}` })) });
    },
    bayGio: () => new Date(),
    docVideo: async (u: number, id: number) => prisma.videoNguoiDung.findFirst({ where: { id, userId: u },
      select: { id: true, userId: true, nguon: true, videoId: true, lang: true, cues: true, dichVi: true } }),
    timBanCho: async (v: { id: number; nguon: string; videoId: string; lang: string }) => prisma.videoNguoiDung.findMany({
      where: { nguon: v.nguon, videoId: v.videoId, lang: v.lang, id: { not: v.id }, soDich: { gt: 0 } }, select: { cues: true, dichVi: true } }),
    luu: async (id: number, d: string[], soDich: number) => { await prisma.videoNguoiDung.update({ where: { id }, data: { dichVi: d, soDich } }); },
  };
  const r = await dich.dichTiep(a, hangA.id, 0, giaAi);
  assert.equal(r.xong, true);
  assert.equal(goi, 1);
  const sau = await prisma.videoNguoiDung.findUniqueOrThrow({ where: { id: hangA.id } });
  assert.equal(sau.soDich, hangA.soCau);

  // Người B thêm đúng video đó (tiếng Nhật) rồi dịch ⇒ lấy lại bản dịch của A.
  const g = them.guiViecThem(b, 'https://youtu.be/AbCdEfGhIj0', { nn: 'ja' });
  const { v } = await choXong(b, g.ma);
  assert.equal(v.buoc, 'xong', v.loi ?? '');
  const r2 = await dich.dichTiep(b, -v.video!.lessonId, 0, giaAi);
  assert.equal(r2.xong, true);
  assert.equal(goi, 1, 'không gọi AI lần hai');

  // A thêm lại cùng video (phụ đề y hệt) ⇒ GIỮ bản dịch.
  const g3 = them.guiViecThem(a, 'https://youtu.be/AbCdEfGhIj0', { nn: 'ja' });
  await choXong(a, g3.ma);
  const giu = await prisma.videoNguoiDung.findUniqueOrThrow({ where: { id: hangA.id } });
  assert.equal(giu.soDich, hangA.soCau);
});
