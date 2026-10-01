'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { Enrollment } from '@/types';
import { KHOA, type BuocHoc } from '../roadmapData';

/** Tiến độ một khoá của người đang xem (từ /courses/my). */
export interface TienDoKhoa {
  pct: number;
  baiGanNhat?: string;
  truyCap?: string;
  tenKhoa: string;
}

export type TrangThai = 'xong' | 'dang' | 'chua';

/** Một môn đã ghép đủ thông tin để hiện ở bảng tầng / hộp chi tiết. */
export interface MonHoc extends BuocHoc {
  lamDuoc: string[];
  tuan: number;
  /** Tên dự án mà `dongGop` nói tới. */
  duAn: string;
  /** Nhãn nhóm: "Tầng 2 · React + Node fullstack", "AI Engineer · bậc 3"… */
  nhom: string;
  hex: [string, string];
  tuyChon?: boolean;
}

export function ghepMon(
  b: BuocHoc,
  ngu: { duAn: string; nhom: string; hex: [string, string]; tuyChon?: boolean },
): MonHoc {
  const k = KHOA[b.slug];
  return { ...b, lamDuoc: k?.lamDuoc ?? [], tuan: k?.tuan ?? 3, ...ngu };
}

export function trangThai(td?: TienDoKhoa): TrangThai {
  if (!td) return 'chua';
  return td.pct >= 100 ? 'xong' : 'dang';
}

/**
 * Academy và Khoá học dùng CHUNG trang học: /academy/courses/<slug>(/learn) chỉ
 * redirect về /courses/<slug>(/learn) — trỏ thẳng để khỏi một bước chuyển hướng.
 */
export function lienKetHoc(slug: string, td?: TienDoKhoa): { href: string; nhan: string } {
  if (td && td.pct >= 100) return { href: `/courses/${slug}/learn`, nhan: 'Ôn lại' };
  if (td) return { href: `/courses/${slug}/learn`, nhan: 'Học tiếp' };
  return { href: `/courses/${slug}`, nhan: 'Bắt đầu' };
}

export function useTienDo() {
  const daDangNhap = useAuthStore((s) => s.isAuthenticated);
  const [tienDo, setTienDo] = useState<Record<string, TienDoKhoa>>({});
  const [dangTai, setDangTai] = useState(false);
  const [loi, setLoi] = useState(false);

  useEffect(() => {
    if (!daDangNhap) {
      setTienDo({});
      return;
    }
    let huy = false;
    setDangTai(true);
    setLoi(false);
    coursesApi
      .getAllMyCourses()
      .then((r) => {
        if (huy) return;
        const map: Record<string, TienDoKhoa> = {};
        for (const e of (r.data?.data || []) as Enrollment[]) {
          if (!e.courseSlug) continue;
          map[e.courseSlug] = {
            pct: Math.max(0, Math.min(100, Math.round(e.progressPercent || 0))),
            baiGanNhat: e.lastLessonTitle || undefined,
            truyCap: e.lastAccessedAt || e.enrolledAt,
            tenKhoa: e.courseTitle,
          };
        }
        setTienDo(map);
      })
      .catch(() => {
        if (!huy) setLoi(true);
      })
      .finally(() => {
        if (!huy) setDangTai(false);
      });
    return () => {
      huy = true;
    };
  }, [daDangNhap]);

  return { daDangNhap, tienDo, dangTai, loi };
}

/** 3D bật khi màn đủ rộng (≥ 768px) và người dùng không xin giảm chuyển động. */
export function useLa3D() {
  const giamChuyenDong = useReducedMotion();
  const [rong, setRong] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const capNhat = () => setRong(mq.matches);
    capNhat();
    mq.addEventListener('change', capNhat);
    return () => mq.removeEventListener('change', capNhat);
  }, []);
  return { la3D: rong && !giamChuyenDong, giamChuyenDong: !!giamChuyenDong };
}

/** Thống kê một nhóm khoá: số xong, đang học, % trung bình, tuần còn lại. */
export function thongKe(mon: { slug: string; tuan: number }[], tienDo: Record<string, TienDoKhoa>) {
  let xong = 0;
  let dang = 0;
  let tongPct = 0;
  let tuanCon = 0;
  for (const m of mon) {
    const td = tienDo[m.slug];
    const pct = td?.pct ?? 0;
    tongPct += pct;
    if (td && pct >= 100) xong++;
    else if (td) dang++;
    tuanCon += m.tuan * (1 - pct / 100);
  }
  const tong = mon.length;
  return {
    tong,
    xong,
    dang,
    chua: tong - xong - dang,
    pctTB: tong ? Math.round(tongPct / tong) : 0,
    tuanCon: Math.round(tuanCon),
  };
}

/** Bỏ trùng theo slug (một khoá có thể nằm ở nhiều nơi). */
export function boTrung<T extends { slug: string }>(ds: T[]): T[] {
  const thay = new Set<string>();
  return ds.filter((x) => (thay.has(x.slug) ? false : (thay.add(x.slug), true)));
}

export function dinhDangThoiGian(tuan: number): string {
  if (tuan <= 0) return 'Đã xong';
  if (tuan < 8) return `~${String(Math.round(tuan * 2) / 2).replace('.', ',')} tuần`;
  const thang = Math.round((tuan / 4.3) * 2) / 2;
  return `~${String(thang).replace('.', ',')} tháng`;
}
