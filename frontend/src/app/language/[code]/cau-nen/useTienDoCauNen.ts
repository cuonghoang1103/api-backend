'use client';

/**
 * Tiến độ "1000 câu nền": thẻ ôn lặp từng câu, bước đã xong của từng ngày, điểm kiểm tra, chuỗi ngày.
 *
 * Hai lớp lưu, như các khoá sách khác (useTienDo.ts):
 *  - localStorage `en-cau-nen:v1` — mở ra là có, chạy cả khi chưa đăng nhập;
 *  - `/api/v1/ielts/tien-do`, stage `caunen1` (bảng ielts_progress sẵn có, KHÔNG migration):
 *      bai      cnN            ngày N đã qua (kiểm tra cuối ngày ≥ 80%)
 *      bai      cnN-<bước>     bước đã làm (khung · nghe · viet · hieu · on · kiem)
 *      baitap   cnN-kiem       điểm % kiểm tra cuối ngày
 *      kehoach  the-N          ghiChu = thẻ ôn lặp của 34 câu ngày N, nén (onLap.nenThe, ~850 ký tự)
 *    Ghi `bai`/`baitap` tự tính "hôm nay có học" ⇒ chuỗi ngày ở `/ielts/chuoi?stage=caunen1`.
 * Lúc tải: gộp hai nguồn — bước/ngày = hợp; thẻ = lấy bản có nhiều lượt hơn (gopThe).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import api from '@/lib/api';
import { ghiLuot, gopThe, homNay, moThe, nenThe, daThuoc, denHan, type The } from './onLap';

export const STAGE = 'caunen1';
const KEY = 'en-cau-nen:v1';

export type Buoc = 'khung' | 'nghe' | 'viet' | 'hieu' | 'on' | 'kiem';
type NgayTD = { xong?: boolean; kiem?: number; buoc?: Buoc[] };
type State = { the: Record<string, The>; ngay: Record<number, NgayTD>; ngayHoc: string[] };
const EMPTY: State = { the: {}, ngay: {}, ngayHoc: [] };

function docMay(): State {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (v && typeof v === 'object') return { ...EMPTY, ...v };
  } catch { /* hỏng / riêng tư */ }
  return EMPTY;
}
function ghiMay(s: State) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* đầy / riêng tư */ }
}

/** `cn12-07` ⇒ [12, '07']. */
export function tachId(id: string): [number, string] {
  const m = /^cn(\d+)-(\d+)$/.exec(id);
  return m ? [Number(m[1]), m[2]] : [0, ''];
}

type Row = { kind: string; muc: string; xong: boolean; diem: number | null; ghiChu?: string | null };

function chuoiMay(ds: string[], hom: string): number {
  const co = new Set(ds);
  const lui = (d: string) => { const [y, m, n] = d.split('-').map(Number); const t = new Date(y, m - 1, n - 1); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`; };
  let d = co.has(hom) ? hom : lui(hom);
  let c = 0;
  while (co.has(d)) { c++; d = lui(d); }
  return c;
}

export function useTienDoCauNen(loggedIn: boolean) {
  const [st, setSt] = useState<State>(EMPTY);
  const [chuoiSv, setChuoiSv] = useState<number | null>(null);
  const ban = useRef<Set<number>>(new Set());
  const hen = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stRef = useRef(st);
  stRef.current = st;
  const daGhiNgay = useRef('');

  useEffect(() => { setSt(docMay()); }, []);

  useEffect(() => {
    if (!loggedIn) return;
    let song = true;
    api.get('/ielts/tien-do', { params: { stage: STAGE } }).then((res) => {
      if (!song) return;
      const rows: Row[] = res.data?.data?.items ?? [];
      setSt((cu) => {
        const the = { ...cu.the };
        const ngay: Record<number, NgayTD> = JSON.parse(JSON.stringify(cu.ngay));
        for (const r of rows) {
          let m: RegExpExecArray | null;
          if (r.kind === 'kehoach' && (m = /^the-(\d+)$/.exec(r.muc)) && r.ghiChu) {
            const n = Number(m[1]);
            for (const [so, t] of Object.entries(moThe(r.ghiChu))) {
              const id = `cn${n}-${so}`;
              const g = gopThe(the[id], t);
              if (g) the[id] = g;
            }
          } else if (r.kind === 'bai' && r.xong && (m = /^cn(\d+)(?:-(\w+))?$/.exec(r.muc))) {
            const n = Number(m[1]);
            const x = (ngay[n] ??= {});
            if (!m[2]) x.xong = true;
            else if (!(x.buoc ?? []).includes(m[2] as Buoc)) x.buoc = [...(x.buoc ?? []), m[2] as Buoc];
          } else if (r.kind === 'baitap' && r.diem != null && (m = /^cn(\d+)-kiem$/.exec(r.muc))) {
            const n = Number(m[1]);
            const x = (ngay[n] ??= {});
            x.kiem = Math.max(x.kiem ?? 0, r.diem);
          }
        }
        const moi = { ...cu, the, ngay };
        ghiMay(moi);
        return moi;
      });
    }).catch(() => { /* mất mạng: dùng bản máy */ });
    api.get('/ielts/chuoi', { params: { stage: STAGE } })
      .then((r) => { if (song) setChuoiSv(Number(r.data?.data?.chuoi ?? 0)); })
      .catch(() => {});
    return () => { song = false; };
  }, [loggedIn]);

  /** Đẩy thẻ của các ngày vừa đổi lên máy chủ (gom 1,5 giây). */
  const day = useCallback(() => {
    if (!loggedIn || !ban.current.size) return;
    const s = stRef.current;
    const items = [...ban.current].map((n) => {
      const cua: Record<string, The> = {};
      for (const [id, t] of Object.entries(s.the)) { const [nn, so] = tachId(id); if (nn === n) cua[so] = t; }
      return { stage: STAGE, kind: 'kehoach', muc: `the-${n}`, ghiChu: nenThe(cua) };
    });
    ban.current.clear();
    api.post('/ielts/tien-do', { items }).catch(() => { /* lần sau đẩy lại cả ngày */ });
  }, [loggedIn]);
  useEffect(() => {
    const f = () => { if (hen.current) clearTimeout(hen.current); day(); };
    window.addEventListener('pagehide', f);
    return () => { window.removeEventListener('pagehide', f); f(); };
  }, [day]);

  const ghiHomNay = useCallback((s: State): State => {
    const hom = homNay();
    if (s.ngayHoc.includes(hom)) return s;
    if (loggedIn && daGhiNgay.current !== hom) {
      daGhiNgay.current = hom;
      api.post('/ielts/chuoi/ghi', { stage: STAGE }).then(() => setChuoiSv((c) => (c == null ? c : c))).catch(() => {});
    }
    return { ...s, ngayHoc: [...s.ngayHoc.slice(-400), hom] };
  }, [loggedIn]);

  /** Một lượt dịch đúng/sai của câu `id`. */
  const traLoi = useCallback((id: string, dung: boolean) => {
    const hom = homNay();
    setSt((cu) => {
      const moi = ghiHomNay({ ...cu, the: { ...cu.the, [id]: ghiLuot(cu.the[id], dung, hom) } });
      ghiMay(moi);
      return moi;
    });
    const [n] = tachId(id);
    if (n) ban.current.add(n);
    if (hen.current) clearTimeout(hen.current);
    hen.current = setTimeout(day, 1500);
  }, [day, ghiHomNay]);

  const xongBuoc = useCallback((n: number, b: Buoc) => {
    setSt((cu) => {
      const x = cu.ngay[n] ?? {};
      if ((x.buoc ?? []).includes(b)) return cu;
      const moi = ghiHomNay({ ...cu, ngay: { ...cu.ngay, [n]: { ...x, buoc: [...(x.buoc ?? []), b] } } });
      ghiMay(moi);
      return moi;
    });
    if (loggedIn) api.post('/ielts/tien-do', { items: [{ stage: STAGE, kind: 'bai', muc: `cn${n}-${b}`, xong: true }] }).catch(() => {});
  }, [loggedIn, ghiHomNay]);

  /** Kết quả kiểm tra cuối ngày; ≥ 80% ⇒ ngày đã qua. */
  const ghiKiem = useCallback((n: number, pct: number) => {
    const qua = pct >= 80;
    setSt((cu) => {
      const x = cu.ngay[n] ?? {};
      const buoc = (x.buoc ?? []).includes('kiem') ? x.buoc : [...(x.buoc ?? []), 'kiem' as Buoc];
      const moi = ghiHomNay({ ...cu, ngay: { ...cu.ngay, [n]: { ...x, buoc, kiem: Math.max(x.kiem ?? 0, pct), xong: x.xong || qua } } });
      ghiMay(moi);
      return moi;
    });
    if (loggedIn) {
      api.post('/ielts/tien-do', {
        items: [
          { stage: STAGE, kind: 'baitap', muc: `cn${n}-kiem`, diem: pct },
          { stage: STAGE, kind: 'bai', muc: `cn${n}-kiem`, xong: true },
          ...(qua ? [{ stage: STAGE, kind: 'bai', muc: `cn${n}`, xong: true }] : []),
        ],
      }).catch(() => {});
    }
  }, [loggedIn, ghiHomNay]);

  const thongKe = useMemo(() => {
    const hom = homNay();
    const ds = Object.entries(st.the);
    const thuoc = ds.filter(([, t]) => daThuoc(t)).length;
    const gap = ds.length;
    const canOn = ds.filter(([, t]) => denHan(t, hom)).map(([id]) => id);
    const buoc = Object.values(st.ngay).reduce((a, x) => a + (x.buoc?.length ?? 0), 0);
    const xong = Object.values(st.ngay).filter((x) => x.xong).length;
    const xp = ds.reduce((a, [, t]) => a + Math.min(t.d, 6) * 10, 0) + buoc * 20 + xong * 100;
    const chuoi = Math.max(chuoiSv ?? 0, chuoiMay(st.ngayHoc, hom));
    return { thuoc, gap, canOn, xp, chuoi, xong, hocHomNay: st.ngayHoc.includes(hom) };
  }, [st, chuoiSv]);

  return { ...st, thongKe, traLoi, xongBuoc, ghiKiem };
}
