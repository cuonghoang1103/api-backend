'use client';
/**
 * Trang phòng lab dùng CHUNG (/os-lab, /cpu-lab): lưới thẻ mô phỏng + mô phỏng đang chọn, mở thẳng bằng
 * ?sim=…&preset=…&lang=…  Mỗi phòng lab chỉ khai chữ và đường dẫn khoá học; phần còn lại giống hệt nhau.
 */
import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { LABS, isLabIn } from './registry';
import { LabEmbed } from './mount';
import type { LabNs } from './selector';
import type { Lang } from '../os-lab/ui';
import s from '../os-lab/oslab.module.css';

export interface GalleryCopy {
  eyebrowEn: string; eyebrowVi: string; titleEn: string; titleVi: string; leadEn: string; leadVi: string;
  /** khoá/môn liên quan: [nhãn EN, nhãn VI, đường dẫn] */
  links: Array<[string, string, string]>;
  first: string;
  /** đánh số thẻ theo thứ tự học */
  numbered?: boolean;
}

/** biến màu của khung mô phỏng (--ol-*) chỉ có bên trong .root — nút chọn ngôn ngữ nằm ngoài nên mượn màu của site */
const SEG_VARS = { '--ol-accent': 'var(--accent-color)', '--ol-panel': 'var(--bg-surface)', '--ol-border': 'var(--border-color)', '--ol-text': 'var(--text-primary)' } as CSSProperties;

const OTHER: Record<LabNs, [string, string]> = { 'os-lab': ['Operating systems lab', 'Phòng lab hệ điều hành'], 'cpu-lab': ['Computer from zero lab', 'Phòng lab máy tính từ số 0'] };

export default function LabGallery({ ns, copy }: { ns: LabNs; copy: GalleryCopy }) {
  const labs = LABS[ns].labs;
  const [lang, setLang] = useState<Lang>('vi');
  const [sim, setSim] = useState(copy.first);
  const [preset, setPreset] = useState<string | undefined>(undefined);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get('sim') ?? '';
    if (isLabIn(ns, q)) setSim(q);
    const p = sp.get('preset') ?? undefined;
    if (p && isLabIn(ns, q) && labs[q].presets.includes(p)) setPreset(p);
    if (sp.get('lang') === 'en') setLang('en');
    setReady(true);
  }, [ns, labs]);
  const pick = (k: string) => {
    setSim(k); setPreset(undefined);
    const u = new URL(window.location.href); u.searchParams.set('sim', k); u.searchParams.delete('preset');
    window.history.replaceState(null, '', u.toString());
  };
  const t = (en: string, vi: string) => (lang === 'vi' ? vi : en);
  const def = labs[sim];
  return (
    <main style={{ maxWidth: 1180, margin: '0 auto', padding: '84px 16px 64px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ minWidth: 0, flex: '1 1 480px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--accent-color)' }}>{t(copy.eyebrowEn, copy.eyebrowVi)}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 6px' }}>{t(copy.titleEn, copy.titleVi)}</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 760, fontSize: 15 }}>{t(copy.leadEn, copy.leadVi)}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className={s.seg} role="group" aria-label="language" style={SEG_VARS}>
            <button type="button" className={lang === 'vi' ? s.on : ''} onClick={() => setLang('vi')}>Tiếng Việt</button>
            <button type="button" className={lang === 'en' ? s.on : ''} onClick={() => setLang('en')}>English</button>
          </div>
          {copy.links.map(([en, vi, href]) => <Link key={href} href={href} style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent-color)' }}>{t(en, vi)}</Link>)}
          {(Object.keys(LABS) as LabNs[]).filter((k) => k !== ns).map((k) => (
            <Link key={k} href={LABS[k].gallery} style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)' }}>↔ {t(OTHER[k][0], OTHER[k][1])}</Link>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, margin: '18px 0 6px' }}>
        {Object.entries(labs).map(([k, d], i) => (
          <button type="button" key={k} onClick={() => pick(k)} style={{
            textAlign: 'left', borderRadius: 12, padding: '10px 12px', cursor: 'pointer', background: 'var(--bg-card)', color: 'var(--text-primary)',
            border: `2px solid ${k === sim ? 'var(--accent-color)' : 'var(--border-color)'}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{copy.numbered ? `${i + 1} · ` : ''}{t(d.chapterEn, d.chapterVi)}</div>
            <div style={{ fontWeight: 800, fontSize: 15, margin: '2px 0' }}>{t(d.en, d.vi)}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{t(d.descEn, d.descVi)}</div>
          </button>
        ))}
      </div>
      {ready && def && (
        <>
          {def.presets.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
              {t('Start from:', 'Bắt đầu từ:')}
              {def.presets.map((p) => (
                <button type="button" key={p} onClick={() => setPreset(p)} style={{
                  borderRadius: 999, padding: '3px 10px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', background: 'var(--bg-surface)', color: 'var(--text-primary)',
                  border: `1.5px solid ${(preset ?? def.presets[0]) === p ? 'var(--accent-color)' : 'var(--border-color)'}`,
                }}>{p}</button>
              ))}
            </div>
          )}
          <LabEmbed key={`${sim}-${preset ?? ''}-${lang}`} ns={ns} name={sim} preset={preset} lang={lang} />
        </>
      )}
    </main>
  );
}
