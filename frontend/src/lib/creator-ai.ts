'use client';

/**
 * Content Creator — AI (04/10/2026). Cặp với `src/routes/content.ai.routes.ts`.
 *
 * Mọi việc AI chạy NỀN ở máy chủ (Cloudflare cắt yêu cầu > 100 giây): POST tạo
 * việc → hỏi lại mỗi 2,5 giây. `useViecAi` gói vòng hỏi lại đó, kèm số giây,
 * số ký tự AI đã viết và đuôi văn bản đang sinh để giao diện có thứ để xem.
 *
 * Tách khỏi `lib/api.ts` (tệp chung rất lớn) để không giẫm chân phiên khác.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';

export type NgonNguQuay = 'VI' | 'EN';
export type PhongCachQuay = 'truoc_may' | 'man_hinh' | 'ket_hop';
export type LoaiCanh = 'HOOK' | 'INTRO' | 'BODY' | 'DEMO' | 'MISTAKE' | 'RECAP' | 'QUIZ' | 'CTA' | 'OUTRO';
export type KhungHinh = 'CLOSEUP' | 'MEDIUM' | 'WIDE' | 'POV' | 'OVERHEAD' | 'SCREEN';

export interface CanhQuay {
  ten: string;
  loai: LoaiCanh;
  loi: string;
  manHinh: string;
  ma: string;
  gocMay: string;
  khungHinh: KhungHinh;
  broll: string;
  chuTrenManHinh: string;
  giay: number;
  nguon: string;
}

export interface GoiQuay {
  tieuDe: string[];
  chuThumbnail: string[];
  tomTat: string;
  mucTieu: string[];
  chuanBi: string[];
  thietLap: { boCuc: string; anhSang: string; amThanh: string; manHinh: string };
  canh: CanhQuay[];
  cauHoi: Array<{ hoi: string; dapAn: string }>;
  youtube: { moTa: string; the: string[] };
  canBoSung: string[];
  doDay: 'du' | 'mong';
}

/** Bản vá áp thẳng vào form của trình sửa dự án (khớp `ContentProject`). */
export interface BanVa {
  script: string;
  mainHook: string | null;
  concept: string | null;
  ngayQuay: {
    dayNumber: number;
    date: null;
    location: string;
    notes: string | null;
    order: number;
    scenes: Array<{
      sceneNumber: number;
      sceneType: 'OPENING' | 'HOOK' | 'INTRO' | 'BODY' | 'BROLL' | 'CTA' | 'OUTRO';
      dialogue: string | null;
      voiceover: string | null;
      action: string | null;
      cameraAngle: string | null;
      shotType: 'CLOSEUP' | 'MEDIUM' | 'WIDE' | 'POV' | 'OVERHEAD' | null;
      props: string | null;
      brollNotes: string | null;
      editingNotes: string | null;
      durationSeconds: number | null;
      storyboardImageUrl: null;
      order: number;
    }>;
  };
  youtube: { caption: string; hashtags: string[] };
  targetDurationSec: number;
}

/** Nhãn ngày quay do AI dựng — trùng `NHAN_NGAY_AI` ở máy chủ. */
export const NHAN_NGAY_AI = 'Gói quay AI';

export interface KhoaHocMuc {
  slug: string;
  ma: string | null;
  ten: string;
  tenEn: string;
  nguon: 'ACADEMY' | 'COURSES';
  hocKy: string | null;
  daXuatBan: boolean;
  soChuong: number;
  soBai: number;
  soDuAn: number;
}

export interface DuAnGan {
  id: number;
  status: string;
  updatedAt: string;
}

export interface BaiMuc {
  id: number;
  ten: string;
  loai: string;
  soKyTu: number;
  coQuiz: boolean;
  thuTu: number;
  duAn: DuAnGan | null;
}

export interface MucLucKhoa {
  slug: string;
  ma: string | null;
  ten: string;
  tenEn: string;
  nguon: 'ACADEMY' | 'COURSES';
  hocKy: string | null;
  moTa: string | null;
  gioiThieu: DuAnGan | null;
  chuong: Array<{ id: number; soThuTu: number; ten: string; duAn: DuAnGan | null; bai: BaiMuc[] }>;
}

export interface BaiTrongLo {
  lessonId: number;
  ten: string;
  trangThai: 'cho' | 'dang' | 'xong' | 'bo_qua' | 'loi';
  duAnId?: number;
  loi?: string;
}

export interface TrangThaiViec<T = unknown> {
  loai: string;
  trangThai: 'chay' | 'xong' | 'loi' | 'huy';
  giay: number;
  kyTu: number;
  duoi: string;
  lo: BaiTrongLo[] | null;
  ketQua: T | null;
  loi: { thongDiep: string; ma: string; status: number } | null;
}

export interface GocYTuong {
  tieuDe: string;
  goc: string;
  hook: string;
  cauTruc: string[];
  viSao: string;
  doKho: string;
}

export interface KetQuaGoi {
  goi: GoiQuay;
  duAnId?: number;
  taoMoi?: boolean;
  banVa?: BanVa;
  nguon?: { nhan: string; the: string; phut: number };
}

export const creatorAiApi = {
  khoaHoc: () => api.get<{ data: KhoaHocMuc[] }>('/admin/content/ai/khoa-hoc'),
  mucLuc: (slug: string) => api.get<{ data: MucLucKhoa }>(`/admin/content/ai/khoa-hoc/${encodeURIComponent(slug)}`),
  batDau: (body: Record<string, unknown>) => api.post<{ data: { viec: string } }>('/admin/content/ai/viec', body),
  xem: (id: string) => api.get<{ data: TrangThaiViec }>(`/admin/content/ai/viec/${id}`),
  huy: (id: string) => api.delete<{ data: { huy: boolean } }>(`/admin/content/ai/viec/${id}`),
};

/** Lấy câu báo lỗi người đọc được từ lỗi axios. */
export function loiDocDuoc(e: unknown): string {
  const r = (e as { response?: { data?: { message?: string; error?: { message?: string } } } })?.response?.data;
  return r?.message || r?.error?.message || (e instanceof Error ? e.message : 'Có lỗi xảy ra');
}

/**
 * Chạy một việc AI rồi hỏi lại cho tới khi xong.
 * `chay(body)` trả về kết quả cuối (hoặc ném lỗi); trạng thái trung gian nằm ở `tt`.
 */
export function useViecAi<T = unknown>() {
  const [tt, setTt] = useState<TrangThaiViec<T> | null>(null);
  const [dangChay, setDangChay] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const idRef = useRef<string | null>(null);
  const songRef = useRef(true);

  useEffect(() => {
    songRef.current = true;
    return () => { songRef.current = false; };
  }, []);

  const chay = useCallback(async (body: Record<string, unknown>): Promise<T | null> => {
    setLoi(null);
    setTt(null);
    setDangChay(true);
    try {
      const { data } = await creatorAiApi.batDau(body);
      const id = data.data.viec;
      idRef.current = id;
      let loiMang = 0;
      for (;;) {
        await new Promise((r) => setTimeout(r, 2500));
        if (!songRef.current) return null;
        let s: TrangThaiViec<T>;
        try {
          s = (await creatorAiApi.xem(id)).data.data as TrangThaiViec<T>;
          loiMang = 0;
        } catch (e) {
          // Mạng chập một nhịp thì hỏi lại; 404 = việc đã mất (máy chủ khởi động lại).
          const st = (e as { response?: { status?: number } })?.response?.status;
          if (st === 404 || ++loiMang >= 5) throw e;
          continue;
        }
        if (!songRef.current) return null;
        setTt(s);
        if (s.trangThai === 'loi') throw new Error(s.loi?.thongDiep || 'AI chưa làm xong việc này');
        if (s.trangThai !== 'chay') return s.ketQua;
      }
    } catch (e) {
      if (songRef.current) setLoi(loiDocDuoc(e));
      return null;
    } finally {
      idRef.current = null;
      if (songRef.current) setDangChay(false);
    }
  }, []);

  const huy = useCallback(async () => {
    if (idRef.current) await creatorAiApi.huy(idRef.current).catch(() => undefined);
  }, []);

  const datLai = useCallback(() => { setTt(null); setLoi(null); }, []);

  return { chay, huy, tt, dangChay, loi, datLai };
}

export const KHUNG_NHAN: Record<KhungHinh, string> = {
  CLOSEUP: 'Cận cảnh',
  MEDIUM: 'Trung cảnh',
  WIDE: 'Toàn cảnh',
  POV: 'Góc nhìn thứ nhất',
  OVERHEAD: 'Từ trên xuống',
  SCREEN: 'Quay màn hình',
};

export const LOAI_CANH_NHAN: Record<LoaiCanh, string> = {
  HOOK: 'Hook',
  INTRO: 'Giới thiệu',
  BODY: 'Giảng',
  DEMO: 'Demo',
  MISTAKE: 'Lỗi thường gặp',
  RECAP: 'Tóm tắt',
  QUIZ: 'Câu hỏi',
  CTA: 'Kêu gọi',
  OUTRO: 'Kết',
};

export function mocGio(giay: number): string {
  const s = Math.max(0, Math.round(giay));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function chepChu(text: string): Promise<boolean> {
  try {
    return navigator.clipboard.writeText(text).then(() => true, () => false);
  } catch {
    return Promise.resolve(false);
  }
}
