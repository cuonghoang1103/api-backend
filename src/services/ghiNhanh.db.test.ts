/**
 * Kiểm Ghi nhanh trên CSDL THẬT (local, cổng 5434 theo .env).
 *
 *   npx tsx --test src/services/ghiNhanh.db.test.ts
 *
 * Tạo một user tạm, chạy, rồi xoá ĐÚNG user đó theo id đã bắt được (cascade
 * dọn môn/trang/thẻ). Không có DATABASE_URL thì bỏ qua — không chạy trong CI.
 * KHÔNG đưa vào `npm test`: CI không có Postgres.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test, after, before } from 'node:test';

const coDb = Boolean(process.env.DATABASE_URL);
const t = coDb ? test : test.skip;

let prisma: typeof import('../config/database.js').prisma;
let svc: typeof import('./ghiNhanh.service.js');
let userId = 0;

before(async () => {
  if (!coDb) return;
  prisma = (await import('../config/database.js')).prisma;
  svc = await import('./ghiNhanh.service.js');
  const tag = `qc${Date.now().toString(36)}`;
  const u = await prisma.user.create({ data: { username: tag, email: `${tag}@test.invalid` } });
  userId = u.id;
});

after(async () => {
  if (!coDb) return;
  if (userId) await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
});

t('ensureInboxSubject gọi đồng thời 5 lần → đúng 1 Hộp thư', async () => {
  const kq = await Promise.all(Array.from({ length: 5 }, () => svc.ensureInboxSubject(userId)));
  assert.equal(new Set(kq.map((s) => s.id)).size, 1);
  const dem = await prisma.noteSubject.count({ where: { userId, clientId: svc.HOP_THU_CLIENT_ID } });
  assert.equal(dem, 1);
  assert.equal(kq[0].name, '📥 Hộp thư');
});

t('ghi nhanh markdown → trang trong Hộp thư, có contentJson + contentHtml', async () => {
  const r = await svc.ghiNhanh(userId, { text: '`pwd` in thư mục hiện tại\n```bash\nls\n```' });
  const n = await prisma.note.findUniqueOrThrow({ where: { id: r.note.id } });
  assert.equal(n.subjectId, r.subject.id);
  assert.equal(n.title, 'pwd in thư mục hiện tại');
  assert.match(n.contentHtml ?? '', /<code>pwd<\/code>/);
  assert.match(n.contentHtml ?? '', /data-language="bash"/);
  const v = await prisma.noteVersion.count({ where: { noteId: n.id } });
  assert.equal(v, 1);
});

t('Sổ lệnh: 3 lần thêm đồng thời không mất dòng; thẻ ôn sinh đúng và giữ tiến độ', async () => {
  await Promise.all([
    svc.themLenh(userId, { lenh: 'git init', nghia: 'tạo kho git mới', nhom: 'Git' }),
    svc.themLenh(userId, { lenh: 'git add .', nghia: 'đưa mọi thay đổi vào vùng chờ', nhom: 'Git' }),
    svc.themLenh(userId, { lenh: 'npm run dev', nghia: 'chạy máy chủ phát triển', nhom: 'npm' }),
  ]);
  const so = await svc.damBaoSoLenh(userId);
  const soTrang = await prisma.note.count({ where: { userId, clientId: svc.SO_LENH_CLIENT_ID } });
  assert.equal(soTrang, 1);

  const the1 = await svc.taoTheTuSoLenh(userId, so.id);
  assert.equal(the1.soThe, 7); // 4 dòng mẫu + 3 dòng vừa thêm
  assert.equal(the1.taoMoi, 7);
  const pwd = await prisma.noteVocabEntry.findFirstOrThrow({ where: { userId, noteId: so.id, meaning: 'pwd' } });
  assert.equal(pwd.term, 'Lệnh nào để in ra thư mục đang đứng?');
  await prisma.noteVocabEntry.update({ where: { id: pwd.id }, data: { isKnown: true, knownStreak: 3, reviewCount: 3 } });

  // Chạy lại: không nhân đôi, không xoá tiến độ.
  const the2 = await svc.taoTheTuSoLenh(userId, so.id);
  assert.equal(the2.taoMoi, 0);
  assert.equal(await prisma.noteVocabEntry.count({ where: { userId, noteId: so.id } }), 7);
  const pwd2 = await prisma.noteVocabEntry.findUniqueOrThrow({ where: { id: pwd.id } });
  assert.equal(pwd2.knownStreak, 3);
});

t('Sổ lệnh của người khác: 404, không ghi được', async () => {
  const la = await prisma.note.findFirst({ where: { userId: { not: userId } }, select: { id: true } });
  if (!la) return;
  await assert.rejects(svc.themLenh(userId, { lenh: 'x', nghia: 'y', noteId: la.id }), /không thuộc về bạn|không tồn tại/);
  await assert.rejects(svc.taoTheTuSoLenh(userId, la.id), /không thuộc về bạn|không tồn tại/);
});

t('nhập .md: đúng tiêu đề; sai đuôi / quá lớn bị chặn', async () => {
  const r = await svc.nhapMarkdown(userId, { filename: 'SO-TAY.md', markdown: '# Sổ tay của tôi\n\n- `pwd`\n- `ls`' });
  assert.equal(r.note.title, 'Sổ tay của tôi');
  await assert.rejects(svc.nhapMarkdown(userId, { filename: 'a.exe', markdown: 'x' }), /Chỉ nhận file/);
  await assert.rejects(svc.nhapMarkdown(userId, { filename: 'a.md', markdown: 'x'.repeat(svc.MAX_MD_BYTES + 1) }), /quá lớn/);
});

t('sổ tay khoá: 2 lần lưu đồng thời → 1 môn, 1 trang/bài, đủ 2 đoạn', async () => {
  const lesson = await prisma.lesson.findFirst({
    select: { id: true, section: { select: { course: { select: { slug: true } } } } },
  });
  if (!lesson) return; // DB local chưa có khoá nào
  const slug = lesson.section.course.slug;
  await Promise.all([
    svc.luuDoanBaiHoc(userId, { courseSlug: slug, lessonId: lesson.id, text: 'Đoạn thứ nhất' }),
    svc.luuDoanBaiHoc(userId, { courseSlug: slug, lessonId: lesson.id, text: 'mkdir demo', laCode: true }),
  ]);
  assert.equal(await prisma.noteSubject.count({ where: { userId, clientId: { startsWith: 'khoa:' } } }), 1);
  assert.equal(await prisma.note.count({ where: { userId, clientId: `khoa-bai:${lesson.id}` } }), 1);
  const ds = await svc.doanCuaBai(userId, slug, lesson.id);
  assert.equal(ds.doan.length, 2);
  // Bài không thuộc khoá → 404
  await assert.rejects(svc.luuDoanBaiHoc(userId, { courseSlug: `${slug}-khong-co`, lessonId: lesson.id, text: 'x' }), /không thuộc khoá/);
});
