/**
 * Đặt tên tệp / thư mục kết quả — hàm thuần, chạy được cả trong test.
 *
 * Tên do MÁY CHỦ đưa (`ketQua[].ten`) KHÔNG được tin: một tên như `../../.ssh/x` hay `C:\Windows\x` mà ghép thẳng
 * vào `path.join` là ghi ra ngoài thư mục tải. Mọi tên đi qua `lamSachTen()` (bỏ dấu phân cách, ký tự cấm của
 * Windows, tên dành riêng CON/NUL…, dấu chấm/khoảng trắng cuối) trước khi chạm đĩa.
 */

const KY_TU_CAM = /[<>:"/\\|?*\u0000-\u001f\u007f]/g;
const TEN_DANH_RIENG_WIN = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
/** Độ dài tối đa (ký tự) của phần tên — chừa chỗ cho " (99)" và đuôi; đường dẫn Windows mặc định trần 260. */
const DAI_TOI_DA = 120;

/** Tên an toàn cho mọi hệ điều hành. Rỗng ⇒ `duPhong`. */
export function lamSachTen(ten: string, duPhong = 'Video'): string {
  let s = String(ten ?? '')
    .normalize('NFC')
    .replace(KY_TU_CAM, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Bỏ dấu chấm/khoảng trắng ĐẦU (".." / tệp ẩn) và CUỐI (Windows tự cắt ⇒ trùng tên).
  s = s.replace(/^[. ]+/, '').replace(/[. ]+$/, '');
  if (TEN_DANH_RIENG_WIN.test(s)) s = `_${s}`;
  if (s.length > DAI_TOI_DA) {
    const { goc, duoi } = tachDuoi(s);
    s = goc.slice(0, Math.max(1, DAI_TOI_DA - duoi.length)).replace(/[. ]+$/, '') + duoi;
  }
  return s || duPhong;
}

/**
 * Tách đuôi: `a.mp4` ⇒ `.mp4`; phụ đề hai tầng `a.vi.srt` ⇒ `.vi.srt` (để bản trùng thành `a (2).vi.srt`, giữ
 * đuôi ngôn ngữ mà trình phát và các app khác dựa vào). Không có đuôi ⇒ chuỗi rỗng.
 */
export function tachDuoi(ten: string): { goc: string; duoi: string } {
  const srt = /(\.[a-z]{2,3}(?:-[a-z0-9]{2,8})?)?\.(srt|vtt)$/i.exec(ten);
  if (srt && srt.index > 0) return { goc: ten.slice(0, srt.index), duoi: ten.slice(srt.index) };
  const i = ten.lastIndexOf('.');
  if (i <= 0 || i === ten.length - 1 || ten.length - i > 10) return { goc: ten, duoi: '' };
  return { goc: ten.slice(0, i), duoi: ten.slice(i) };
}

/** `ten` đã có ⇒ `ten (2)`, `ten (3)`… (giữ đuôi). KHÔNG BAO GIỜ trả một tên mà `daCo()` báo đã tồn tại. */
export function tenKhongTrung(ten: string, daCo: (ten: string) => boolean): string {
  if (!daCo(ten)) return ten;
  const { goc, duoi } = tachDuoi(ten);
  for (let n = 2; n < 10_000; n += 1) {
    const thu = `${goc} (${n})${duoi}`;
    if (!daCo(thu)) return thu;
  }
  throw new Error('Không tìm được tên tệp trống');
}

/** Ngày theo giờ MÁY NÀY, dạng YYYY-MM-DD. */
export function ngayCucBo(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** `<YYYY-MM-DD> <Tên video>` — tên thư mục của một việc. */
export function tenThuMucViec(ngay: Date, tenVideo: string): string {
  return `${ngayCucBo(ngay)} ${lamSachTen(tenVideo)}`;
}

/** Tên hiển thị từ tên tệp gốc: bỏ đuôi video. */
export function tenTuTep(tenTep: string): string {
  return tenTep.replace(/\.(mp4|mkv|webm|mov|m4v|avi|flv|ts|wmv)$/i, '').trim() || tenTep;
}

export const DUOI_VIDEO = ['mp4', 'mkv', 'webm', 'mov', 'm4v', 'avi', 'flv', 'ts', 'wmv'] as const;

export function laTepVideo(ten: string): boolean {
  const m = /\.([a-z0-9]+)$/i.exec(ten);
  return !!m && (DUOI_VIDEO as readonly string[]).includes(m[1].toLowerCase());
}

export const DUOI_NHAC = ['mp3', 'm4a', 'aac', 'wav', 'ogg', 'opus', 'flac'] as const;

export function laTepNhac(ten: string): boolean {
  const m = /\.([a-z0-9]+)$/i.exec(ten);
  return !!m && (DUOI_NHAC as readonly string[]).includes(m[1].toLowerCase());
}

/** MIME đoán theo đuôi — gửi kèm khi xin URL tải lên (PUT ký sẵn có thể ký cả Content-Type). */
export function kieuMime(ten: string): string {
  const d = (/\.([a-z0-9]+)$/i.exec(ten)?.[1] ?? '').toLowerCase();
  const bang: Record<string, string> = {
    mp4: 'video/mp4', m4v: 'video/mp4', mkv: 'video/x-matroska', webm: 'video/webm', mov: 'video/quicktime',
    avi: 'video/x-msvideo', flv: 'video/x-flv', ts: 'video/mp2t', wmv: 'video/x-ms-wmv',
    mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', wav: 'audio/wav', ogg: 'audio/ogg', opus: 'audio/ogg', flac: 'audio/flac',
  };
  return bang[d] ?? 'application/octet-stream';
}

/** 1536 ⇒ "1,5 KB" (dấu phẩy thập phân kiểu Việt). */
export function dinhDangDungLuong(byte: number): string {
  if (!Number.isFinite(byte) || byte < 0) return '—';
  const don = ['B', 'KB', 'MB', 'GB', 'TB'];
  let v = byte;
  let i = 0;
  while (v >= 1024 && i < don.length - 1) { v /= 1024; i += 1; }
  const so = i === 0 ? String(Math.round(v)) : v.toFixed(v >= 100 ? 0 : 1).replace('.', ',');
  return `${so} ${don[i]}`;
}

/** 3725 ⇒ "1:02:05"; 65 ⇒ "1:05". */
export function dinhDangThoiLuong(giay: number): string {
  if (!Number.isFinite(giay) || giay < 0) return '0:00';
  const s = Math.floor(giay);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}
