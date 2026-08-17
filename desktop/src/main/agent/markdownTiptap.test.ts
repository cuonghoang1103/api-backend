/**
 * Kiểm bộ chuyển Markdown → TipTap.
 *
 * Mọi lỗi ở đây đều thuộc loại "lưu thành công, API trả 200, ghi chú hiện ra
 * TRỐNG": ProseMirror vứt lặng lẽ node nào nó không biết, và ném khi gặp node
 * text rỗng. Nên phải kiểm bằng hình dạng tài liệu, không phải bằng mắt.
 */
import { describe, it, expect } from 'vitest';
import { markdownSangTiptap, tiptapSangHtml, tiptapSangChu, type NutTiptap } from './markdownTiptap';

/** Mọi type xuất hiện trong tài liệu, kể cả lồng sâu. */
function moiType(n: NutTiptap[]): string[] {
  return n.flatMap((x) => [x.type, ...moiType(x.content ?? [])]);
}

/** Node trình soạn thật sự có — xem chú thích đầu markdownTiptap.ts. */
const CHO_PHEP = new Set([
  'paragraph', 'text', 'heading', 'bulletList', 'orderedList', 'listItem',
  'blockquote', 'codeBlock', 'horizontalRule', 'hardBreak',
]);

describe('markdownSangTiptap', () => {
  it('không bao giờ trả tài liệu rỗng', () => {
    // `{type:'doc', content: []}` làm ProseMirror ném lúc nạp ⇒ ghi chú không
    // mở được nữa, tệ hơn hẳn một ghi chú trống.
    expect(markdownSangTiptap('').content).toHaveLength(1);
    expect(markdownSangTiptap('   \n\n  ').content[0]?.type).toBe('paragraph');
  });

  it('KHÔNG sinh node text rỗng', () => {
    // ProseMirror ném "Empty text nodes are not allowed" — cả ghi chú hỏng.
    const doc = markdownSangTiptap('**đậm**\n\n\n``\n\n- \n');
    const rong = (n: NutTiptap[]): boolean =>
      n.some((x) => (x.type === 'text' && !x.text) || rong(x.content ?? []));
    expect(rong(doc.content)).toBe(false);
  });

  it('chỉ dùng node trình soạn có', () => {
    const md = '# Đề\n\nĐoạn **đậm** và `mã`.\n\n- một\n- hai\n\n1. a\n2. b\n\n> trích\n\n---\n\n```ts\nconst x = 1;\n```';
    const la = moiType(markdownSangTiptap(md).content).filter((t) => !CHO_PHEP.has(t));
    expect(la).toEqual([]);
  });

  it('tiêu đề sâu hơn 3 bị KẸP, không bị vứt', () => {
    // Trình soạn chỉ bật levels [1,2,3]; `level: 5` ⇒ ProseMirror bỏ cả tiêu đề.
    const doc = markdownSangTiptap('##### năm');
    expect(doc.content[0]).toMatchObject({ type: 'heading', attrs: { level: 3 } });
    expect(tiptapSangChu(doc)).toContain('năm');
  });

  it('gom danh sách liền nhau thành MỘT list', () => {
    const doc = markdownSangTiptap('- a\n- b\n- c');
    expect(doc.content).toHaveLength(1);
    expect(doc.content[0]?.content).toHaveLength(3);
  });

  it('khối mã giữ NGUYÊN VĂN, kể cả dấu markdown bên trong', () => {
    const doc = markdownSangTiptap('```py\nx = "**không đậm**"\n  thụt lề\n```');
    const kh = doc.content[0]!;
    expect(kh.type).toBe('codeBlock');
    expect(kh.attrs?.language).toBe('py');
    expect(kh.content?.[0]?.text).toBe('x = "**không đậm**"\n  thụt lề');
  });

  it('liên kết javascript: KHÔNG thành liên kết', () => {
    // Một cái bẫy do model sinh ra sẽ nằm lại vĩnh viễn trong dữ liệu người dùng.
    const doc = markdownSangTiptap('[bấm đây](javascript:alert(1))');
    const t = JSON.stringify(doc);
    expect(t).not.toContain('"link"');
    expect(tiptapSangChu(doc)).toContain('bấm đây');
  });

  it('liên kết http vẫn là liên kết', () => {
    const doc = markdownSangTiptap('[nodejs](https://nodejs.org/api/fs.html)');
    expect(JSON.stringify(doc)).toContain('https://nodejs.org/api/fs.html');
    expect(doc.content[0]?.content?.[0]?.marks?.[0]?.type).toBe('link');
  });

  it('tiếng Việt có dấu đi qua nguyên vẹn', () => {
    const md = '# Kế hoạch tuần\n\nHọp **thứ Ba** lúc 9h — đừng quên đề xuất.';
    expect(tiptapSangChu(markdownSangTiptap(md))).toContain('Họp thứ Ba lúc 9h — đừng quên đề xuất.');
  });
});

describe('tiptapSangHtml', () => {
  it('thoát HTML để chữ của model không thành thẻ', () => {
    const html = tiptapSangHtml(markdownSangTiptap('Dùng <script>alert(1)</script> nhé'));
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('có đủ khối để notes_search tìm lại được', () => {
    const html = tiptapSangHtml(markdownSangTiptap('# Đề\n\n- một\n\n```\nma\n```'));
    expect(html).toContain('<h1>Đề</h1>');
    expect(html).toContain('<ul><li><p>một</p></li></ul>');
    expect(html).toContain('<code>ma</code>');
  });
});
