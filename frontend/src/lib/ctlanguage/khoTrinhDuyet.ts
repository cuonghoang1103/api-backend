'use client';

/**
 * CT Language trên web — phần lưu TRÊN TRÌNH DUYỆT (localStorage), như app lưu trên máy (24/11/2026):
 *   · `ctl:htv:v1`      — trạng thái Học từ vựng (đã học / đã biết / khó, mục tiêu hôm nay, bài gần nhất, cài đặt)
 *   · `ctl:podcast:v1`  — tập podcast đã nghe xong + điểm câu hỏi tốt nhất (app: `TienDoPodcast`, UserDefaults)
 * Phần đi theo TÀI KHOẢN (dùng chung với điện thoại) nằm ở `dongBo.ts` (sổ "Học từ vựng" + ôn lặp + chuỗi ngày).
 */
import { useSyncExternalStore } from 'react';
import { docKho, khoRong, type KhoHtv } from './hocTuVung';

function taoKho<T>(khoa: string, doc: (raw: string | null) => T, rong: T) {
  let v: T | null = null;
  const subs = new Set<() => void>();
  const lay = () => {
    if (v === null) { try { v = doc(localStorage.getItem(khoa)); } catch { v = rong; } }
    return v;
  };
  const dat = (f: (cu: T) => T) => {
    v = f(lay());
    try { localStorage.setItem(khoa, JSON.stringify(v)); } catch { /* đầy / riêng tư */ }
    subs.forEach((s) => s());
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => { if (e.key === khoa) { v = null; subs.forEach((s) => s()); } });
  }
  const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
  const useGiaTri = () => useSyncExternalStore(sub, lay, () => rong);
  return { lay, dat, useGiaTri };
}

const RONG_HTV = khoRong();
export const khoHtv = taoKho<KhoHtv>('ctl:htv:v1', docKho, RONG_HTV);

export interface TienDoPodcast { xong: string[]; diem: Record<string, number> }
const RONG_PC: TienDoPodcast = { xong: [], diem: {} };
export const khoPodcast = taoKho<TienDoPodcast>('ctl:podcast:v1', (raw) => {
  try {
    const v = JSON.parse(raw ?? '') as Partial<TienDoPodcast>;
    return { xong: Array.isArray(v.xong) ? v.xong.filter((x) => typeof x === 'string') : [], diem: v.diem && typeof v.diem === 'object' ? v.diem : {} };
  } catch { return RONG_PC; }
}, RONG_PC);

export function ghiXongPodcast(id: string, diem: number) {
  khoPodcast.dat((cu) => ({
    xong: cu.xong.includes(id) ? cu.xong : [...cu.xong, id],
    diem: { ...cu.diem, [id]: Math.max(cu.diem[id] ?? 0, diem) },
  }));
}
