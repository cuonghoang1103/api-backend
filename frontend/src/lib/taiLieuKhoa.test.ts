/**
 * Test bộ phân tích "📁 Tài liệu" — `npx tsx --test frontend/src/lib/taiLieuKhoa.test.ts`.
 * Mẫu lấy NGUYÊN VĂN từ tệp khoá thật (28/11/2026), cộng một phép quét mọi tệp khoá có `documentsNote`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { phanTichGhiChuTaiLieu, phanTichMuc, taiLieuTuCauTruc, docTaiLieuKhoa, kieuTep, dungLuong, type MucTaiLieu } from './taiLieuKhoa';

const tatCa = (note: string): MucTaiLieu[] => phanTichGhiChuTaiLieu(note).nhom.flatMap((n) => n.muc);
const tim = (ds: MucTaiLieu[], ten: string) => ds.find((m) => m.ten === ten) ?? assert.fail(`không thấy mục "${ten}" trong: ${ds.map((m) => m.ten).join(' | ')}`);

test('PostgreSQL — hai nhóm, link mở được, track Code Lab và /feed là link nội bộ', () => {
  const note = 'Tài liệu tham chiếu chính: postgresql.org/docs (tài liệu chính thức, đầy đủ và chính xác nhất) • use-the-index-luke.com (giải thích chỉ mục và EXPLAIN cực rõ) • pgexercises.com (bài tập SQL tương tác). Phần thực hành đi kèm: track "PostgreSQL" trên Code Lab. Loạt bài "100 Ngày Database" trên trang chủ /feed bổ trợ phần lý thuyết quan hệ và chuẩn hoá.';
  const kq = phanTichGhiChuTaiLieu(note);
  assert.deepEqual(kq.nhom.map((n) => n.tieuDe), ['Tài liệu tham chiếu chính', 'Phần thực hành đi kèm']);
  const [chinh, thucHanh] = kq.nhom;
  assert.equal(chinh.muc.length, 3);
  assert.deepEqual(chinh.muc[0], {
    ten: 'postgresql.org/docs', url: 'https://postgresql.org/docs', noiBo: false, tenMien: 'postgresql.org',
    moTa: 'tài liệu chính thức, đầy đủ và chính xác nhất', loai: 'chinh-thuc',
  });
  assert.equal(chinh.muc[2].url, 'https://pgexercises.com');
  assert.equal(chinh.muc[2].loai, 'thuc-hanh');
  const cl = tim(thucHanh.muc, 'Code Lab · PostgreSQL');
  assert.equal(cl.url, '/code-lab/postgresql');
  assert.equal(cl.noiBo, true);
  const feed = thucHanh.muc.find((m) => m.url === '/feed');
  assert.ok(feed, 'câu "/feed" thành link nội bộ');
  assert.equal(feed!.noiBo, true);
  assert.match(feed!.ten, /100 Ngày Database/);
});

test('Node.js — mô tả trong ngoặc sau "trên Code Lab" + tên track có ngoặc', () => {
  const ds = tatCa('Tài liệu tham chiếu chính: nodejs.org/docs (API chính thức) • expressjs.com • prisma.io/docs • developer.mozilla.org cho JavaScript. Phần thực hành đi kèm: track "Node.js (Express)" trên Code Lab (16 module, 160 bài tập có lời giải).');
  assert.equal(tim(ds, 'expressjs.com').url, 'https://expressjs.com');
  assert.equal(tim(ds, 'developer.mozilla.org').moTa, 'cho JavaScript');
  const cl = tim(ds, 'Code Lab · Node.js (Express)');
  assert.equal(cl.url, '/code-lab/nodejs-express');
  assert.equal(cl.moTa, '16 module, 160 bài tập có lời giải');
});

test('Academy — Giáo trình / Công cụ / Luyện tập + tệp syllabus đi kèm', () => {
  const kq = phanTichGhiChuTaiLieu('Giáo trình chính: Goodrich, Tamassia, Goldwasser — Data Structures and Algorithms in Java, 6th ed. (2014). Kèm slide FU, bài tập FU (pdf), code Java mẫu. Công cụ: JDK 8+, Eclipse. Luyện tập: track Code Lab Data Structures & Algorithms + Algorithm Visualizer (/algorithms). Kèm file syllabus gốc CSD201.pdf.');
  const ten = kq.nhom.map((n) => n.tieuDe);
  assert.ok(ten.includes('Giáo trình chính'));
  assert.ok(ten.includes('Công cụ'));
  assert.ok(ten.includes('Luyện tập'));
  const ds = kq.nhom.flatMap((n) => n.muc);
  const sach = ds.find((m) => /Goodrich/.test(m.ten))!;
  assert.equal(sach.loai, 'sach');
  assert.ok(!/Kèm slide/.test(sach.ten), 'câu "Kèm slide FU…" không dính vào tên sách');
  assert.deepEqual(kq.nhom.find((n) => n.tieuDe === 'Công cụ')!.muc.map((m) => m.ten), ['JDK 8+', 'Eclipse']);
  assert.ok(ds.some((m) => m.url === '/code-lab/data-structures-algorithms'));
  assert.ok(ds.some((m) => m.url === '/algorithms' && m.noiBo));
  const tep = kq.nhom.find((n) => n.loai === 'tai-ve')!;
  assert.equal(tep.tieuDe, 'Tệp đi kèm');
  assert.deepEqual(tep.muc.map((m) => m.ten), ['Slide FU, bài tập FU (pdf), code Java mẫu', 'Syllabus gốc CSD201.pdf']);
  assert.ok(tep.muc.every((m) => m.laTepDiKem && m.loai === 'tai-ve'));
});

test('Nhiều track Code Lab nối bằng " + " ⇒ mỗi track một link', () => {
  const ds = tatCa('Luyện code: track Code Lab Java Core + Spring Boot + SQL + React. Git & Docker: Exp Hub.');
  assert.deepEqual(ds.filter((m) => m.url?.startsWith('/code-lab/')).map((m) => m.url),
    ['/code-lab/java-core', '/code-lab/spring-boot', '/code-lab/sql', '/code-lab/react']);
  assert.ok(ds.some((m) => m.url === '/exp-hub'));
});

test('Tên miền trong ngoặc ⇒ link, phần còn lại của ngoặc ⇒ mô tả', () => {
  const [a] = phanTichMuc('Bitcoin whitepaper (bitcoin.org/bitcoin.pdf, Satoshi Nakamoto, 2008)', 'chinh-thuc');
  assert.equal(a.ten, 'Bitcoin whitepaper');
  assert.equal(a.url, 'https://bitcoin.org/bitcoin.pdf');
  assert.equal(a.moTa, 'Satoshi Nakamoto, 2008');
  assert.equal(a.loai, 'chuan');
  const [b] = phanTichMuc('Google AIP (aip.dev)', 'chinh-thuc');
  assert.deepEqual([b.ten, b.url, b.moTa], ['Google AIP', 'https://aip.dev', undefined]);
  const [c] = phanTichMuc('"A Graduate Course in Applied Cryptography" (Boneh & Shoup, bản miễn phí tại toc.cryptobook.us)', 'chinh-thuc');
  assert.equal(c.url, 'https://toc.cryptobook.us');
  assert.equal(c.loai, 'sach');
  assert.match(c.moTa ?? '', /Boneh & Shoup/);
});

test('Câu dẫn có ":" trong ngoặc kép; ngoặc giữa câu có tên miền; tuyến nội bộ trong ngoặc', () => {
  const kq = phanTichGhiChuTaiLieu('Chuỗi MOOC bắt buộc (Coursera — UC Irvine, "Academic English: Writing" Specialization): (1) Grammar & Punctuation, (2) Getting Started with Essay Writing. Kèm file syllabus gốc ENW492c.pdf.');
  assert.equal(kq.nhom[0].tieuDe, 'Chuỗi MOOC bắt buộc (Coursera — UC Irvine, "Academic English: Writing" Specialization)');
  assert.equal(kq.nhom[0].loai, 'khoa-hoc');
  const [isl] = phanTichMuc('Cuốn "An Introduction to Statistical Learning" (statlearning.com, bản PDF miễn phí) là tài liệu đọc thêm tốt', 'chinh-thuc');
  assert.equal(isl.ten, 'Cuốn "An Introduction to Statistical Learning"');
  assert.equal(isl.url, 'https://statlearning.com');
  assert.match(isl.moTa ?? '', /bản PDF miễn phí là tài liệu đọc thêm tốt/);
  const ds = tatCa('Công cụ: My Language (/language/ja) để luyện kana/từ vựng/kanji, và heyjapan.net.');
  assert.deepEqual([ds[0].ten, ds[0].url, ds[0].moTa], ['My Language', '/language/ja', 'để luyện kana/từ vựng/kanji']);
  assert.equal(ds[1].url, 'https://heyjapan.net');
  const [man] = phanTichMuc('Apple Developer — Logging (OSLog) và man log(1)', 'chinh-thuc');
  assert.match(man.ten, /man log\(1\)$/);
});

test('"Phòng thi … và Code Lab" ⇒ hai thẻ nội bộ; "Next.js" trong tên track', () => {
  const ds = tatCa('Phần thực hành đi kèm Phòng thi (3 PT · 5 FE · 10 PE) và Code Lab.');
  assert.deepEqual(ds.map((m) => [m.ten, m.url]), [['Phòng thi', '/exam'], ['Code Lab', '/code-lab']]);
  assert.equal(ds[0].moTa, '3 PT · 5 FE · 10 PE');
  const n = tatCa('Luyện code: track Code Lab Next.js + React + Prisma ORM + Authentication. LLM KHÔNG có track Code Lab riêng — dùng Code Lab TypeScript.');
  assert.deepEqual(n.map((m) => m.url), ['/code-lab/nextjs', '/code-lab/react', '/code-lab/prisma-orm', '/code-lab/authentication']);
});

test('Tên miền đầu mục + phần chữ sau ⇒ tên = tên miền, mô tả = phần chữ', () => {
  const [a] = phanTichMuc('explainshell.com để mổ xẻ một lệnh lạ', 'chinh-thuc');
  assert.deepEqual([a.ten, a.url, a.moTa], ['explainshell.com', 'https://explainshell.com', 'để mổ xẻ một lệnh lạ']);
  const [b] = phanTichMuc('docs.docker.com/build/cache cho phần cache của BuildKit', 'chinh-thuc');
  assert.equal(b.url, 'https://docs.docker.com/build/cache');
});

test('RFC không kèm tên miền ⇒ tự trỏ rfc-editor.org; sách không link ⇒ không bịa URL', () => {
  const [r] = phanTichMuc('RFC 9457 (Problem Details)', 'chinh-thuc');
  assert.equal(r.url, 'https://www.rfc-editor.org/rfc/rfc9457');
  assert.equal(r.loai, 'chuan');
  const [s] = phanTichMuc('"Designing Data-Intensive Applications" (Martin Kleppmann)', 'chinh-thuc');
  assert.equal(s.url, undefined);
  assert.equal(s.loai, 'sach');
});

test('Chữ "Node.js", "ASP.NET" không bị nhận nhầm là tên miền; "Ph. Ăngghen:" không mở nhóm mới', () => {
  const ds = tatCa('Tài liệu chính: Giáo trình Triết học Mác–Lênin (Bộ GD&ĐT, hệ không chuyên lý luận chính trị) • Ph. Ăngghen: Biện chứng của tự nhiên; Chống Đuyrinh • V.I. Lênin: Chủ nghĩa duy vật và chủ nghĩa kinh nghiệm phê phán.');
  assert.ok(ds.every((m) => !m.url), 'không mục nào có link bịa');
  assert.ok(ds.some((m) => /Ph\. Ăngghen/.test(m.ten)));
  const [n] = phanTichMuc('Node.js release notes/changelog', 'chinh-thuc');
  assert.equal(n.url, undefined);
});

test('Câu ghi chú cuối (không phải tài liệu) tách riêng', () => {
  const kq = phanTichGhiChuTaiLieu('Tài liệu chính: docs.claude.com (Claude Code) • docs.github.com/copilot • modelcontextprotocol.io • OWASP Top 10 for LLM Applications • github.com/gitleaks/gitleaks. Model, giá và giới hạn đổi nhanh — mỗi bài ghi mốc thời gian đã kiểm.');
  assert.equal(kq.nhom[0].muc.length, 5);
  assert.deepEqual(kq.ghiChu, ['Model, giá và giới hạn đổi nhanh — mỗi bài ghi mốc thời gian đã kiểm.']);
});

test('cuongthai.com/… là link NỘI BỘ', () => {
  const ds = tatCa('Làm theo trực tiếp tại cuongthai.com/work. Trong CT Work nhấn ? để mở Trợ giúp đúng bài của trang đang xem (mỗi bài có video tập tương ứng); tải app máy tính ở cuongthai.com/download/ct-work.');
  assert.ok(ds.some((m) => m.url === '/work' && m.noiBo));
  assert.ok(ds.some((m) => m.url === '/download/ct-work' && m.noiBo));
});

test('Trường có cấu trúc `documents` + tiện ích tệp', () => {
  const kq = taiLieuTuCauTruc([
    { title: 'PostgreSQL docs', url: 'postgresql.org/docs', mo_ta: 'Chính thức', loai: 'chinh-thuc' },
    { title: 'Code Lab', url: '/code-lab/postgresql', loai: 'thuc-hanh' },
  ]);
  assert.equal(kq.nhom.length, 2);
  assert.equal(kq.nhom[0].muc[0].url, 'https://postgresql.org/docs');
  assert.equal(kq.nhom[1].muc[0].noiBo, true);
  const json = docTaiLieuKhoa(JSON.stringify([{ title: 'Slide', url: 'https://x.dev/a.pdf', loai: 'tai-ve', nhom: 'Slide của trường' }]));
  assert.equal(json.nhom[0].tieuDe, 'Slide của trường');
  assert.equal(docTaiLieuKhoa('[không phải json').nhom.length, 1, 'chuỗi bắt đầu bằng [ mà hỏng ⇒ đọc như chữ');
  assert.deepEqual(docTaiLieuKhoa(''), { nhom: [], ghiChu: [] });
  assert.equal(kieuTep('Syllabus.pdf').nhan, 'PDF');
  assert.equal(kieuTep('slide.pptx').nhan, 'PPTX');
  assert.equal(kieuTep('x', 'link').nhan, 'LINK');
  assert.equal(dungLuong(1536 * 1024), '1.5 MB');
  assert.equal(dungLuong(0), '');
});

test('Quét MỌI tệp khoá có documentsNote: không ném lỗi, mọi URL hợp lệ, không mục rỗng, link ngoài là https', async () => {
  const goc = path.resolve(__dirname, '..', '..', '..', 'content');
  let soGhiChu = 0; let soMuc = 0; let soLink = 0;
  for (const d of ['courses', 'academy']) {
    for (const f of fs.readdirSync(path.join(goc, d))) {
      if (!f.endsWith('.mjs')) continue;
      const p = path.join(goc, d, f);
      if (!/documentsNote\s*:/.test(fs.readFileSync(p, 'utf8'))) continue;
      const mod = await import(pathToFileURL(p).href);
      const note: string | undefined = mod.default?.course?.documentsNote;
      if (!note) continue;
      soGhiChu++;
      const kq = phanTichGhiChuTaiLieu(note);
      const ds = kq.nhom.flatMap((n) => n.muc);
      assert.ok(ds.length > 0 || kq.ghiChu.length > 0, `${d}/${f}: không ra mục nào`);
      for (const m of ds) {
        soMuc++;
        assert.ok(m.ten.trim().length > 0, `${d}/${f}: mục rỗng`);
        assert.ok(m.ten.length < 260, `${d}/${f}: tên quá dài, tách sai? "${m.ten.slice(0, 80)}…"`);
        if (m.url) {
          soLink++;
          if (m.noiBo) assert.match(m.url, /^\/[a-z0-9/-]*$/, `${d}/${f}: tuyến nội bộ lạ ${m.url}`);
          else assert.doesNotThrow(() => new URL(m.url!), `${d}/${f}: URL hỏng ${m.url}`);
          if (!m.noiBo) assert.match(m.url, /^https?:\/\//);
        }
      }
    }
  }
  assert.ok(soGhiChu >= 100, `chỉ thấy ${soGhiChu} ghi chú`);
  assert.ok(soLink / soMuc > 0.4, `quá ít link: ${soLink}/${soMuc}`);
});
