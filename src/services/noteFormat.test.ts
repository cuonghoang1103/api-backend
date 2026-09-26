/**
 * "✨ Sắp xếp lại trang" — canh các LUẬT CỨNG do mã giữ, không do prompt giữ.
 *
 * Model có lúc làm rơi một khối, nhân đôi một khối, bịa một liên kết hay trả
 * rỗng. Các phép kiểm dưới đây giả lập đúng những kiểu hỏng đó (không gọi model
 * thật) và đòi mã phải: gắn lại thứ bị rơi, gỡ thứ bị bịa, từ chối kết quả rỗng
 * hoặc mất chữ — thay vì lặng lẽ đưa một trang thiếu vào editor.
 *
 * Chạy: npx tsx --test src/services/noteFormat.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  docToMarkdown, rapKetQua, markdownThanhNut, chuanNgonNgu, type PmNode,
} from './noteFormat.service.js';

const p = (...content: PmNode[]): PmNode => ({ type: 'paragraph', content });
const t = (text: string, marks?: PmNode['marks']): PmNode => ({ type: 'text', text, ...(marks ? { marks } : {}) });
const doc = (...content: PmNode[]): PmNode => ({ type: 'doc', content });

const ANH: PmNode = { type: 'image', attrs: { src: 'https://cdn.example/a.png', alt: 'sơ đồ' } };
const CODE_CU: PmNode = { type: 'codeBlock', attrs: { language: 'sql' }, content: [t('SELECT 1;')] };
const CONG_THUC: PmNode = { type: 'math', attrs: { mode: 'inline' }, content: [t('E=mc^2')] };

function duyet(n: PmNode, f: (n: PmNode) => void) { f(n); (n.content ?? []).forEach((c) => duyet(c, f)); }
function tatCa(n: PmNode, type: string): PmNode[] { const r: PmNode[] = []; duyet(n, (x) => { if (x.type === type) r.push(x); }); return r; }
function hrefs(n: PmNode): string[] { const r: string[] = []; duyet(n, (x) => x.marks?.forEach((m) => { if (m.type === 'link') r.push(String(m.attrs?.href)); })); return r; }

const TRANG = doc(
  p(t('hom nay hoc docker, chay lenh docker ps de xem container dang chay va docker images de xem cac image co tren may')),
  p(t('image la khuon chi doc con container la ban chay cua image co the ghi du lieu vao')),
  ANH,
  p(t('tai lieu '), t('docs', [{ type: 'link', attrs: { href: 'https://docs.docker.com' } }]), t(' va cong thuc '), CONG_THUC),
  CODE_CU,
);

describe('docToMarkdown — chiều đi', () => {
  it('khối AI không được đụng ⇒ mã giữ chỗ, nút gốc cất nguyên', () => {
    const di = docToMarkdown(TRANG);
    assert.match(di.markdown, /⟦K1⟧/);
    assert.match(di.markdown, /⟦K2⟧/);
    assert.equal(di.khoi.get('K1'), ANH);
    assert.equal(di.khoi.get('K2'), CODE_CU);
    assert.equal(di.noiDong.get('N1'), CONG_THUC);
    assert.deepEqual(di.lienKet, ['https://docs.docker.com']);
    assert.match(di.markdown, /\[docs\]\(https:\/\/docs\.docker\.com\)/);
    assert.ok(di.chuGiai.some((c) => c.startsWith('⟦K2⟧ = khối code (sql)')));
  });

  it('danh sách chứa khối lạ ⇒ giữ nguyên CẢ danh sách', () => {
    const ds: PmNode = { type: 'bulletList', content: [{ type: 'listItem', content: [p(t('a')), ANH] }] };
    const di = docToMarkdown(doc(ds));
    assert.equal(di.markdown, '⟦K1⟧');
    assert.equal(di.khoi.get('K1'), ds);
  });

  it('chữ mang dấu định dạng lạ (vd highlight) ⇒ mã giữ chỗ nội dòng, không làm mất dấu', () => {
    const vang = t('quan trọng', [{ type: 'highlight' }]);
    const di = docToMarkdown(doc(p(t('đây là '), vang)));
    assert.equal(di.markdown, 'đây là ⟦N1⟧');
    assert.equal(di.noiDong.get('N1'), vang);
  });
});

describe('rapKetQua — luật cứng', () => {
  const di = docToMarkdown(TRANG);
  const chuGoc = di.chuThuan;
  const AI_TOT = [
    '## Tóm tắt', '- Học Docker: lệnh xem container và image.', '',
    '## Lệnh', '| Lệnh | Tác dụng |', '|---|---|', '| `docker ps` | Xem container đang chạy |', '| `docker images` | Xem các image có trên máy |', '',
    '## Image và container', 'Hôm nay học Docker. Image là khuôn, chỉ đọc; còn container là bản chạy của image, có thể ghi dữ liệu vào.', '',
    '⟦K1⟧', '', '```sh', 'docker ps', '```', '',
    '## Tài liệu', 'Tài liệu [docs](https://docs.docker.com) và công thức ⟦N1⟧.', '', '⟦K2⟧',
  ].join('\n');

  it('kết quả tốt ⇒ bảng + khối code + callout tóm tắt đầu trang, khối gốc cắm lại nguyên vẹn', () => {
    const kq = rapKetQua(AI_TOT, di, { chuGoc });
    const nodes = kq.doc.content!;
    assert.equal(nodes[0].type, 'callout');
    assert.equal(tatCa(kq.doc, 'table').length, 1);
    assert.ok(nodes.includes(ANH), 'ảnh gốc phải là CHÍNH nút gốc');
    assert.ok(nodes.includes(CODE_CU));
    assert.ok(tatCa(kq.doc, 'math').includes(CONG_THUC));
    const code = tatCa(kq.doc, 'codeBlock').find((c) => c !== CODE_CU)!;
    assert.equal(code.attrs?.language, 'bash', '```sh phải thành bash — ngôn ngữ editor có');
    assert.deepEqual(hrefs(kq.doc), ['https://docs.docker.com']);
    assert.deepEqual(kq.canhBao, []);
    // Thống kê do MÃ đếm: 3 mục (Lệnh, Image…, Tài liệu), 2 khối code, 1 bảng.
    assert.equal(kq.thongKe.muc, 3);
    assert.equal(kq.thongKe.khoiCode, 2);
    assert.equal(kq.thongKe.bang, 1);
  });

  it('AI làm rơi ảnh + liên kết ⇒ gắn lại cuối trang và cảnh báo', () => {
    const roi = AI_TOT.replace('⟦K1⟧', '').replace('[docs](https://docs.docker.com)', 'docs');
    const kq = rapKetQua(roi, di, { chuGoc });
    assert.ok(kq.doc.content!.includes(ANH), 'ảnh bị rơi phải được gắn lại');
    assert.ok(hrefs(kq.doc).includes('https://docs.docker.com'), 'liên kết bị rơi phải được gắn lại');
    assert.ok(kq.canhBao.some((c) => c.includes('khối')));
    assert.ok(kq.canhBao.some((c) => c.includes('liên kết')));
  });

  it('AI nhân đôi khối ⇒ chỉ giữ một bản', () => {
    const kq = rapKetQua(`${AI_TOT}\n\n⟦K1⟧`, di, { chuGoc });
    assert.equal(kq.doc.content!.filter((n) => n === ANH).length, 1);
    assert.ok(kq.canhBao.some((c) => c.includes('lặp')));
  });

  it('AI bịa liên kết ⇒ gỡ liên kết, giữ chữ', () => {
    const bia = AI_TOT.replace('## Lệnh', '## Lệnh\nXem [hướng dẫn](https://evil.example/x).');
    const kq = rapKetQua(bia, di, { chuGoc });
    assert.ok(!hrefs(kq.doc).includes('https://evil.example/x'));
    assert.ok(JSON.stringify(kq.doc).includes('hướng dẫn'));
    assert.ok(kq.canhBao.some((c) => c.includes('evil.example')));
  });

  it('mã khối bịa (⟦K9⟧) bị bỏ, không làm hỏng trang', () => {
    const kq = rapKetQua(`${AI_TOT}\n\n⟦K9⟧`, di, { chuGoc });
    assert.ok(!JSON.stringify(kq.doc).includes('⟦K9⟧'));
  });

  it('AI thêm số liệu ⇒ cảnh báo chỉ đúng con số', () => {
    const kq = rapKetQua(AI_TOT.replace('Hôm nay học Docker.', 'Hôm nay học Docker 27.'), di, { chuGoc });
    assert.ok(kq.canhBao.some((c) => c.includes('27')));
  });

  it('trả rỗng ⇒ TỪ CHỐI (AI_EMPTY)', () => {
    assert.throws(() => rapKetQua('   ', di, { chuGoc }), (e: { code?: string }) => e.code === 'AI_EMPTY');
    assert.throws(() => rapKetQua('```markdown\n\n```', di, { chuGoc }), (e: { code?: string }) => e.code === 'AI_EMPTY');
  });

  it('mất quá nửa số từ ⇒ TỪ CHỐI (AI_LOST_CONTENT)', () => {
    assert.throws(() => rapKetQua('## Docker\nHọc Docker.\n\n⟦K1⟧\n\n⟦K2⟧ ⟦N1⟧', di, { chuGoc }),
      (e: { code?: string }) => e.code === 'AI_LOST_CONTENT');
  });

  it('cả bài bị bọc trong ```markdown ⇒ bóc rào, không thành một khối code', () => {
    const kq = rapKetQua('```markdown\n' + AI_TOT + '\n```', di, { chuGoc });
    assert.equal(tatCa(kq.doc, 'table').length, 1);
  });

  it('mọi nút chữ đều có chữ (ProseMirror từ chối text rỗng)', () => {
    const kq = rapKetQua(AI_TOT + '\n\n**  **\n\n- \n', di, { chuGoc });
    duyet(kq.doc, (n) => { if (n.type === 'text') assert.ok((n.text ?? '').length > 0); });
  });

  it('chữ có ký tự HTML không bị thoát thành &amp;', () => {
    const d2 = docToMarkdown(doc(p(t('a & b <c> "q" it\'s — và thêm vài chữ nữa cho đủ dài để kiểm'))));
    const kq = rapKetQua('a & b <c> "q" it\'s — và thêm vài chữ nữa cho đủ dài để kiểm', d2, { chuGoc: d2.markdown });
    const s = JSON.stringify(kq.doc);
    assert.ok(s.includes('a & b'), s);
    assert.ok(!s.includes('&amp;'));
    assert.ok(s.includes('it\'s'));
  });

  it('checklist + danh sách lồng + trích dẫn ⇒ đúng loại nút TipTap', () => {
    const d2 = docToMarkdown(doc(p(t('viec can lam mua sua lam bai tap ghi chu them'))));
    const kq = rapKetQua('- [ ] mua sữa\n- [x] làm bài tập\n\n1. a\n   - con\n\n> ghi chú thêm', d2, { chuGoc: 'viec can lam mua sua lam bai tap a con ghi chu them' });
    const task = tatCa(kq.doc, 'taskList')[0];
    assert.equal(task.content!.length, 2);
    assert.equal(task.content![1].attrs?.checked, true);
    assert.equal(tatCa(kq.doc, 'orderedList').length, 1);
    assert.equal(tatCa(kq.doc, 'bulletList').length, 1);
    assert.equal(tatCa(kq.doc, 'blockquote').length, 1);
    for (const li of [...tatCa(kq.doc, 'listItem'), ...tatCa(kq.doc, 'taskItem')]) {
      assert.equal(li.content![0].type, 'paragraph', 'listItem phải mở đầu bằng paragraph');
    }
  });
});

describe('markdownThanhNut — menu AI trên đoạn bôi đen', () => {
  it('bảng Markdown ⇒ nút table (không còn là đoạn đầy dấu |)', () => {
    const nodes = markdownThanhNut('| Lệnh | Nghĩa |\n|---|---|\n| `ls` | liệt kê |', () => false);
    assert.equal(nodes[0].type, 'table');
    assert.equal(nodes[0].content![0].content![0].type, 'tableHeader');
  });
});

describe('chuanNgonNgu', () => {
  it('bí danh ⇒ ngôn ngữ editor có; lạ ⇒ rỗng (plain text)', () => {
    assert.equal(chuanNgonNgu('sh'), 'bash');
    assert.equal(chuanNgonNgu('TS'), 'typescript');
    assert.equal(chuanNgonNgu('cobol'), '');
    assert.equal(chuanNgonNgu(undefined), '');
  });
});
