'use client';

/**
 * Thanh menu trên gọn cho phòng thi máy tính / Flashcards / Sổ lỗi (07/10/2026)
 * + tuỳ chọn hiển thị dùng chung (tối, cỡ chữ, kiểu chữ) nhớ trên máy.
 * Link viết theo đường web `/language/en/ielts…` — app desktop tự đổi sang `/ielts…` (shim doiDuongApp).
 */
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import s from './cdt.module.css';

export type TrangMenu = 'khoa' | 'grammar' | 'the-tu' | 'thi-may' | 'so-loi';

const MUC: { id: TrangMenu; href: string; ten: string }[] = [
  { id: 'khoa', href: '/language/en/ielts', ten: 'IELTS Course' },
  { id: 'grammar', href: '/language/en/ielts?bai=tra-cong-thuc', ten: 'Grammar' },
  { id: 'the-tu', href: '/language/en/ielts/the-tu', ten: 'Flashcards' },
  { id: 'thi-may', href: '/language/en/ielts/thi-may', ten: 'Online Test' },
  { id: 'so-loi', href: '/language/en/ielts/so-loi', ten: 'Sổ lỗi' },
];

export function MenuTren({ dang, children }: { dang: TrangMenu; children?: React.ReactNode }) {
  return (
    <nav className={s.menu} aria-label="IELTS">
      <Link href="/language/en/ielts" className={s.logo}>
        <span className={s.logoO} aria-hidden>CT</span>
        <span>CuongThai <b>IELTS</b></span>
      </Link>
      <div className={s.menuLinks}>
        {MUC.map((m) => (
          <Link key={m.id} href={m.href} className={`${s.menuA} ${m.id === dang ? s.menuOn : ''}`} aria-current={m.id === dang ? 'page' : undefined}>
            {m.ten}
          </Link>
        ))}
        {children}
      </div>
    </nav>
  );
}

type TuyChon = { toi: boolean; co: number; serif: boolean };
const KHOA = 'ielts-cdt:hien-thi';
const MAC_DINH: TuyChon = { toi: false, co: 16, serif: false };

/** Tuỳ chọn hiển thị — mặc định SÁNG như phòng thi thật, kể cả khi web đang để giao diện tối. */
export function useHienThi() {
  const [tc, setTc] = useState<TuyChon>(MAC_DINH);
  useEffect(() => {
    try { const r = localStorage.getItem(KHOA); if (r) setTc({ ...MAC_DINH, ...(JSON.parse(r) as Partial<TuyChon>) }); } catch { /* bỏ qua */ }
  }, []);
  const doi = useCallback((p: Partial<TuyChon>) => {
    setTc((cu) => {
      const moi = { ...cu, ...p, co: Math.min(24, Math.max(13, p.co ?? cu.co)) };
      try { localStorage.setItem(KHOA, JSON.stringify(moi)); } catch { /* bỏ qua */ }
      return moi;
    });
  }, []);
  const thuocTinh = {
    'data-toi': tc.toi ? '1' : '0',
    'data-serif': tc.serif ? '1' : '0',
    style: { ['--co-chu' as string]: `${tc.co}px` } as React.CSSProperties,
  };
  return { tc, doi, thuocTinh };
}

/** Cụm nút A− A+ · Aa (serif/sans) · ☾ (tối). */
export function NutHienThi({ tc, doi }: { tc: TuyChon; doi: (p: Partial<TuyChon>) => void }) {
  return (
    <>
      <button type="button" className={s.iconBtn} onClick={() => doi({ co: tc.co - 1 })} aria-label="Chữ nhỏ hơn" title="Chữ nhỏ hơn">A−</button>
      <button type="button" className={s.iconBtn} onClick={() => doi({ co: tc.co + 1 })} aria-label="Chữ to hơn" title="Chữ to hơn">A+</button>
      <button type="button" className={s.iconBtn} onClick={() => doi({ serif: !tc.serif })} aria-pressed={tc.serif} aria-label="Đổi kiểu chữ bài đọc (có chân / không chân)" title="Đổi kiểu chữ bài đọc (có chân / không chân)" style={{ fontFamily: tc.serif ? 'Georgia, serif' : undefined }}>Aa</button>
      <button type="button" className={s.iconBtn} onClick={() => doi({ toi: !tc.toi })} aria-label={tc.toi ? 'Giao diện sáng' : 'Giao diện tối'} title={tc.toi ? 'Giao diện sáng' : 'Giao diện tối'}>{tc.toi ? '☀' : '☾'}</button>
    </>
  );
}
