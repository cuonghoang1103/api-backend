/**
 * Phần dùng chung của Phòng thi bản desktop (04/10/2026): kiểu dữ liệu, phân
 * loại đề, định dạng giờ, ngôn ngữ, bài làm lưu trên máy.
 *
 * ─── Hai ngôn ngữ, hai công tắc ───
 *  • KHUNG giao diện (nút, nhãn) theo ngôn ngữ của app (`useDich().nn`) — dùng
 *    `useNoi()` bên dưới thay cho `dich()`: phòng thi có hàng trăm câu chữ ngắn,
 *    đặt từng câu vào `tuDien.ts` là phình từ điển chung vì một màn hình.
 *  • NỘI DUNG đề (câu hỏi, đáp án, giải thích) theo công tắc EN/VI riêng của
 *    phòng thi — giống web: đề trên trường thi bằng tiếng Anh nên mặc định EN.
 *    Khác web: app NHỚ lựa chọn (web mỗi lần vào lại về EN).
 */
import { useCallback, useEffect, useState } from 'react';
import type { ExamPortalItem } from '@/lib/api';
import { useDich } from '../../i18n';

/* ── Kiểu dữ liệu (trùng payload của máy chủ, giống bản web) ─────────────── */

export interface Ky { name: string; ordinal: number; code: string }
export interface Mon { title: string; slug: string; courseCode: string | null }

export interface LuotCuaToi {
  id: number; examId: number; status: string; submittedAt: string | null; timeSpentSeconds: number;
  score: number | null; maxScore: number | null; passed: boolean | null; gradingMode: string; bookmarked: boolean;
  exam: {
    id: number; title: string; kind: string; peType: string | null; code: string | null; courseId: number;
    passMark: number; totalPoints: number; course: Mon | null; semester: Ky | null;
  };
}

export interface DeDaLuu {
  id: number; examId: number; createdAt: string;
  exam: {
    id: number; kind: string; peType: string | null; title: string; code: string | null;
    durationMinutes: number; totalPoints: number; passMark: number; questionCount: number; courseId: number;
  };
  course: Mon | null; semester: Ky | null;
}

export interface CauDaLuu {
  id: number; note: string | null; createdAt: string; questionId: number; examId: number;
  question: {
    id: number; kind: string; points: number; prompt: string; imageUrl: string | null;
    options: { text: string }[] | null; correctIndexes: number[]; explanation: string | null;
    language: string | null; sampleSolution: string | null; expectedOutput: string | null;
  };
  exam: { id: number; kind: string; peType: string | null; title: string; code: string | null; courseId: number };
  course: Mon | null; semester: Ky | null;
}

export type De = ExamPortalItem;

/* ── Phân loại đề — y hệt `examCategory` của web ─────────────────────────
   Đọc (READ-…) và Kiểm tra tiến độ (PT1/PT2…) KHÔNG phải `kind` riêng ở máy
   chủ: chúng là đề FE chấm như trắc nghiệm, chỉ khác mã. Nói (SPEAK) là PE. */
export type Loai = 'PT' | 'FE' | 'PE' | 'READING' | 'SPEAKING';
export const THU_TU_LOAI: Loai[] = ['PT', 'FE', 'PE', 'READING', 'SPEAKING'];

export function loaiDe(e: { kind: string; peType?: string | null; code?: string | null }): Loai {
  if (e.peType === 'SPEAK') return 'SPEAKING';
  const code = (e.code || '').toUpperCase();
  if (e.kind === 'FE' && code.startsWith('READ-')) return 'READING';
  if (e.kind === 'FE' && /^PT\d/.test(code)) return 'PT';
  return e.kind === 'FE' ? 'FE' : 'PE';
}

export function tenLoai(l: Loai, en: boolean, ngan = false): string {
  switch (l) {
    case 'PT': return ngan ? 'PT' : en ? 'Progress Test' : 'Kiểm tra tiến độ';
    case 'FE': return ngan ? 'FE' : en ? 'Multiple choice' : 'Trắc nghiệm';
    case 'PE': return ngan ? 'PE' : en ? 'Practical' : 'Thực hành';
    case 'READING': return en ? 'Reading' : 'Đọc';
    case 'SPEAKING': return en ? 'Speaking' : 'Nói';
  }
}

/** Nhãn trên thẻ đề: "FE", "PE·CODE", "Đọc"… */
export function nhanDe(e: { kind: string; peType?: string | null; code?: string | null }, en: boolean): string {
  const l = loaiDe(e);
  if (l === 'PE') return `PE·${e.peType ?? ''}`;
  if (l === 'FE') return 'FE';
  return tenLoai(l, en);
}

/* ── Giờ ───────────────────────────────────────────────────────────────── */

/** `mm:ss` hoặc `h:mm:ss`; âm thì về 0 — không in số âm cho người đang thi. */
export function dongHo(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const g = s % 60;
  const p = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${p(m)}:${p(g)}` : `${p(m)}:${p(g)}`;
}

export function phutGiay(giay: number): string {
  const m = Math.floor(giay / 60);
  return `${m}:${String(giay % 60).padStart(2, '0')}`;
}

export function ngay(s: string | null, en: boolean): string {
  if (!s) return '—';
  return new Date(s).toLocaleDateString(en ? 'en-GB' : 'vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Lỗi axios → câu đọc được. */
export function loiDoc(e: unknown, macDinh: string): string {
  const m = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return m || (e instanceof Error && e.message ? e.message : macDinh);
}

/* ── Ngôn ngữ ──────────────────────────────────────────────────────────── */

/** `t(vi, en)` theo ngôn ngữ app; `en` = app đang ở tiếng Anh. */
export function useNoi(): { t: (vi: string, en: string) => string; en: boolean } {
  const { nn } = useDich();
  const en = nn === 'en';
  const t = useCallback((vi: string, enText: string) => (en ? enText : vi), [en]);
  return { t, en };
}

const KHOA_NN_DE = 'ct-phongthi:nn-de';

/** Ngôn ngữ NỘI DUNG đề, nhớ giữa các lần mở. Mặc định EN như đề thật. */
export function useNgonNguDe(): ['en' | 'vi', (l: 'en' | 'vi') => void] {
  const [L, datL] = useState<'en' | 'vi'>(() => {
    try { return window.localStorage.getItem(KHOA_NN_DE) === 'vi' ? 'vi' : 'en'; } catch { return 'en'; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(KHOA_NN_DE, L); } catch { /* chế độ riêng tư — thôi */ }
  }, [L]);
  return [L, datL];
}

/* ── Bài làm lưu trên máy ──────────────────────────────────────────────────
 * Khoá theo LƯỢT THI, không theo đề: hai lượt của cùng đề là hai bài khác nhau.
 * Web không có lớp này (đóng tab là mất bài đang làm); app giữ lại từ bản native
 * cũ vì đó là thứ đã cứu bài làm khi app bị tắt giữa chừng. */
export interface BaiLam {
  chon: Record<number, number[]>;  // MCQ
  ma: Record<number, string>;      // câu CODE nằm trong đề FE (Progress Test)
  luan: Record<number, string>;    // WRITE
  co: number[];                    // câu đánh dấu
  cau: number;                     // câu đang mở
}

export const BAI_RONG: BaiLam = { chon: {}, ma: {}, luan: {}, co: [], cau: 0 };

const khoaBai = (attemptId: number) => `ct-bai-thi:${attemptId}`;

export function docBai(attemptId: number): BaiLam {
  try {
    const raw = window.localStorage.getItem(khoaBai(attemptId));
    if (!raw) return BAI_RONG;
    const d = JSON.parse(raw) as Partial<BaiLam> & { vietMa?: Record<number, string> };
    return {
      chon: d.chon ?? {},
      ma: d.ma ?? d.vietMa ?? {},   // `vietMa` là tên ở bản native trước 04/10
      luan: d.luan ?? {},
      co: Array.isArray(d.co) ? d.co : [],
      cau: typeof d.cau === 'number' ? d.cau : 0,
    };
  } catch {
    return BAI_RONG; // dữ liệu hỏng thì bắt đầu lại, đừng làm nổ cả màn thi
  }
}

export function ghiBai(attemptId: number, bai: BaiLam): void {
  try { window.localStorage.setItem(khoaBai(attemptId), JSON.stringify(bai)); } catch { /* đầy đĩa thì thôi */ }
}

export function xoaBai(attemptId: number): void {
  try { window.localStorage.removeItem(khoaBai(attemptId)); } catch { /* thôi */ }
}

/* ── Lời nhờ "bắt đầu ngay" từ sảnh sang màn đề ────────────────────────────
 * Bấm "Bắt đầu thi" ở khung chi tiết của sảnh thì màn `/exam/:id` mở thẳng vào
 * chế độ thi, không dừng lại ở màn giới thiệu lần nữa. Một biến tầm mô-đun là
 * đủ: lời nhờ chỉ sống đúng một lượt chuyển trang và bị xoá ngay khi đọc. */
let loiNho: { examId: number; ai: boolean } | null = null;
export function nhoBatDau(examId: number, ai: boolean): void { loiNho = { examId, ai }; }
export function layLoiNho(examId: number): { ai: boolean } | null {
  if (!loiNho || loiNho.examId !== examId) return null;
  const r = { ai: loiNho.ai };
  loiNho = null;
  return r;
}

export const CHU_CAI = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
