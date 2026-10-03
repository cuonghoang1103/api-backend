/**
 * ============================================================
 * BỐ CỤC CỬA SỔ ROBOT — HAI NHỊP, ROBOT KHÔNG GIẬT MỘT KHUNG HÌNH NÀO
 * ============================================================
 *
 * Main giữ điểm neo của robot và tính cửa sổ quanh nó (`tinhBoCuc` trong
 * `main/robotViTri.ts`). Hook này lo phần còn lại: đặt robot ĐÚNG vào neo bên
 * trong cửa sổ, kể cả trong khoảnh khắc cửa sổ đổi cỡ.
 *
 *   nhịp 1  `boCuc(nd, false)` → main trả `hopTruoc`: robot neo vào GÓC của bố
 *           cục mới, nhưng khoảng cách đo trong cửa sổ CŨ. Đặt nó, đợi vẽ.
 *   nhịp 2  `boCuc(nd, true)`  → main đổi cỡ cửa sổ. Robot neo vào góc KHÔNG
 *           đổi ⇒ đứng yên. Đặt `boCuc.hop` cuối cùng (thường y hệt).
 *
 * ⚠️ Bỏ nhịp 1 là robot nhảy một khung hình mỗi lần bong bóng hiện/tắt: cửa sổ
 * đã phình nhưng CSS còn neo robot theo góc cũ.
 *
 * `tamDung`: đang kéo con robot thì main tự đặt cửa sổ = đúng hộp robot ở mỗi
 * nhịp kéo; chạy bố cục chen vào là hai bên giành nhau cái cửa sổ.
 */
import { useEffect, useRef, useState } from 'react';
import type { RobotKetQuaBoCuc } from '../../shared/ipc';

export interface NoiDungMuon { loai: 'bong' | 'bang' | 'chat'; rong: number; cao: number }

export type BoCucRobot = RobotKetQuaBoCuc['boCuc'];

/**
 * Đợi trình duyệt VẼ xong. Hai `requestAnimationFrame` = khung hình kế tiếp đã
 * lên màn. Cửa sổ ẩn thì rAF bị hãm ⇒ chặn trần 80ms để không treo bố cục.
 */
function doiVe(): Promise<void> {
  return new Promise((xong) => {
    let da = false;
    const het = (): void => { if (!da) { da = true; xong(); } };
    const t = setTimeout(het, 80);
    if (typeof requestAnimationFrame !== 'function') { clearTimeout(t); het(); return; }
    requestAnimationFrame(() => requestAnimationFrame(() => { clearTimeout(t); het(); }));
  });
}

export function useBoCuc(nd: NoiDungMuon | null, lamLai: number, tamDung: boolean): BoCucRobot | null {
  const [bc, datBc] = useState<BoCucRobot | null>(null);
  const luot = useRef(0);
  const khoa = nd ? `${nd.loai}:${Math.round(nd.rong)}:${Math.round(nd.cao)}` : 'gon';

  useEffect(() => {
    const id = ++luot.current;
    if (tamDung) return;
    const api = window.cuongthai?.robot;
    if (!api?.boCuc) return;
    const goi = nd ? { loai: nd.loai, rong: nd.rong, cao: nd.cao } : null;
    void (async () => {
      const t = await api.boCuc(goi, false).catch(() => null);
      if (!t || id !== luot.current) return;
      datBc({ ...t.boCuc, hop: t.hopTruoc });
      await doiVe();
      if (id !== luot.current) return;
      const t2 = await api.boCuc(goi, true).catch(() => null);
      if (!t2 || id !== luot.current) return;
      datBc(t2.boCuc);
    })();
    // `khoa` gói đủ `nd`; thêm `nd` vào là chạy lại mỗi lần render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [khoa, lamLai, tamDung]);

  return bc;
}
