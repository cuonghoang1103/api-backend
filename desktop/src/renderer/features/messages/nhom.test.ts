import { describe, expect, it } from 'vitest';
/* Kiểm tệp DÙNG CHUNG `frontend/src/lib/tinNhan/nhom.ts` (web + app desktop cùng một cây messenger). */
import { anhCuaTin, KHOANG_TACH_CUM_MS, nhomTin, xemTruocTin, type TinCoBan } from '@/lib/tinNhan/nhom';

type MessagingMessage = TinCoBan & { attachments: Array<{ id: number; fileId: number; mimeType: string; fileName: string; fileSize: number; url: string }> };

const goc = new Date(2026, 9, 14, 10, 0, 0).getTime();
let id = 0;
function tin(senderId: number, phut: number, them: Partial<MessagingMessage> = {}): MessagingMessage {
  id += 1;
  return {
    id, senderId, content: `tin ${id}`, deleted: false,
    createdAt: new Date(goc + phut * 60_000).toISOString(),
    attachments: [], ...them,
  };
}

describe('nhomTin — cụm tin kiểu Messenger', () => {
  it('tin liên tiếp cùng người ⇒ MỘT cụm, vị trí đầu/giữa/cuối', () => {
    const c = nhomTin([tin(2, 0), tin(2, 1), tin(2, 2)], 1);
    expect(c).toHaveLength(1);
    expect(c[0]!.tins.map((t) => t.viTri)).toEqual(['dau', 'giua', 'cuoi']);
    expect(c[0]!.laCuaToi).toBe(false);
  });

  it('đổi người gửi ⇒ cụm mới; tin lẻ có vị trí "mot"', () => {
    const c = nhomTin([tin(2, 0), tin(1, 1), tin(2, 2)], 1);
    expect(c.map((x) => x.tins.map((t) => t.viTri))).toEqual([['mot'], ['mot'], ['mot']]);
    expect(c[1]!.laCuaToi).toBe(true);
  });

  it('cách nhau quá khoảng tách ⇒ tách cụm dù cùng người', () => {
    const c = nhomTin([tin(2, 0), tin(2, KHOANG_TACH_CUM_MS / 60_000 + 1)], 1);
    expect(c).toHaveLength(2);
  });

  it('tin đã thu hồi / đã xoá đứng một mình, cắt cụm', () => {
    const c = nhomTin([tin(2, 0), tin(2, 1, { recalled: true }), tin(2, 2)], 1);
    expect(c).toHaveLength(3);
  });

  it('khác ngày ⇒ khác cụm', () => {
    const a = tin(2, 0, { createdAt: new Date(2026, 9, 14, 23, 59).toISOString() });
    const b = tin(2, 0, { createdAt: new Date(2026, 9, 15, 0, 1).toISOString() });
    expect(nhomTin([a, b], 1)).toHaveLength(2);
  });
});

describe('xemTruocTin — dòng xem trước ở danh sách', () => {
  it('GIF / nhãn dán không có chữ vẫn có nhãn (khớp backend serializeMessagePreview)', () => {
    expect(xemTruocTin(tin(2, 0, { content: '', mediaUrl: 'https://x/a.gif', mediaKind: 'gif' })).content).toBe('🎬 GIF');
    expect(xemTruocTin(tin(2, 0, { content: '', mediaUrl: 'https://x/s.png', mediaKind: 'sticker' })).content).toBe('🪄 Nhãn dán');
  });

  it('tệp đính kèm: hasAttachment + mime + tên', () => {
    const x = xemTruocTin(tin(2, 0, {
      content: '',
      attachments: [{ id: 1, fileId: 9, mimeType: 'image/png', fileName: 'a.png', fileSize: 10, url: 'u' }],
    }));
    expect(x).toMatchObject({ hasAttachment: true, attachmentMime: 'image/png', attachmentName: 'a.png' });
  });
});

describe('anhCuaTin — ảnh mở được trong trình xem ảnh', () => {
  it('ảnh đính kèm + GIF; nhãn dán và tệp không phải ảnh thì KHÔNG', () => {
    const m = tin(2, 0, {
      mediaUrl: 'https://x/a.gif', mediaKind: 'gif',
      attachments: [
        { id: 1, fileId: 9, mimeType: 'image/jpeg', fileName: 'b.jpg', fileSize: 10, url: '/uploads/b.jpg' },
        { id: 2, fileId: 8, mimeType: 'application/pdf', fileName: 'c.pdf', fileSize: 10, url: '/uploads/c.pdf' },
      ],
    });
    const ds = anhCuaTin(m, (u) => `https://api/${u.replace(/^\//, '')}`);
    expect(ds.map((a) => a.url)).toEqual(['https://x/a.gif', 'https://api/uploads/b.jpg']);
    expect(anhCuaTin(tin(2, 0, { mediaUrl: 'https://x/s.png', mediaKind: 'sticker' }), (u) => u)).toEqual([]);
  });
});
