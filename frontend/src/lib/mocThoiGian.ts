/**
 * ============================================================
 * MỐC THỜI GIAN TRONG CÂU TRẢ LỜI CỦA GIA SƯ
 * ============================================================
 *
 * Gia sư ở phòng học video được lệnh trích dẫn kèm `[mm:ss]` (xem
 * `THEM_PHONG_VIDEO` trong `courseTutor.service.ts`). Ở đây biến những mốc đó
 * thành LIÊN KẾT BẤM ĐƯỢC để nhảy thẳng tới giây ấy trong video.
 *
 * ⚠️ KHÔNG tự vẽ lại markdown để làm việc này. Câu trả lời của gia sư có
 * bảng, công thức KaTeX, sơ đồ mermaid, khối mã — `ChatMarkdown` dựng tất cả
 * và đã trả giá nhiều lần để dựng đúng. Nên cách làm là CHÈN cú pháp liên kết
 * markdown vào chuỗi TRƯỚC khi đưa cho nó, rồi chặn cú bấm ở `onClick`.
 *
 * Bản song sinh của `MocThoiGian.swift` bên app iOS — sửa một bên thì soi lại
 * bên kia.
 */

/**
 * Tiền tố NEO, không phải lược đồ URL.
 *
 * ⚠️⚠️ App iOS dùng `tua://139` vì `OpenURLAction` của SwiftUI nhận lược đồ
 * tự chế. TRÊN WEB THÌ KHÔNG ĐƯỢC. `react-markdown` chạy `defaultUrlTransform`
 * trên mọi href và chỉ cho qua http/https/irc/mailto/xmpp cùng đường dẫn
 * tương đối — mọi thứ khác bị thay bằng chuỗi RỖNG. Đo thật 20/09/2026:
 *
 *     defaultUrlTransform('tua://139')  → ''
 *     defaultUrlTransform('#tua-139')   → '#tua-139'
 *
 * Nên mốc thời gian sẽ hiện ra trông y như một liên kết, bấm vào KHÔNG có gì
 * xảy ra, và không có lỗi nào để lần. Dạng neo `#tua-139` không có dấu hai
 * chấm nên bộ lọc coi là tương đối và giữ nguyên.
 */
export const TIEN_TO = '#tua-';

/*
 * `[1:23]`, `[01:23]`, `[1:02:03]`, và dạng khoảng `[2:19 - 4:05]`.
 *
 * ⚠️ Nhóm thứ hai để TUỲ CHỌN chứ không tách thành hai mẫu: một mẫu chỉ khớp
 * mốc đơn sẽ ăn `[2:19` của khoảng rồi bỏ lại ` - 4:05]` thành chữ lạc lõng.
 */
const MAU = /\[(\d{1,2}:\d{2}(?::\d{2})?)(?:\s*[-–—]\s*(\d{1,2}:\d{2}(?::\d{2})?))?\]/g;

/** `mm:ss` hoặc `hh:mm:ss` → giây. Trả `null` nếu không đọc được. */
export function giay(s: string): number | null {
  const p = s.split(':').map((x) => Number(x));
  if (p.some((x) => !Number.isFinite(x))) return null;
  if (p.length === 2) return p[0] * 60 + p[1];
  if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
  return null;
}

/** Giây → `m:ss` (hoặc `h:mm:ss` khi video dài hơn một giờ). */
export function moc(g: number): string {
  const n = Math.max(0, Math.floor(g));
  const gio = Math.floor(n / 3600);
  const phut = Math.floor((n % 3600) / 60);
  const giay2 = n % 60;
  const hai = (x: number) => String(x).padStart(2, '0');
  return gio > 0 ? `${gio}:${hai(phut)}:${hai(giay2)}` : `${phut}:${hai(giay2)}`;
}

/** `#tua-139` → 139. Mọi href khác trả `null` (để trình duyệt xử lý như thường). */
export function giayTuURL(href: string | null | undefined): number | null {
  if (!href || !href.startsWith(TIEN_TO)) return null;
  const n = Number(href.slice(TIEN_TO.length));
  return Number.isFinite(n) ? n : null;
}

/**
 * Chèn liên kết vào mọi mốc: `[2:19]` → `[2:19](tua://139)`.
 *
 * ⚠️ BỎ QUA phần nằm trong khối mã. Một dòng `arr[1:23]` trong ví dụ Python
 * trông y hệt một mốc thời gian, và biến nó thành liên kết là sửa mã của
 * người ta ngay giữa bài giảng. Hàng rào ``` và dấu nháy đơn `…` đều được
 * đếm để biết đang ở trong hay ngoài.
 */
export function themLienKet(chu: string): string {
  if (!chu) return chu;
  const dong = chu.split('\n');
  let trongKhoi = false;
  return dong
    .map((d) => {
      if (/^\s*(```|~~~)/.test(d)) { trongKhoi = !trongKhoi; return d; }
      if (trongKhoi) return d;
      // Tách theo nháy đơn: phần tử CHẴN nằm ngoài mã, LẺ nằm trong.
      return d
        .split('`')
        .map((phan, i) => (i % 2 === 1 ? phan : phan.replace(MAU, (khop, a: string, b?: string) => {
          const g = giay(a);
          if (g === null) return khop;
          const nhan = b ? `${a} - ${b}` : a;
          return `[${nhan}](${TIEN_TO}${g})`;
        })))
        .join('`');
    })
    .join('\n');
}

export interface Phan {
  tu: number;
  den: number | null;
  ten: string;
  y: string;
}

/**
 * Bóc các phần từ câu trả lời.
 *
 * Tolerant có chủ đích: model không phải lúc nào cũng viết đúng khuôn. Mọi
 * dòng có mốc ở ĐẦU đều được nhận, dù có `-`, `**`, hay số thứ tự phía trước.
 *
 * ⚠️ Mốc phải ở ĐẦU dòng. Nhận mốc ở giữa câu thì mọi câu văn có trích dẫn
 * `[2:19]` cũng thành một "phần", và mục lục biến thành danh sách rác dài
 * gấp mấy lần nội dung thật.
 */
export function bocPhan(chu: string): Phan[] {
  const ra: Phan[] = [];
  const mau = /^\s*(?:[-*+]\s*)?(?:\d+[.)]\s*)?\**\s*\[(\d{1,2}:\d{2}(?::\d{2})?)(?:\s*[-–—]\s*(\d{1,2}:\d{2}(?::\d{2})?))?\]\s*(.*)$/;
  let trongKhoiMa = false;
  for (const dong of chu.split('\n')) {
    if (/^\s*(```|~~~)/.test(dong)) { trongKhoiMa = !trongKhoiMa; continue; }
    if (trongKhoiMa) continue;
    const k = mau.exec(dong);
    if (!k) continue;
    const tu = giay(k[1]);
    if (tu === null) continue;
    const den = k[2] ? giay(k[2]) : null;

    // `**Tên phần** — mô tả`  /  `Tên phần: mô tả`  /  chỉ có tên
    const con = (k[3] || '').trim();
    const tach = con.match(/^\**\s*(.+?)\s*\**\s*(?:[—–]|\s-\s|:)\s*(.+)$/);
    const ten = (tach ? tach[1] : con).replace(/\*\*/g, '').trim();
    const y = (tach ? tach[2] : '').replace(/\*\*/g, '').trim();
    if (!ten && !y) continue;
    ra.push({ tu, den, ten: ten || moc(tu), y });
  }

  /* Trùng mốc thì giữ bản ĐẦU: model hay nhắc lại danh sách phần ở cuối câu
     trả lời, và hai bản đó chỉ khác cách diễn đạt. */
  const thay = new Set<number>();
  return ra.filter((p) => (thay.has(p.tu) ? false : (thay.add(p.tu), true)));
}
