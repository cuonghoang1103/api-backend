/**
 * Test bộ chuyển đổi ProseMirror ↔ Markdown.
 *
 * Mỗi test ở đây bảo vệ một cách MẤT NỘI DUNG cụ thể. Bộ chuyển đổi này đứng
 * giữa thứ người dùng đã viết và file trên đĩa họ; một lỗi ở đây không làm app
 * treo — nó âm thầm cắt mất một đoạn văn, và người dùng chỉ biết khi quá muộn.
 */
import { describe, expect, it } from 'vitest';
import { checkConvertible, fromMarkdown, noteFileName, toMarkdown } from './markdown';

const doc = (...content: unknown[]) => ({ type: 'doc', content });
const para = (text: string) => ({ type: 'paragraph', content: [{ type: 'text', text }] });

describe('checkConvertible — chặn trước khi làm hỏng', () => {
  it('tài liệu thường thì an toàn', () => {
    const result = checkConvertible(doc(para('xin chào'), { type: 'horizontalRule' }));
    expect(result.safe).toBe(true);
    expect(result.unsupported).toEqual([]);
  });

  it('phát hiện BẢNG — thứ Markdown thuần không biểu diễn được', () => {
    const result = checkConvertible(
      doc({ type: 'table', content: [{ type: 'tableRow', content: [] }] }),
    );
    expect(result.safe).toBe(false);
    expect(result.unsupported).toContain('table');
  });

  it('phát hiện ẢNH nhúng', () => {
    const result = checkConvertible(doc({ type: 'image', attrs: { src: 'x.png' } }));
    expect(result.safe).toBe(false);
    expect(result.unsupported).toContain('image');
  });

  it('phát hiện nút lồng sâu, không chỉ ở tầng đầu', () => {
    const result = checkConvertible(
      doc({
        type: 'blockquote',
        content: [{ type: 'taskList', content: [] }],
      }),
    );
    expect(result.unsupported).toContain('taskList');
  });

  it('phát hiện mark lạ', () => {
    const result = checkConvertible(
      doc({
        type: 'paragraph',
        content: [{ type: 'text', text: 'x', marks: [{ type: 'highlight' }] }],
      }),
    );
    expect(result.unsupported).toContain('mark:highlight');
  });
});

describe('toMarkdown', () => {
  it('tiêu đề theo đúng cấp', () => {
    const md = toMarkdown(
      doc({ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Mục' }] }),
    );
    expect(md).toBe('### Mục');
  });

  it('giữ định dạng đậm / nghiêng / mã / gạch ngang', () => {
    const md = toMarkdown(
      doc({
        type: 'paragraph',
        content: [
          { type: 'text', text: 'đậm', marks: [{ type: 'bold' }] },
          { type: 'text', text: ' và ' },
          { type: 'text', text: 'mã', marks: [{ type: 'code' }] },
        ],
      }),
    );
    expect(md).toBe('**đậm** và `mã`');
  });

  it('liên kết giữ cả chữ lẫn địa chỉ', () => {
    const md = toMarkdown(
      doc({
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'web',
            marks: [{ type: 'link', attrs: { href: 'https://cuongthai.com' } }],
          },
        ],
      }),
    );
    expect(md).toBe('[web](https://cuongthai.com)');
  });

  it('danh sách có thứ tự đánh số đúng', () => {
    const md = toMarkdown(
      doc({
        type: 'orderedList',
        content: [
          { type: 'listItem', content: [para('một')] },
          { type: 'listItem', content: [para('hai')] },
        ],
      }),
    );
    expect(md).toContain('1. một');
    expect(md).toContain('2. hai');
  });

  it('mark lạ MẤT ĐỊNH DẠNG nhưng GIỮ CHỮ', () => {
    // Đây là đánh đổi có chủ ý: chữ quan trọng hơn kiểu chữ.
    const md = toMarkdown(
      doc({
        type: 'paragraph',
        content: [{ type: 'text', text: 'nội dung quan trọng', marks: [{ type: 'highlight' }] }],
      }),
    );
    expect(md).toBe('nội dung quan trọng');
  });
});

describe('fromMarkdown', () => {
  it('không bao giờ trả về tài liệu rỗng', () => {
    // Tài liệu ProseMirror rỗng làm trình soạn thảo phía web nổ.
    const result = fromMarkdown('') as { content: unknown[] };
    expect(result.content.length).toBeGreaterThan(0);
  });

  it('gom nhiều dòng gạch đầu dòng thành MỘT danh sách', () => {
    const result = fromMarkdown('- a\n- b\n- c') as {
      content: { type: string; content: unknown[] }[];
    };
    expect(result.content).toHaveLength(1);
    expect(result.content[0]?.type).toBe('bulletList');
    expect(result.content[0]?.content).toHaveLength(3);
  });

  it('khối mã giữ nguyên nội dung bên trong, không diễn giải', () => {
    const result = fromMarkdown('```js\nconst x = **a**;\n```') as {
      content: { type: string; content: { text: string }[] }[];
    };
    expect(result.content[0]?.type).toBe('codeBlock');
    // `**a**` PHẢI còn nguyên — trong khối mã thì đó là mã, không phải chữ đậm.
    expect(result.content[0]?.content[0]?.text).toBe('const x = **a**;');
  });

  it('`**` được xét trước `*` — nếu ngược lại thì chữ đậm vỡ thành nghiêng rỗng', () => {
    const result = fromMarkdown('**đậm**') as {
      content: { content: { text: string; marks: { type: string }[] }[] }[];
    };
    const node = result.content[0]?.content[0];
    expect(node?.text).toBe('đậm');
    expect(node?.marks[0]?.type).toBe('bold');
  });
});

describe('vòng tròn Markdown → ProseMirror → Markdown', () => {
  const cases = [
    '# Tiêu đề',
    'Đoạn văn bình thường có dấu tiếng Việt.',
    '**đậm** và *nghiêng* và `mã`',
    '- một\n- hai',
    '1. một\n2. hai',
    '> trích dẫn',
    '```ts\nconst a = 1;\n```',
    '[CuongThai](https://cuongthai.com)',
  ];

  for (const md of cases) {
    it(`giữ nguyên: ${md.split('\n')[0]}`, () => {
      // Đi hai vòng chứ không phải một: vòng đầu có thể chuẩn hoá khoảng trắng,
      // nhưng từ vòng hai trở đi kết quả PHẢI ổn định. Không ổn định nghĩa là
      // mỗi lần lưu lại làm nội dung trôi đi một chút.
      const once = toMarkdown(fromMarkdown(md));
      const twice = toMarkdown(fromMarkdown(once));
      expect(twice).toBe(once);
      expect(once).toContain(md.split('\n')[0]!.replace(/^[-*]\s|^\d+\.\s/, '').slice(0, 10));
    });
  }
});

describe('noteFileName', () => {
  it('bỏ dấu tiếng Việt và ký tự đặc biệt', () => {
    expect(noteFileName(12, 'Ghi chú về Đường & Muối!')).toBe('12-ghi-chu-ve-duong-muoi.md');
  });

  it('luôn có id đứng đầu nên hai ghi chú trùng tên không đè nhau', () => {
    expect(noteFileName(1, 'Trùng')).not.toBe(noteFileName(2, 'Trùng'));
  });

  it('tiêu đề rỗng vẫn ra tên hợp lệ', () => {
    expect(noteFileName(7, '')).toBe('7-ghi-chu.md');
  });

  it('tên không bao giờ chứa dấu phân cách hay ".." (bị IPC chặn)', () => {
    const name = noteFileName(3, '../../etc/passwd');
    expect(name).not.toContain('..');
    expect(name).not.toContain('/');
    expect(name.endsWith('.md')).toBe(true);
  });
});
