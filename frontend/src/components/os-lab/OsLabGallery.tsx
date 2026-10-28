'use client';
/** Trang /os-lab: mọi mô phỏng của khoá "Operating Systems for Developers" ở một chỗ, mở thẳng bằng ?sim=…&preset=…&lang=… */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { OS_LABS, isLab } from './registry';
import { OsLabEmbed } from './mount';
import type { Lang } from './ui';
import s from './oslab.module.css';

const COURSE = '/courses/operating-systems-for-developers';

export default function OsLabGallery() {
  const [lang, setLang] = useState<Lang>('vi');
  const [sim, setSim] = useState('process');
  const [preset, setPreset] = useState<string | undefined>(undefined);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get('sim') ?? '';
    if (isLab(q)) setSim(q);
    const p = sp.get('preset') ?? undefined;
    if (p && isLab(q) && OS_LABS[q].presets.includes(p)) setPreset(p);
    if (sp.get('lang') === 'en') setLang('en');
    setReady(true);
  }, []);
  const pick = (k: string) => {
    setSim(k); setPreset(undefined);
    const u = new URL(window.location.href); u.searchParams.set('sim', k); u.searchParams.delete('preset');
    window.history.replaceState(null, '', u.toString());
  };
  const t = (en: string, vi: string) => (lang === 'vi' ? vi : en);
  const def = OS_LABS[sim];
  return (
    <main style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 16px 64px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--accent-color)' }}>
            Operating Systems for Developers · {t('Visual lab', 'Phòng lab trực quan')}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 6px' }}>{t('See the operating system work', 'Nhìn thấy hệ điều hành làm việc')}</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 760, fontSize: 15 }}>
            {t('Every idea in the course you cannot see — scheduling, races, page faults, the stack — as a simulation you can play, pause, step and change. Then measure the same thing for real in the lab container.',
              'Mọi ý tưởng trong khoá mà mắt thường không thấy — lập lịch, race condition, lỗi trang, stack — thành mô phỏng bạn chạy, dừng, đi từng bước và thay đổi được. Rồi đo đúng thứ đó bằng thật trong container phòng lab.')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className={s.seg} role="group" aria-label="language">
            <button type="button" className={lang === 'vi' ? s.on : ''} onClick={() => setLang('vi')}>Tiếng Việt</button>
            <button type="button" className={lang === 'en' ? s.on : ''} onClick={() => setLang('en')}>English</button>
          </div>
          <Link href={COURSE} style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent-color)' }}>{t('← Course', '← Khoá học')}</Link>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, margin: '18px 0 6px' }}>
        {Object.entries(OS_LABS).map(([k, d]) => (
          <button type="button" key={k} onClick={() => pick(k)} style={{
            textAlign: 'left', borderRadius: 12, padding: '10px 12px', cursor: 'pointer', background: 'var(--bg-card)', color: 'var(--text-primary)',
            border: `2px solid ${k === sim ? 'var(--accent-color)' : 'var(--border-color)'}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t(d.chapterEn, d.chapterVi)}</div>
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
          <OsLabEmbed key={`${sim}-${preset ?? ''}-${lang}`} name={sim} preset={preset} lang={lang} />
        </>
      )}
    </main>
  );
}
