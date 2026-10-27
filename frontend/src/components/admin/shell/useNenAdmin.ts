'use client';

/**
 * Nền trang admin do admin chọn (27/10/2026): 'nau' (mặc định) · 'xanh' · 'mua'. Đọc GET /api/v1/giao-dien, đệm ở
 * localStorage để lần sau khỏi nháy màu. Trang /admin/giao-dien đổi ⇒ gọi `datNenAdminTam()` để khung đổi ngay.
 */
import { useEffect, useState } from 'react';
import { giaiMua, parseChuDe, type ChuDe, type Mua } from '@/lib/chuDeMua/logic';

export type NenAdmin = 'nau' | 'xanh' | 'mua';
export interface GiaoDienWeb { chuDeMacDinh: ChuDe; epTatCa: boolean; nenAdmin: NenAdmin; capNhat: string | null }

const KHOA = 'admin.giaoDien';
const nghe = new Set<(g: GiaoDienWeb) => void>();

function docDem(): GiaoDienWeb | null {
  try { const r = localStorage.getItem(KHOA); return r ? (JSON.parse(r) as GiaoDienWeb) : null; } catch { return null; }
}
export function datNenAdminTam(g: GiaoDienWeb) {
  try { localStorage.setItem(KHOA, JSON.stringify(g)); } catch { /* riêng tư */ }
  nghe.forEach((f) => f(g));
}

export function useNenAdmin(): { nen: NenAdmin; mua: Mua | null } {
  const [g, setG] = useState<GiaoDienWeb | null>(null);
  useEffect(() => {
    const d = docDem();
    if (d) setG(d);
    nghe.add(setG);
    fetch('/api/v1/giao-dien', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (j?.data) datNenAdminTam(j.data as GiaoDienWeb); })
      .catch(() => {});
    return () => { nghe.delete(setG); };
  }, []);
  const nen: NenAdmin = g?.nenAdmin === 'xanh' || g?.nenAdmin === 'mua' ? g.nenAdmin : 'nau';
  // Theo mùa: mùa admin đặt cho web nếu là một mùa cụ thể; còn lại theo tháng.
  const cd = parseChuDe(g?.chuDeMacDinh);
  const mua = nen === 'mua' ? giaiMua(cd === 'macDinh' ? 'tuDong' : cd) : null;
  return { nen, mua };
}
