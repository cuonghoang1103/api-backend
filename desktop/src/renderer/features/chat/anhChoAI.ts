/**
 * ============================================================
 * CHUẨN HOÁ ẢNH TRƯỚC KHI GỬI CHO MODEL — dùng chung AI Code + Trò chuyện
 * ============================================================
 *
 * Cổng chỉ nhận PNG/JPEG/GIF/WebP. Người dùng 16/10/2026 kéo ảnh iPhone
 * (HEIC) vào AI Code thì model không thấy gì — phải nhờ đổi tay sang JPG.
 * Ở đây MỌI ảnh đi qua một cửa:
 *
 *   1. PNG/JPEG/GIF/WebP nhỏ, đứng thẳng ⇒ gửi NGUYÊN BYTE.
 *   2. Quá to (byte hoặc cạnh dài >1568px) hoặc JPEG có thẻ xoay EXIF ⇒ vẽ lại
 *      bằng canvas: co về 1568px và DỰNG ĐỨNG ảnh dọc của điện thoại
 *      (`createImageBitmap` áp thẻ xoay; cổng thì không chắc, nên không để
 *      cho nó đoán). PNG giữ PNG nếu vừa trần — JPEG làm nhoè chữ nhỏ trong
 *      ảnh chụp màn hình.
 *   3. Định dạng khác (AVIF, BMP, ICO — Chromium tự giải mã được) ⇒ như bước 2.
 *   4. Chromium không giải mã được (HEIC, TIFF, PSD) ⇒ nhờ main
 *      (`anh:chuanHoa` → `sips` trên macOS, WIC trên Windows).
 *
 * 1568px là cạnh dài Anthropic co ảnh về trước khi đọc — gửi to hơn chỉ tốn
 * token chứ không nét thêm.
 */
import { DUOI_ANH_LA, docHuongExif, LOAI_CONG_NHAN, nhanDangAnh } from '../../../shared/dinhDangAnh';

export const CANH_DAI = 1568;

const DUOI_CHUAN = /\.(png|jpe?g|gif|webp)$/i;

function duoiCua(ten: string): string {
  const i = ten.lastIndexOf('.');
  return i < 0 ? '' : ten.slice(i).toLowerCase();
}

/**
 * File này có phải ảnh không — theo MIME HOẶC đuôi.
 * ⚠️ `File.type` của `.HEIC` trên Chromium thường RỖNG (đã gặp thật), nên
 * tin MIME thôi là bỏ sót đúng loại ảnh hay gặp nhất từ iPhone.
 * SVG không tính: nó là chữ, agent đọc thẳng được.
 */
export function laAnh(f: File): boolean {
  if (f.size === 0) return false;
  if (f.type.startsWith('image/')) return f.type !== 'image/svg+xml';
  return DUOI_CHUAN.test(f.name) || DUOI_ANH_LA.has(duoiCua(f.name));
}

export function docDataUrl(f: Blob): Promise<string> {
  return new Promise((giai, tuChoi) => {
    const d = new FileReader();
    d.onerror = () => tuChoi(new Error('Không đọc được file.'));
    d.onload = () => giai(String(d.result ?? ''));
    d.readAsDataURL(f);
  });
}

/** Số byte THẬT của ảnh trong một data URL (base64 phình 4/3). */
export function byteCuaDataUrl(url: string): number {
  const than = url.slice(url.indexOf(',') + 1);
  const dem = than.endsWith('==') ? 2 : than.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((than.length * 3) / 4) - dem);
}

/**
 * Vẽ lại ảnh: cạnh dài ≤1568px, đứng thẳng theo EXIF. Ném lỗi nếu Chromium
 * không giải mã được định dạng này (HEIC/TIFF) — chỗ gọi rơi về main.
 *
 * So trần trên ĐỘ DÀI CHUỖI data URL (phình ~4/3), vì máy chủ đo chính chuỗi
 * đó chứ không đo byte gốc.
 */
async function veLai(f: Blob, tranChuoi: number, giuPng: boolean): Promise<string> {
  const bm = await createImageBitmap(f);
  try {
    for (let canh = CANH_DAI, lan = 0; lan < 5; lan += 1, canh = Math.round(canh * 0.75)) {
      const ti = Math.min(1, canh / Math.max(bm.width, bm.height));
      const cv = new OffscreenCanvas(Math.max(1, Math.round(bm.width * ti)), Math.max(1, Math.round(bm.height * ti)));
      const ctx = cv.getContext('2d');
      if (!ctx) throw new Error('Không dựng được canvas để xử lý ảnh.');
      ctx.imageSmoothingQuality = 'high';
      if (giuPng && lan === 0) {
        ctx.drawImage(bm, 0, 0, cv.width, cv.height);
        const png = await docDataUrl(await cv.convertToBlob({ type: 'image/png' }));
        if (png.length <= tranChuoi) return png;
        ctx.clearRect(0, 0, cv.width, cv.height);
      }
      // Nền TRẮNG trước: JPEG không có kênh trong suốt, thiếu bước này thì
      // mọi vùng trong suốt của PNG thành ĐEN và ảnh đọc ra khác hẳn bản gốc.
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(bm, 0, 0, cv.width, cv.height);
      const url = await docDataUrl(await cv.convertToBlob({ type: 'image/jpeg', quality: lan === 0 ? 0.88 : 0.8 }));
      if (url.length <= tranChuoi) return url;
    }
    throw new Error('Ảnh quá lớn, thu nhỏ không đủ.');
  } finally {
    bm.close();
  }
}

export interface AnhDaChuan {
  dataUrl: string;
  /** Byte ảnh SẼ GỬI (không phải cỡ file gốc) — thẻ phải nói đúng thứ đi lên. */
  byte: number;
  /** Định dạng gốc khi đã phải đổi, ví dụ "HEIC". */
  doiTu?: string;
}

/**
 * @param duong Đường dẫn thật của file (kéo/chọn từ đĩa) — main đọc thẳng,
 *              khỏi chuyển cả file qua IPC. `null` với ảnh dán.
 */
export async function chuanHoaChoAI(
  f: File,
  { tranChuoi, duong }: { tranChuoi: number; duong?: string | null },
): Promise<AnhDaChuan> {
  // 256KB đầu đủ cho chữ ký định dạng lẫn khối EXIF (APP1 trần 64KB).
  const dau = new Uint8Array(await f.slice(0, 256 * 1024).arrayBuffer());
  const loai = nhanDangAnh(dau);

  if (loai && LOAI_CONG_NHAN.has(loai)) {
    const huong = loai === 'jpeg' ? docHuongExif(dau) : 1;
    const thang = await docDataUrl(f);
    let to = false;
    try {
      const bm = await createImageBitmap(f);
      to = Math.max(bm.width, bm.height) > CANH_DAI;
      bm.close();
    } catch { /* không đọc được kích thước ⇒ để trần byte quyết định */ }
    if (huong === 1 && !to && thang.length <= tranChuoi) return { dataUrl: thang, byte: f.size };
    try {
      const url = await veLai(f, tranChuoi, loai === 'png');
      return { dataUrl: url, byte: byteCuaDataUrl(url) };
    } catch (e) {
      if (thang.length <= tranChuoi) return { dataUrl: thang, byte: f.size };
      throw e;
    }
  }

  const doiTu = (loai ?? duoiCua(f.name).slice(1)).toUpperCase() || 'ẢNH';
  try {
    const url = await veLai(f, tranChuoi, false);
    return { dataUrl: url, byte: byteCuaDataUrl(url), doiTu };
  } catch { /* Chromium không giải mã được ⇒ nhờ hệ điều hành ở main */ }

  const api = window.cuongthai;
  if (!api?.chuanHoaAnh) throw new Error(`App chưa đọc được ảnh ${doiTu}.`);
  const r = await api.chuanHoaAnh(duong ? { duong } : { bytes: new Uint8Array(await f.arrayBuffer()) });
  if (!r.ok) throw new Error(r.loi);
  if (r.dataUrl.length > tranChuoi) {
    // Main co về 1568px nên hiếm khi tới đây; vẫn co tiếp bằng canvas cho chắc.
    // Giải base64 tay, KHÔNG `fetch(dataUrl)`: CSP của app chặn `data:` ở connect-src.
    const nhiPhan = atob(r.dataUrl.slice(r.dataUrl.indexOf(',') + 1));
    const mang = new Uint8Array(nhiPhan.length);
    for (let i = 0; i < nhiPhan.length; i += 1) mang[i] = nhiPhan.charCodeAt(i);
    const blob = new Blob([mang], { type: r.dataUrl.slice(5, r.dataUrl.indexOf(';')) });
    const url = await veLai(blob, tranChuoi, false);
    return { dataUrl: url, byte: byteCuaDataUrl(url), doiTu };
  }
  return { dataUrl: r.dataUrl, byte: r.byte, doiTu };
}
