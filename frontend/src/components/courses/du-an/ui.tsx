'use client';
/**
 * Mảnh giao diện dùng chung của các khối "Dự án xuyên suốt khoá" trong TRANG HỌC.
 * Trang học là "đảo tối" (`bg-darkbg`/`bg-darkcard` — globals.css khai lại bảng chữ tối bên trong), nên ở đây dùng
 * đúng các lớp đó + `text-text-*` / `text-tone-*` như GopYNhanhBai — KHÔNG dùng biến thể `dark:` (dành riêng cho Notes).
 */
import type { ReactNode } from 'react';
import { pickLang, sanitizeHtml } from '@/lib/utils';

export function Html({ s, locale, className = '', as = 'span' }: { s: string | null | undefined; locale: 'en' | 'vi'; className?: string; as?: 'span' | 'div' | 'p' }) {
  const Tag = as;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(pickLang(s ?? '', locale)) }} />;
}

export function The({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`mb-8 min-w-0 rounded-2xl border border-darkborder/50 bg-darkcard p-4 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function TieuDeKhoi({ children, phu }: { children: ReactNode; phu?: ReactNode }) {
  return (
    <div className="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-2">
      <h3 className="min-w-0 font-heading text-lg font-bold text-text-primary sm:text-xl">{children}</h3>
      {phu}
    </div>
  );
}

type NutProps = { children: ReactNode; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit'; className?: string; title?: string };

export function NutChinh({ children, onClick, disabled, type = 'button', className = '', title }: NutProps) {
  return (
    <button
      type={type} onClick={onClick} disabled={disabled} title={title}
      className={`inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-neon-violet px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neon-violet/85 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function NutPhu({ children, onClick, disabled, type = 'button', className = '', title }: NutProps) {
  return (
    <button
      type={type} onClick={onClick} disabled={disabled} title={title}
      className={`inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-darkborder px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function ThanhTienDo({ phanTram, nhan }: { phanTram: number; nhan?: ReactNode }) {
  const p = Math.max(0, Math.min(100, Math.round(phanTram)));
  return (
    <div className="min-w-0">
      {nhan && <div className="mb-1.5 flex items-center justify-between gap-2 text-xs text-text-muted">{nhan}<span className="font-semibold text-text-secondary">{p}%</span></div>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-darkbg" role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-gradient-to-r from-neon-indigo to-neon-violet transition-[width] duration-500" style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}

export const oNhap = 'w-full min-w-0 rounded-xl border border-darkborder bg-darkbg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-neon-violet';

export function Chip({ children, mau = 'violet' }: { children: ReactNode; mau?: 'violet' | 'emerald' | 'amber' | 'rose' | 'xam' }) {
  const lop = {
    violet: 'bg-neon-violet/15 text-tone-violet border-neon-violet/30',
    emerald: 'bg-emerald-500/15 text-tone-emerald border-emerald-500/30',
    amber: 'bg-amber-500/15 text-tone-amber border-amber-500/30',
    rose: 'bg-rose-500/15 text-tone-rose border-rose-500/30',
    xam: 'bg-white/5 text-text-muted border-darkborder',
  }[mau];
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${lop}`}>{children}</span>;
}

/** Danh sách chuỗi song ngữ (có thể kèm HTML nhỏ như <code>). */
export function DanhSach({ ds, locale, dau = '•' }: { ds: string[]; locale: 'en' | 'vi'; dau?: string }) {
  if (!ds.length) return null;
  return (
    <ul className="space-y-1.5">
      {ds.map((x, i) => (
        <li key={i} className="flex min-w-0 gap-2 text-sm leading-relaxed text-text-secondary">
          <span className="shrink-0 text-tone-violet" aria-hidden>{dau}</span>
          <Html s={x} locale={locale} className="min-w-0 break-words" />
        </li>
      ))}
    </ul>
  );
}

export function MoiDangNhap({ locale, chu }: { locale: 'en' | 'vi'; chu: { moiDangNhap: string; dangNhap: string } }) {
  const ve = typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname + window.location.search) : '';
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neon-violet/30 bg-neon-violet/10 p-4">
      <p className="min-w-0 text-sm text-text-secondary">{chu.moiDangNhap}</p>
      <a href={`/login${ve ? `?callbackUrl=${ve}` : ''}`} lang={locale} className="inline-flex min-h-[40px] items-center rounded-xl bg-neon-violet px-4 text-sm font-semibold text-white hover:bg-neon-violet/85">
        {chu.dangNhap}
      </a>
    </div>
  );
}
