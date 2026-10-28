'use client';
/**
 * Trang phòng lab dùng CHUNG (/os-lab, /cpu-lab): phần mở đầu có một thứ bấm được ngay (dãy 8 bóng LED / bốn lõi CPU),
 * lộ trình các mô phỏng, rồi mô phỏng đang chọn. Mở thẳng bằng
 *   ?sim=…&preset=…&lang=…            — mô phỏng + kịch bản
 *   ?tour=<id>                         — chạy luôn bài hướng dẫn đó (tự chọn mô phỏng của tour)
 *   ?record=1&tour=<id>[&rate=2]       — CHẾ ĐỘ QUAY VIDEO: chỉ còn mô phỏng trên nền phẳng, tour tự chạy theo dòng thời
 *                                        gian cố định, không ngẫu nhiên (xem labs/TOURS.md)
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Play } from 'lucide-react';
import { LABS, isLabIn } from './registry';
import { LabEmbed } from './mount';
import { FALLBACK_ICON, SIM_ICON } from './meta';
import { TOUR_BY_ID, defaultTour, toursOf } from './tour';
import { ChipGuide, SoundToggle } from './tour/TourLayer';
import { labSfx } from './sfx';
import type { LabNs } from './selector';
import type { Lang } from '../os-lab/ui';
import g from './gallery.module.css';

export interface GalleryCopy {
  eyebrowEn: string; eyebrowVi: string; titleEn: string; titleVi: string; leadEn: string; leadVi: string;
  /** khoá/môn liên quan: [nhãn EN, nhãn VI, đường dẫn] */
  links: Array<[string, string, string]>;
  first: string;
  /** đánh số thẻ theo thứ tự học */
  numbered?: boolean;
}

const OTHER: Record<LabNs, [string, string]> = { 'os-lab': ['Operating systems lab', 'Phòng lab hệ điều hành'], 'cpu-lab': ['Computer from zero lab', 'Phòng lab máy tính từ số 0'] };
const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');

/** Thứ bấm được ngay ở phần mở đầu /cpu-lab: một byte bằng 8 bóng LED. */
function HeroByte({ lang }: { lang: Lang }) {
  const [v, setV] = useState(0b01000011);
  const t = (en: string, vi: string) => (lang === 'vi' ? vi : en);
  const ch = v >= 32 && v < 127 ? `'${String.fromCharCode(v)}'` : '—';
  return (
    <div className={g.heroToy}>
      <div className={g.heroToyLabel}>{t('Click the lights — this is one byte', 'Bấm thử các bóng đèn — đây là một byte')}</div>
      <div className={g.leds} role="group" aria-label={t('eight bits', 'tám bit')}>
        {Array.from({ length: 8 }, (_, i) => 7 - i).map((k) => {
          const on = (v >> k) & 1;
          return (
            <button type="button" key={k} className={cx(g.led, !!on && g.ledOn)} aria-pressed={!!on} aria-label={`bit ${k} (${2 ** k})`}
              onClick={() => { labSfx(on ? 'off' : 'on'); setV(v ^ (1 << k)); }}>
              <span className={g.ledBulb} /><span className={g.ledW}>{2 ** k}</span>
            </button>
          );
        })}
      </div>
      <div className={g.readout}>
        <span><b>{v.toString(2).padStart(8, '0').replace(/(\d{4})/, '$1 ')}</b><i>{t('binary', 'nhị phân')}</i></span>
        <span><b>{v}</b><i>{t('number', 'số')}</i></span>
        <span><b>0x{v.toString(16).toUpperCase().padStart(2, '0')}</b><i>hex</i></span>
        <span><b>{ch}</b><i>{t('letter', 'chữ')}</i></span>
      </div>
    </div>
  );
}

/** Thứ chuyển động ở phần mở đầu /os-lab: bốn lõi CPU luân phiên tiến trình (round robin), dừng hẳn khi giảm chuyển động. */
function HeroCores({ lang }: { lang: Lang }) {
  const PROCS = ['node', 'postgres', 'nginx', 'bash', 'chrome', 'sshd', 'python', 'java'];
  const COL = ['#2563eb', '#d97706', '#059669', '#dc2626', '#7c3aed', '#db2777', '#0891b2', '#4d7c0f'];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setTick((x) => x + 1), 1100);
    return () => window.clearInterval(id);
  }, []);
  const t = (en: string, vi: string) => (lang === 'vi' ? vi : en);
  return (
    <div className={g.heroToy}>
      <div className={g.heroToyLabel}>{t('Four cores, eight processes — the scheduler takes turns', 'Bốn lõi, tám tiến trình — bộ lập lịch cho thay phiên')}</div>
      <div className={g.cores}>
        {[0, 1, 2, 3].map((c) => {
          const p = (c + tick * 3) % PROCS.length;
          return (
            <div key={c} className={g.core}>
              <span className={g.coreName}>CPU {c}</span>
              <span key={`${c}-${p}`} className={g.coreProc} style={{ background: COL[p] }}>{PROCS[p]}</span>
            </div>
          );
        })}
      </div>
      <div className={g.queue}>
        <i>{t('ready queue', 'hàng sẵn sàng')}</i>
        {[4, 5, 6, 7].map((k) => { const p = (k + tick * 3) % PROCS.length; return <span key={k} style={{ borderColor: COL[p], color: COL[p] }}>{PROCS[p]}</span>; })}
      </div>
    </div>
  );
}

export default function LabGallery({ ns, copy }: { ns: LabNs; copy: GalleryCopy }) {
  const labs = LABS[ns].labs;
  const [lang, setLang] = useState<Lang>('vi');
  const [sim, setSim] = useState(copy.first);
  const [preset, setPreset] = useState<string | undefined>(undefined);
  const [tour, setTour] = useState<string | undefined>(undefined);
  const [auto, setAuto] = useState(false);
  const [record, setRecord] = useState(false);
  const [rate, setRate] = useState(1);
  const [ready, setReady] = useState(false);
  const [nonce, setNonce] = useState(0);
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    let q = sp.get('sim') ?? '';
    const tq = sp.get('tour') ?? '';
    const T = TOUR_BY_ID.get(tq);
    if (T && T.ns === ns) { if (!isLabIn(ns, q)) q = T.sim; if (T.sim === q) { setTour(tq); setAuto(true); } }
    if (isLabIn(ns, q)) setSim(q);
    const p = sp.get('preset') ?? undefined;
    if (p && isLabIn(ns, q) && labs[q].presets.includes(p)) setPreset(p);
    else if (T && T.ns === ns && T.presets[0] && labs[T.sim].presets.includes(T.presets[0])) setPreset(T.presets[0]);
    if (sp.get('lang') === 'en') setLang('en');
    if (sp.get('record') === '1') {
      setRecord(true);
      const r = Number(sp.get('rate'));
      if (Number.isFinite(r) && r > 0 && r <= 16) setRate(r);
    }
    setReady(true);
  }, [ns, labs]);

  useEffect(() => {
    if (!record) return;
    document.documentElement.dataset.labRecord = '1';
    return () => { delete document.documentElement.dataset.labRecord; };
  }, [record]);

  const syncUrl = (k: string, t?: string) => {
    const u = new URL(window.location.href);
    u.searchParams.set('sim', k); u.searchParams.delete('preset');
    if (t) u.searchParams.set('tour', t); else u.searchParams.delete('tour');
    window.history.replaceState(null, '', u.toString());
  };
  const pick = (k: string) => {
    setSim(k); setPreset(undefined); setTour(undefined); setAuto(false); syncUrl(k);
    window.setTimeout(() => stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };
  const startGuide = (k: string) => {
    const T = defaultTour(ns, k, labs[k].presets[0]);
    setSim(k); setPreset(undefined); setTour(T?.id); setAuto(true); setNonce((x) => x + 1); syncUrl(k, T?.id);
    window.setTimeout(() => stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };
  const t = (en: string, vi: string) => (lang === 'vi' ? vi : en);
  const def = labs[sim];
  const entries = useMemo(() => Object.entries(labs), [labs]);
  const guideCount = (k: string) => toursOf(ns, k).filter((x) => x.presets.length > 0).length;
  const Icon = SIM_ICON[ns][sim] ?? FALLBACK_ICON;

  if (ready && record) {
    return (
      <div className={g.recordStage} data-lab-record-stage="1">
        <div className={g.recordInner}>
          <LabEmbed key={`${sim}-${preset ?? ''}-${lang}-${tour ?? ''}`} ns={ns} name={sim} preset={preset} lang={lang} tour={tour} record rate={rate} />
        </div>
      </div>
    );
  }

  return (
    <main className={g.page}>
      <section className={g.hero}>
        <div className={g.heroText}>
          <div className={g.eyebrow}>{t(copy.eyebrowEn, copy.eyebrowVi)}</div>
          <h1 className={g.h1}>{t(copy.titleEn, copy.titleVi)}</h1>
          <p className={g.lead}>{t(copy.leadEn, copy.leadVi)}</p>
          <div className={g.heroActions}>
            <button type="button" className={g.primary} onClick={() => startGuide(copy.first)}><Compass aria-hidden />{t('Start with a guided tour', 'Bắt đầu với bài hướng dẫn')}</button>
            <div className={g.seg} role="group" aria-label={t('Language', 'Ngôn ngữ')}>
              <button type="button" aria-pressed={lang === 'vi'} className={cx(lang === 'vi' && g.segOn)} onClick={() => setLang('vi')}>Tiếng Việt</button>
              <button type="button" aria-pressed={lang === 'en'} className={cx(lang === 'en' && g.segOn)} onClick={() => setLang('en')}>English</button>
            </div>
          </div>
          <div className={g.links}>
            {copy.links.map(([en, vi, href]) => <Link key={href} href={href}>{t(en, vi)}</Link>)}
            {(Object.keys(LABS) as LabNs[]).filter((k) => k !== ns).map((k) => <Link key={k} href={LABS[k].gallery} className={g.linkMuted}>{t(OTHER[k][0], OTHER[k][1])}</Link>)}
          </div>
        </div>
        <div className={g.heroSide}>
          {ns === 'cpu-lab' ? <HeroByte lang={lang} /> : <HeroCores lang={lang} />}
          <div className={g.heroNote}><ChipGuide size={30} /><span>{t('Every simulation has a step-by-step guide. Sound is optional — toggle it anywhere.', 'Mô phỏng nào cũng có hướng dẫn từng bước. Âm thanh bật tắt được ở mọi nơi.')}</span><SoundTogglePlain lang={lang} /></div>
        </div>
      </section>

      <section aria-labelledby="lab-list" className={g.listSec}>
        <h2 id="lab-list" className={g.h2}>{copy.numbered ? t('The learning path', 'Lộ trình học') : t('All simulations', 'Tất cả mô phỏng')}</h2>
        <ol className={cx(g.cards, copy.numbered && g.path)}>
          {entries.map(([k, d], i) => {
            const I = SIM_ICON[ns][k] ?? FALLBACK_ICON;
            const n = guideCount(k);
            return (
              <li key={k} className={cx(g.cardItem, k === sim && g.cardSel)}>
                {copy.numbered && <span className={g.stepNo} aria-hidden>{i + 1}</span>}
                <button type="button" className={g.cardMain} onClick={() => pick(k)} aria-current={k === sim ? 'true' : undefined}>
                  <span className={g.cardIcon}><I aria-hidden /></span>
                  <span className={g.cardText}>
                    <span className={g.cardChapter}>{t(d.chapterEn, d.chapterVi)}</span>
                    <span className={g.cardTitle}>{t(d.en, d.vi)}</span>
                    <span className={g.cardDesc}>{t(d.descEn, d.descVi)}</span>
                  </span>
                </button>
                <button type="button" className={g.cardGuide} onClick={() => startGuide(k)}>
                  <Play aria-hidden />{n ? t(`${n} guide${n > 1 ? 's' : ''}`, `${n} bài hướng dẫn`) : t('Quick guide', 'Hướng dẫn nhanh')}
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {ready && def && (
        <section ref={stageRef} className={g.stage} aria-label={t(def.en, def.vi)}>
          <div className={g.stageHead}>
            <span className={g.stageIcon}><Icon aria-hidden /></span>
            <div className={g.stageTitles}>
              <div className={g.stageKicker}>{t('Open now', 'Đang mở')}</div>
              <div className={g.stageTitle}>{t(def.en, def.vi)}</div>
            </div>
            {def.presets.length > 1 && (
              <div className={g.presets} role="group" aria-label={t('Scenario', 'Kịch bản')}>
                <span>{t('Scenario', 'Kịch bản')}</span>
                {def.presets.map((p) => (
                  <button type="button" key={p} aria-pressed={(preset ?? def.presets[0]) === p} className={cx((preset ?? def.presets[0]) === p && g.presetOn)}
                    onClick={() => { setPreset(p); setTour(undefined); setAuto(false); }}>{p}</button>
                ))}
              </div>
            )}
          </div>
          <LabEmbed key={`${sim}-${preset ?? ''}-${lang}-${tour ?? ''}-${nonce}`} ns={ns} name={sim} preset={preset} lang={lang} tour={tour} autoStart={auto} />
          <p className={g.after}>{t('Want the full story? Each simulation is embedded in the course lesson that explains it.', 'Muốn hiểu trọn vẹn? Mỗi mô phỏng đều nằm trong bài học giải thích nó.')} {copy.links[0] && <Link href={copy.links[0][2]}>{t(copy.links[0][0], copy.links[0][1])} <ArrowRight aria-hidden /></Link>}</p>
        </section>
      )}
    </main>
  );
}

/** Nút âm thanh ngoài khung mô phỏng (mượn kiểu của trang). */
function SoundTogglePlain({ lang }: { lang: Lang }) {
  return <span className={g.soundWrap}><SoundToggle lang={lang} /></span>;
}
