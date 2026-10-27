'use client';

/**
 * Kho phía trình duyệt của chủ đề mùa: đọc/ghi localStorage (bọc try/catch — chế độ riêng tư vẫn chạy trong phiên),
 * gắn `data-mua` / `data-mua-yen` lên <html>, báo cho mọi component đang nghe. Tab khác đổi ⇒ tab này theo.
 * Luật thuần ở ./logic (có test).
 */

import { useCallback, useSyncExternalStore } from 'react';
import {
  ATTR_MUA, ATTR_YEN, KHOA_CHU_DE, KHOA_CHU_DE_WEB, KHOA_HIEU_UNG,
  chonChuDe, maHoaChuDeWeb, parseChuDe, trangThaiDom, type ChuDe,
} from './logic';

// Giá trị dự phòng khi localStorage bị chặn — vẫn đổi được trong phiên.
let chuDeTam: ChuDe | null = null;
let webTam: string | null = null;
let dongTam: boolean | null = null;
const nghe = new Set<() => void>();

function doc(k: string): string | null {
  try { return localStorage.getItem(k); } catch { return null; }
}
function ghi(k: string, v: string) {
  try { localStorage.setItem(k, v); } catch { /* chế độ riêng tư */ }
}

export function docChuDe(): ChuDe {
  if (typeof window === 'undefined') return 'macDinh';
  return chonChuDe(chuDeTam ?? doc(KHOA_CHU_DE), webTam ?? doc(KHOA_CHU_DE_WEB));
}
/** Admin đang ÉP chủ đề cho mọi người (trang Cài đặt hiện chú thích, khoá lựa chọn). */
export function docEpBoiAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return (webTam ?? doc(KHOA_CHU_DE_WEB) ?? '').endsWith('!');
}

/** Nạp chủ đề admin đặt cho cả web — MỘT lần mỗi lần tải trang, sau khi trang đã vẽ (không chặn gì). Có thay đổi ⇒
 *  ghi đệm (lần tải sau script chống nháy áp ngay từ khung đầu) + áp luôn bây giờ. */
let daNapWeb = false;
export function napChuDeWeb() {
  if (daNapWeb || typeof window === 'undefined') return;
  daNapWeb = true;
  const chay = () => {
    fetch('/api/v1/giao-dien', { credentials: 'omit' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        const d = j?.data;
        if (!d) return;
        const ma = maHoaChuDeWeb(parseChuDe(d.chuDeMacDinh), d.epTatCa === true);
        if (ma === (webTam ?? doc(KHOA_CHU_DE_WEB))) return;
        webTam = ma;
        ghi(KHOA_CHU_DE_WEB, ma);
        apChuDeLenDom();
        bao();
      })
      .catch(() => { /* mạng hỏng ⇒ giữ đệm cũ */ });
  };
  const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
  if (ric) ric(chay, { timeout: 4000 }); else setTimeout(chay, 1500);
}
export function docHieuUngDong(): boolean {
  if (typeof window === 'undefined') return true;
  return dongTam ?? doc(KHOA_HIEU_UNG) !== '0';
}

/** Gắn đúng thuộc tính lên <html> cho đường dẫn hiện tại. Mặc định ⇒ gỡ sạch (không để lại gì). */
export function apChuDeLenDom(pathname: string = typeof location !== 'undefined' ? location.pathname : '/') {
  if (typeof document === 'undefined') return;
  const h = document.documentElement;
  const { mua, yen } = trangThaiDom(docChuDe(), pathname);
  if (mua) {
    if (h.getAttribute(ATTR_MUA) !== mua) h.setAttribute(ATTR_MUA, mua);
  } else if (h.hasAttribute(ATTR_MUA)) h.removeAttribute(ATTR_MUA);
  if (mua && yen) {
    if (!h.hasAttribute(ATTR_YEN)) h.setAttribute(ATTR_YEN, '');
  } else if (h.hasAttribute(ATTR_YEN)) h.removeAttribute(ATTR_YEN);
}

function bao() { nghe.forEach((f) => f()); }

let daNgheStorage = false;
function dangKy(f: () => void) {
  nghe.add(f);
  if (!daNgheStorage && typeof window !== 'undefined') {
    daNgheStorage = true;
    window.addEventListener('storage', (e) => {
      if (e.key === KHOA_CHU_DE || e.key === KHOA_HIEU_UNG || e.key === KHOA_CHU_DE_WEB) { webTam = null; apChuDeLenDom(); bao(); }
    });
  }
  return () => { nghe.delete(f); };
}

export function datChuDe(c: ChuDe) {
  chuDeTam = c;
  ghi(KHOA_CHU_DE, c);
  apChuDeLenDom();
  bao();
}
export function datHieuUngDong(v: boolean) {
  dongTam = v;
  ghi(KHOA_HIEU_UNG, v ? '1' : '0');
  bao();
}

export function useChuDeMua() {
  const chuDe = useSyncExternalStore(dangKy, docChuDe, () => 'macDinh' as ChuDe);
  const hieuUngDong = useSyncExternalStore(dangKy, docHieuUngDong, () => true);
  const epBoiAdmin = useSyncExternalStore(dangKy, docEpBoiAdmin, () => false);
  const setChuDe = useCallback((c: ChuDe) => datChuDe(c), []);
  const setHieuUngDong = useCallback((v: boolean) => datHieuUngDong(v), []);
  return { chuDe, setChuDe, hieuUngDong, setHieuUngDong, epBoiAdmin };
}

/** Theo dõi thuộc tính trên <html> (mùa đang vẽ, màn yên, class giảm chuyển động / sáng-tối). */
function ngheHtml(f: () => void) {
  const o = new MutationObserver(f);
  o.observe(document.documentElement, { attributes: true, attributeFilter: [ATTR_MUA, ATTR_YEN, 'class'] });
  return () => o.disconnect();
}
const layMua = () => document.documentElement.getAttribute(ATTR_MUA);
const layYen = () => document.documentElement.hasAttribute(ATTR_YEN);
const layToi = () => document.documentElement.classList.contains('theme-dark');
const layGiam = () => document.documentElement.classList.contains('reduce-motion');

export function useDomChuDe() {
  const mua = useSyncExternalStore(ngheHtml, layMua, () => null);
  const yen = useSyncExternalStore(ngheHtml, layYen, () => false);
  const toi = useSyncExternalStore(ngheHtml, layToi, () => true);
  const giamClass = useSyncExternalStore(ngheHtml, layGiam, () => false);
  return { mua, yen, toi, giamClass };
}
