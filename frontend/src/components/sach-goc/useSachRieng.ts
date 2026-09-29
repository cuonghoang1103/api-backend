'use client';

/**
 * 📷 Sách gốc — dữ liệu dùng chung: quyền xem, mục lục trang, hướng dẫn từng trang.
 *
 * Ảnh và hướng dẫn chỉ đi qua backend `/api/v1/sach-rieng/*` (đăng nhập + đúng
 * tài khoản được phép) — không có tệp nào trong `public/` hay bundle. Người
 * không được phép: `/quyen` trả `coQuyen: false` và mục này không hiện.
 */
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useLangUser } from '@/components/language/primitives';

export type LoaiMuc =
  | 'mo-bai' | 'hanashite' | 'hoi-thoai' | 'yattemiyou' | 'ittemiyou' | 'kiitemiyou' | 'yondemiyou'
  | 'kaitemiyou' | 'dekiru' | 'kotoba' | 'point' | 'hyo' | 'khac';

export type MucTrang = { loai: LoaiMuc; ten?: string; topic?: number };

export type MucLuc = {
  soTrang: number;
  bai: { n: number; tu: number; den: number; point: [number, number] }[];
  phan: { ten: string; tu: number; den: number }[];
  trang: { p: number; bai: number | null; muc: MucTrang[]; tinCay: number | null; coHuongDan: boolean; point?: number[] }[];
};

export type HuongDan = {
  trang: number;
  bai: number | null;
  muc: MucTrang[];
  tinCay?: number;
  tomTat?: string;
  mucTieu?: string;
  tuMoi?: { w: string; ro?: string; vi: string }[];
  nguPhap?: { point?: number; mau: string; y?: string }[];
  cau?: { ja: string; ro?: string; vi: string }[];
  tranh?: { so?: string; moTa: string }[];
  cachLam?: string[];
  cauHoiCo?: { ja: string; ro?: string; vi?: string; traLoi?: string; traLoiRo?: string; traLoiVi?: string }[];
  luuY?: string[];
};

/** Nhãn + màu từng loại mục (khớp chữ in trên sách). */
export const TEN_MUC: Record<LoaiMuc, { ja: string; vi: string; mau: string }> = {
  'mo-bai': { ja: '課・トピック', vi: 'Mở đầu bài / chủ đề', mau: '#64748b' },
  hanashite: { ja: '話してみよう', vi: 'Khởi động nói', mau: '#a855f7' },
  'hoi-thoai': { ja: 'チャレンジ！', vi: 'Tình huống · hội thoại', mau: '#e11d48' },
  yattemiyou: { ja: 'やってみよう', vi: 'Thử làm', mau: '#f97316' },
  ittemiyou: { ja: '言ってみよう', vi: 'Thử nói', mau: '#ec4899' },
  kiitemiyou: { ja: '聞いてみよう', vi: 'Thử nghe', mau: '#0ea5e9' },
  yondemiyou: { ja: '読んでみよう', vi: 'Thử đọc', mau: '#16a34a' },
  kaitemiyou: { ja: '書いてみよう', vi: 'Thử viết', mau: '#8b5cf6' },
  dekiru: { ja: 'できる！', vi: 'Tự đánh giá', mau: '#0d9488' },
  kotoba: { ja: 'ことば', vi: 'Từ vựng', mau: '#10b981' },
  point: { ja: 'ポイント', vi: 'Ngữ pháp', mau: '#f59e0b' },
  hyo: { ja: '表', vi: 'Bảng', mau: '#b45309' },
  khac: { ja: 'その他', vi: 'Khác', mau: '#94a3b8' },
};

export const urlAnh = (p: number, nho = false) => `/api/v1/sach-rieng/dekiru/trang/${p}${nho ? '?nho=1' : ''}`;

let quyenDem: Promise<boolean> | null = null;

/** true = tài khoản này xem được Sách gốc. null = đang hỏi. */
export function useQuyenSachRieng(): boolean | null {
  const { isAuthenticated } = useLangUser();
  const [co, setCo] = useState<boolean | null>(null);
  useEffect(() => {
    if (!isAuthenticated) { setCo(false); return; }
    let live = true;
    quyenDem ??= api.get('/sach-rieng/quyen')
      .then((r) => !!r.data?.data?.coQuyen)
      .catch(() => { quyenDem = null; return false; });
    quyenDem.then((v) => { if (live) setCo(v); });
    return () => { live = false; };
  }, [isAuthenticated]);
  return co;
}

let mucLucDem: Promise<MucLuc> | null = null;
export function layMucLuc(): Promise<MucLuc> {
  mucLucDem ??= api.get('/sach-rieng/dekiru/muc-luc').then((r) => r.data.data as MucLuc).catch((e) => { mucLucDem = null; throw e; });
  return mucLucDem;
}

const hdDem = new Map<number, Promise<HuongDan | null>>();
export function layHuongDan(p: number): Promise<HuongDan | null> {
  let x = hdDem.get(p);
  if (!x) {
    x = api.get(`/sach-rieng/dekiru/huong-dan/${p}`).then((r) => (r.data.data as HuongDan) ?? null).catch((e) => { hdDem.delete(p); throw e; });
    hdDem.set(p, x);
  }
  return x;
}

/** Loại bài của khoá → mục tương ứng trong sách (để nút trong bài mở đúng chỗ). */
export const MUC_CUA_KIND: Record<string, LoaiMuc | undefined> = {
  conversation: 'hoi-thoai', vocab: 'kotoba', grammar: 'point', kanji: 'kotoba',
  listening: 'kiitemiyou', speaking: 'ittemiyou', reading: 'yondemiyou', writing: 'kaitemiyou',
  homework: 'yattemiyou', review: 'mo-bai',
};

/** Trang đầu tiên của bài n có mục `loai` (ngữ pháp: trang ポイント cuối sách có ポイント của bài). */
export function timTrang(ml: MucLuc, n: number, loai?: LoaiMuc): number {
  const b = ml.bai.find((x) => x.n === n);
  if (!b) return 1;
  if (!loai || loai === 'mo-bai') return b.tu;
  if (loai === 'point') {
    const t = ml.trang.find((t) => t.p >= 270 && t.p <= 281 && t.point?.some((k) => k >= b.point[0] && k <= b.point[1]));
    if (t) return t.p;
  }
  const t = ml.trang.find((t) => t.p >= b.tu && t.p <= b.den && t.muc.some((m) => m.loai === loai));
  return t?.p ?? b.tu;
}

/** Nhãn ngắn của một mục: mục `khac` thì dùng đúng tên in trên sách (vd. 教室の外へ). */
export function nhanMuc(m: MucTrang): string {
  if (m.loai === 'khac' && m.ten) return m.ten.replace(/\{([^|}]+)\|[^}]+\}/g, '$1').slice(0, 14);
  return TEN_MUC[m.loai]?.ja ?? m.loai;
}
