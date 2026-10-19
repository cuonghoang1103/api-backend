/**
 * `ct-lenh` = `desktop/src/renderer/features/chat/lenhGach.ts` — phần THUẦN của
 * lệnh `/` trong app desktop (danh sách lệnh, khớp bí danh, dựng câu trả lời).
 * esbuild trỏ thẳng tới file đó (`build.mjs`), nên lệnh `/` của CLI, extension
 * VS Code và app là MỘT bản. Khai kiểu ở đây thay vì để tsc đi theo import vào cả cây
 * React của app.
 */
declare module 'ct-lenh' {
  export type NhomLenh = 'co-ban' | 'phien' | 'lam-viec' | 'cong-cu';
  export interface LenhGach { ten: string; mo: string; khac?: string[]; thamSo?: string; nhom?: NhomLenh }
  export const LENH_AGENT: LenhGach[];
  export function tachLenh(text: string, ds?: LenhGach[]): { ten: string; thamSo: string } | null;
  export function moTaTroGiup(ds?: LenhGach[], lenhDuAn?: Array<{ ten: string; mo: string }>): string;
  export function chuanHoa(s: string): string;
  export function timTheoChu<T extends { id: string; ten: string }>(chu: string, ds: readonly T[], biDanh?: Record<string, string>): T | null;
  export function timMuc<T extends { id: string; ten: string }>(chu: string, ds: readonly T[]): T | null;
  export interface DuLieuUsage { daDung: number; tran: number; conLai: number; phanTram: number; hoiLucNao: string | null; coKeyGiaHan?: boolean }
  export function layUsage(request: (duong: string) => Promise<unknown>): Promise<DuLieuUsage>;
  export function moTaUsage(u: DuLieuUsage, tokenMoiViec?: number): string;
  /** Đợt 8A: hạn mức THẬT (`data.cuongMini`); `null` ⇒ máy chủ cũ, lùi `moTaUsage`. */
  export interface UsagePhien { nguCanhPhanTram?: number | null; tienPhien?: number | null }
  export function moTaUsage2(d: unknown, phien?: UsagePhien, ngonNgu?: 'vi' | 'en'): string | null;
  export function moTaNguCanh(ct: unknown, tran: number, soLuotDaBo: number): string;
  export function moTaTrangThai(t: {
    phienBan: string; cong: 'chinh' | 'duPhong' | 'ngoaiTuyen' | 'epNgoaiTuyen'; online: boolean; tenCucBo?: string;
    duAn: string | null; duongDan: string | null; nhanh: string | null; model: string; muc: string; cheDo: string; tomTat: boolean;
  }): string;
  export function moTaChanDoan(ds: Array<{ ten: string; muc: 'ok' | 'canh' | 'loi'; chiTiet: string }>): string;
  export function promptPlan(yeuCau: string): string;
  export const PROMPT_DUYET_KE_HOACH: string;
  export function promptReview(phamVi: string): string;
  export const PROMPT_INIT: string;
  export type MucGhi = { kieu: string; text?: string; ten?: string; tomTat?: string; [k: string]: unknown };
  export function dsCauHoi(muc: readonly MucGhi[]): Array<{ k: number; text: string }>;
  export function moTaDsCauHoi(ds: Array<{ k: number; text: string }>): string;
  export interface PhienCu { id: string; tieuDe: string; duAn: string | null; luucLuc: number; soTinNhan: number; ghim?: boolean; luuTru?: boolean }
  export function locPhien(ds: readonly PhienCu[], tuKhoa: string): PhienCu[];
  export function chonPhien(ds: readonly PhienCu[], thamSo: string): PhienCu | null;
  export function moTaDsPhien(ds: readonly PhienCu[]): string;
  export function xuatMarkdown(muc: readonly MucGhi[], meta: { tieuDe: string; duAn: string | null; luc: Date }): string;
  export function tenFileXuat(tieuDe: string, luc: Date): string;
  export const TEN_CHE_DO: Record<string, string>;
}
