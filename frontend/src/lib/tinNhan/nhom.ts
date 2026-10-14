/**
 * Tin nhắn — phần THUẦN (không React, không mạng) dùng chung cho web và app
 * desktop. Test ở `desktop/src/renderer/features/messages/nhom.test.ts`.
 *
 *   · `nhomTin()`     — gom tin thành CỤM theo người gửi liên tiếp, kiểu Messenger
 *   · `xemTruocTin()` — dòng xem trước ở danh sách hội thoại, dựng từ MỘT tin
 */

/*
 * Kiểu TỐI THIỂU khai tại chỗ, KHÔNG import từ `@/lib/api`: app desktop kiểm
 * kiểu tệp này với một bản khai rút gọn của `@/lib/api` (shims/web-modules.d.ts)
 * — import kiểu từ đó là `tsc` của desktop đỏ. Kiểu đầy đủ của web khớp cấu
 * trúc với những kiểu này nên truyền thẳng vào được.
 */
interface TepDinhKem { mimeType: string; fileName: string; url: string }
export interface TinCoBan {
  id: number;
  senderId: number;
  content: string;
  createdAt: string;
  deleted?: boolean;
  recalled?: boolean;
  mediaUrl?: string | null;
  mediaKind?: string | null;
  attachments?: TepDinhKem[];
  postShare?: unknown;
}
export interface XemTruoc {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  hasAttachment: boolean;
  attachmentMime: string | null;
  attachmentName: string | null;
}

/** Hai tin cùng người gửi cách nhau quá chừng này thì tách cụm (Messenger ≈ vài phút). */
export const KHOANG_TACH_CUM_MS = 5 * 60 * 1000;

/** Vị trí của một tin trong cụm — quyết định góc bo và chỗ đặt ảnh đại diện. */
export type ViTriTrongCum = 'mot' | 'dau' | 'giua' | 'cuoi';

export interface TinTrongCum<T extends TinCoBan = TinCoBan> {
  tin: T;
  viTri: ViTriTrongCum;
}

export interface CumTin<T extends TinCoBan = TinCoBan> {
  /** Khoá ổn định cho React: id của tin đầu cụm. */
  khoa: number;
  senderId: number;
  laCuaToi: boolean;
  tins: TinTrongCum<T>[];
}

/** Tin "hệ thống" (đã thu hồi / đã xoá) — vẽ thành dòng giữa, cắt cụm. */
export function laTinHeThong(m: Pick<TinCoBan, 'recalled' | 'deleted'>): boolean {
  return !!m.recalled || !!m.deleted;
}

function cungNgay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * Gom tin (đã xếp cũ → mới) thành cụm.
 *
 * Tin mới vào cụm hiện tại khi: CÙNG người gửi, cùng ngày, cách tin trước
 * ≤ `KHOANG_TACH_CUM_MS`, và cả hai đều không phải tin hệ thống. Tin hệ thống
 * luôn đứng một mình.
 *
 * Vì sao cần: trước 14/10/2026 mỗi bong bóng tự quyết có hiện ảnh đại diện
 * hay không, và ô ảnh đại diện có bề rộng 0 khi không hiện ⇒ bong bóng của
 * người kia thụt ra thụt vào theo từng tin.
 */
export function nhomTin<T extends TinCoBan>(tins: T[], myId: number | undefined): CumTin<T>[] {
  const cums: CumTin<T>[] = [];
  let truoc: T | null = null;
  for (const m of tins) {
    const noiDuoc = truoc !== null
      && cums.length > 0
      && truoc.senderId === m.senderId
      && !laTinHeThong(truoc)
      && !laTinHeThong(m)
      && cungNgay(new Date(truoc.createdAt), new Date(m.createdAt))
      && Math.abs(new Date(m.createdAt).getTime() - new Date(truoc.createdAt).getTime()) <= KHOANG_TACH_CUM_MS;
    if (noiDuoc) {
      cums[cums.length - 1]!.tins.push({ tin: m, viTri: 'giua' });
    } else {
      cums.push({ khoa: m.id, senderId: m.senderId, laCuaToi: m.senderId === myId, tins: [{ tin: m, viTri: 'giua' }] });
    }
    truoc = m;
  }
  for (const c of cums) {
    const n = c.tins.length;
    c.tins.forEach((t, i) => {
      t.viTri = n === 1 ? 'mot' : i === 0 ? 'dau' : i === n - 1 ? 'cuoi' : 'giua';
    });
  }
  return cums;
}

/**
 * Dòng xem trước cho danh sách hội thoại, dựng từ MỘT tin (socket / vừa gửi).
 *
 * Phải khớp `serializeMessagePreview` ở backend: tin chỉ có GIF/nhãn dán thì
 * `content` rỗng — không gắn nhãn là hàng hiện "Chưa có tin nhắn" ngay sau
 * khi người kia vừa gửi GIF.
 */
export function xemTruocTin(m: TinCoBan): XemTruoc {
  const content = m.content
    || (m.mediaKind === 'gif' ? '🎬 GIF' : m.mediaKind === 'sticker' ? '🪄 Nhãn dán' : '')
    || (m.postShare ? '🔗 Bài viết' : '');
  return {
    id: m.id,
    content,
    senderId: m.senderId,
    createdAt: m.createdAt,
    hasAttachment: (m.attachments?.length ?? 0) > 0,
    attachmentMime: m.attachments?.[0]?.mimeType ?? null,
    attachmentName: m.attachments?.[0]?.fileName ?? null,
  };
}

/** Ảnh mở được trong trình xem ảnh: ảnh đính kèm + GIF. Nhãn dán KHÔNG (Messenger cũng không mở). */
export interface AnhTrongHoiThoai {
  url: string;
  ten: string;
  tinId: number;
  laGif: boolean;
}

export function anhCuaTin(m: TinCoBan, giaiUrl: (u: string) => string): AnhTrongHoiThoai[] {
  if (laTinHeThong(m)) return [];
  const ra: AnhTrongHoiThoai[] = [];
  if (m.mediaUrl && m.mediaKind === 'gif') ra.push({ url: m.mediaUrl, ten: 'gif', tinId: m.id, laGif: true });
  for (const a of m.attachments ?? []) {
    if (a.mimeType.startsWith('image/')) {
      ra.push({ url: giaiUrl(a.url), ten: a.fileName, tinId: m.id, laGif: a.mimeType === 'image/gif' });
    }
  }
  return ra;
}
