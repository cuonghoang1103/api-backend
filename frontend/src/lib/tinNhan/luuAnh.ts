/**
 * Lưu một ảnh trong tin nhắn về máy — KHÔNG mở trình duyệt / tab mới.
 *
 * ⚠️ `<a href download>` KHÔNG dùng được cho ảnh khác gốc: trình duyệt lờ
 * thuộc tính `download` với URL khác gốc và ĐIỀU HƯỚNG tới ảnh. Ở web đó là
 * một tab mới; ở app desktop là `will-navigate` ⇒ `shell.openExternal` ⇒ ảnh
 * bật ra trình duyệt hệ thống — đúng lỗi người dùng báo (14/10/2026).
 *
 * Nên: tải ảnh về thành blob rồi
 *   · app desktop: giao cho main qua `window.cuongthai.app.luuFile` (hộp thoại lưu thật)
 *   · web: `<a download>` trỏ vào blob CÙNG GỐC ⇒ tải xuống thật
 * Tải blob hỏng (CDN không mở CORS) thì web lùi về mở tab mới — còn hơn không
 * lưu được gì; app desktop thì báo lỗi, KHÔNG đẩy ra trình duyệt.
 */
import { tenAnhTuUrl } from './anh';

interface CauDesktop {
  app?: { luuFile?: (ten: string, dulieu: Uint8Array) => Promise<{ ok: boolean; huy?: boolean; loi?: string }> };
}

export async function luuAnhVeMay(url: string): Promise<void> {
  const ten = tenAnhTuUrl(url);
  const desktop = (globalThis as { cuongthai?: CauDesktop }).cuongthai;
  let blob: Blob | null = null;
  try {
    const r = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (r.ok) blob = await r.blob();
  } catch { /* lùi bên dưới */ }

  if (desktop?.app?.luuFile) {
    if (!blob) throw new Error('Không tải được ảnh để lưu.');
    const kq = await desktop.app.luuFile(ten, new Uint8Array(await blob.arrayBuffer()));
    if (!kq.ok && !kq.huy) throw new Error(kq.loi || 'Lưu ảnh thất bại.');
    return;
  }

  if (!blob) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = ten;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 10_000);
}
