'use client';
/**
 * False sharing (bài 4.6): mỗi lõi tăng bộ đếm RIÊNG; khi các bộ đếm chung một dòng cache, giao thức MESI kéo cả dòng
 * qua lại giữa các lõi ở MỖI lần ghi. Kéo khoảng cách 8/64/128/256 B, đổi cỡ dòng 64/128 B (getconf nói 64, M1 thật là
 * 128), xem trạng thái M/E/S/I từng lõi và đồng hồ đo thật c46-false (777 vs 192 ms). Engine: engine/cacheline.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { FS_MS, FS_ONE_THREAD, GETCONF, JAVA, lineOf, linesUsed, PERF, REAL_LINE, simulateCl, type Mesi } from './engine/cacheline';
import { Controls, Explain, Frame, Kpi, Seg, colorOf, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab3.module.css';

const PRESET: Record<string, { cores: 4 | 8; gap: 8 | 64 | 128 | 256; line: 64 | 128; local?: boolean; java?: boolean }> = {
  false: { cores: 8, gap: 8, line: 64 },
  padded: { cores: 8, gap: 128, line: 128 },
  m1: { cores: 8, gap: 64, line: 64 },
  java: { cores: 4, gap: 8, line: 128, java: true },
};
const ROUNDS = 3;
const MESI_CLS: Record<Mesi, string> = { M: c.mesiM, E: c.mesiE, S: c.mesiS, I: c.mesiI };
const MESI_TXT: Record<Mesi, [string, string]> = { M: ['Modified: only copy, dirty', 'Modified: bản duy nhất, đã sửa'], E: ['Exclusive: only copy, clean', 'Exclusive: bản duy nhất, sạch'], S: ['Shared: read-only copy', 'Shared: bản chỉ-đọc'], I: ['Invalid: must fetch again', 'Invalid: phải lấy lại'] };

export default function CacheLineSim({ lang = 'vi', preset = 'false' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const P0 = PRESET[preset] ?? PRESET.false;
  const [cores, setCores] = useState<4 | 8>(P0.cores);
  const [gap, setGap] = useState<8 | 64 | 128 | 256>(P0.gap);
  const [line, setLine] = useState<64 | 128>(P0.line);
  const [local, setLocal] = useState(!!P0.local);
  const java = !!P0.java;
  const cfg = { cores, gap, line, rounds: ROUNDS, local };
  const steps = useMemo(() => simulateCl(cfg), [cores, gap, line, local]); // eslint-disable-line react-hooks/exhaustive-deps
  const L = linesUsed(cfg);
  const p = usePlayer(steps.length + 1, 900);
  const k = p.i - 1;
  const S = k >= 0 ? steps[Math.min(k, steps.length - 1)] : null;
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => {
    if (p.i !== prev.current && S) labSfx(S.event === 'hit' ? 'hit' : S.event === 'rfo' || S.event === 'upgrade' ? 'whoosh' : 'pop');
    prev.current = p.i;
  }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { p.reset(); }, [cores, gap, line, local]); // eslint-disable-line react-hooks/exhaustive-deps

  const ms = local ? (cores === 8 ? FS_MS[8].local! : null) : FS_MS[cores][gap];
  const realShared = !local && Math.floor(((cores - 1) * gap) / REAL_LINE) + 1 < cores;
  useLabBridge('cl', { cores, gap, line, local, i: p.i, atEnd: p.atEnd, bounces: S?.bounces ?? 0, hits: S?.hits ?? 0, misses: S?.misses ?? 0, ms: ms ?? -1, lines: L }, {
    gap: (v) => { setGap(Number(v) as 8 | 64 | 128 | 256); labSfx('tap'); }, line: (v) => { setLine(Number(v) as 64 | 128); labSfx('tap'); },
    cores: (v) => setCores(Number(v) as 4 | 8), local: (v) => { setLocal(!!v); labSfx(v ? 'on' : 'off'); },
  });

  const counters = Array.from({ length: cores }, (_, q) => steps.slice(0, Math.max(0, k + 1)).filter((x) => x.core === q).length);
  const states: Mesi[][] = S ? S.states : Array.from({ length: cores }, () => Array<Mesi>(L).fill('I'));

  const explain = () => {
    if (!S) return t(`${cores} threads, each adding 1 to ITS OWN counter. The counters are ${local ? 'local variables (one per thread, far apart)' : `${gap} bytes apart`}; a cache line is ${line} bytes ⇒ ${L} line${L > 1 ? 's' : ''} hold${L > 1 ? '' : 's'} all ${cores} counters. Press Step: each step is one write.`, `${cores} luồng, mỗi luồng cộng 1 vào bộ đếm CỦA RIÊNG NÓ. Các bộ đếm ${local ? 'là biến cục bộ (mỗi luồng một chỗ, xa nhau)' : `cách nhau ${gap} byte`}; một dòng cache ${line} byte ⇒ ${L} dòng chứa cả ${cores} bộ đếm. Bấm Bước: mỗi bước là một lần ghi.`);
    const who = `${t('core', 'lõi')} ${S.core}`;
    if (S.event === 'hit') return t(`${who} writes counter ${S.core}: its line ${S.line} is already Modified in its own L1 — a hit, nobody else is involved (~1 ns).`, `${who} ghi bộ đếm ${S.core}: dòng ${S.line} đã ở trạng thái Modified trong L1 của chính nó — trúng, không ai khác phải dính vào (~1 ns).`);
    if (S.event === 'first') return t(`${who} writes counter ${S.core}: first touch, line ${S.line} comes from memory and becomes Modified.`, `${who} ghi bộ đếm ${S.core}: lần đầu chạm, dòng ${S.line} được nạp từ bộ nhớ và thành Modified.`);
    return t(`${who} writes counter ${S.core}, but line ${S.line} is Modified in core ${S.from}'s L1. Read-for-ownership: core ${S.from} hands the whole ${line}-byte line over and marks it Invalid. The two threads share NO variable — only a line. (${S.bounces} bounce${S.bounces > 1 ? 's' : ''} so far.)`, `${who} ghi bộ đếm ${S.core}, nhưng dòng ${S.line} đang Modified trong L1 của lõi ${S.from}. Read-for-ownership: lõi ${S.from} giao cả dòng ${line} byte rồi đánh dấu Invalid. Hai luồng KHÔNG dùng chung biến nào — chỉ chung một dòng. (${S.bounces} lần nhảy cho tới giờ.)`);
  };

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('False sharing: a cache line bouncing between cores', 'False sharing: dòng cache nhảy qua lại giữa các lõi')}
      sub={t('Separate counters, same 64/128-byte line — MESI makes every write a cross-core transfer', 'Bộ đếm riêng, chung dòng 64/128 byte — MESI biến mỗi lần ghi thành một chuyến chuyển giữa các lõi')}>
      <div className={s.bar} data-tour="cl-opts">
        <Seg label={t('counters apart', 'cách nhau')} value={local ? 'local' : gap} options={[[8, '8 B'], [64, '64 B'], [128, '128 B'], [256, '256 B'], ['local', t('local var', 'biến cục bộ')]] as Array<[number | 'local', string]>} onChange={(v) => { if (v === 'local') setLocal(true); else { setLocal(false); setGap(v as 8 | 64 | 128 | 256); } labSfx('tap'); }} />
        <Seg label={t('cache line', 'dòng cache')} value={line} options={[[64, t('64 B (getconf)', '64 B (getconf)')], [128, t('128 B (real M1)', '128 B (M1 thật)')]]} onChange={(v) => { setLine(v); labSfx('tap'); }} />
        <Seg label={t('threads', 'luồng')} value={cores} options={[[4, '4'], [8, '8']]} onChange={(v) => setCores(v)} />
      </div>
      <Controls p={p} lang={lang} label={S ? `${t('write', 'lần ghi')} ${k + 1}/${steps.length}` : t('start', 'bắt đầu')} />
      <Explain tone={S?.event === 'rfo' ? 'bad' : S?.event === 'hit' ? 'ok' : undefined}>{explain()}</Explain>

      <div className={c.cols} style={{ marginTop: 10 }}>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="cl-cores">
            <div className={s.panelTitle}>{t('Cores and their L1 copies (M / E / S / I)', 'Các lõi và bản sao trong L1 (M / E / S / I)')}</div>
            <div className={c.cores}>
              {Array.from({ length: cores }, (_, q) => (
                <div key={q} className={cx(c.core, S?.core === q && c.coreOn)} style={{ borderColor: colorOf(q) }}>
                  <div className={c.coreHead}><span style={{ color: colorOf(q) }}>{t('core', 'lõi')} {q}</span><span className={s.mono}>+{counters[q]}</span></div>
                  <div className={c.l1}>
                    {states[q].map((m, ln) => (local ? ln === q : true) && <span key={`${ln}-${S?.core === q || S?.invalidated.includes(q) ? p.i : 0}`} className={cx(c.mesi, MESI_CLS[m], (S?.core === q || S?.invalidated.includes(q)) && S?.line === ln && c.mesiPop)} title={`${t('line', 'dòng')} ${ln}: ${t(MESI_TXT[m][0], MESI_TXT[m][1])}`}>{m}</span>)}
                  </div>
                </div>
              ))}
            </div>
            {S && S.from !== null && <div className={c.flyer} style={{ marginTop: 8, color: 'var(--ol-bad)' }}>⟶ {t(`line ${S.line}: core ${S.from} → core ${S.core}`, `dòng ${S.line}: lõi ${S.from} → lõi ${S.core}`)}</div>}
            <div className={s.small} style={{ marginTop: 6 }}><b style={{ color: '#dc2626' }}>M</b> {t('modified', 'đã sửa')} · <b style={{ color: '#7c3aed' }}>E</b> {t('exclusive', 'độc quyền')} · <b style={{ color: '#2563eb' }}>S</b> {t('shared', 'chia sẻ')} · <b style={{ color: '#94a3b8' }}>I</b> {t('invalid', 'vô hiệu')}</div>
          </div>
          <div className={s.panel} data-tour="cl-mem">
            <div className={s.panelTitle}>{local ? t('Memory: each counter on its own stack, pages apart', 'Bộ nhớ: mỗi bộ đếm trên stack riêng, cách nhau cả trang') : t(`Memory: 8-byte slots, framed into ${line}-byte cache lines`, `Bộ nhớ: ô 8 byte, đóng khung theo dòng cache ${line} byte`)}</div>
            <div className={c.mem}>
              {Array.from({ length: local ? cores : L }, (_, ln) => {
                const slots = line / 8;
                return (
                  <div key={ln} className={cx(c.lineBox, S?.line === ln && S.event === 'rfo' && c.lineHot)}>
                    <span className={c.lineLbl}>{t('line', 'dòng')} {ln}</span>
                    <div className={c.lineCells}>
                      {Array.from({ length: Math.min(slots, 16) }, (_, sl) => {
                        const addr = ln * line + sl * 8;
                        const owner = local ? (sl === 0 ? ln : -1) : Array.from({ length: cores }, (_, q) => q).find((q) => q * gap === addr) ?? -1;
                        return <span key={sl} className={c.slot} style={owner >= 0 ? { background: colorOf(owner), borderColor: colorOf(owner) } : undefined} title={owner >= 0 ? `counter ${owner}` : undefined} />;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            {!local && <div className={s.small} style={{ marginTop: 4 }}>{t(`Counter of core q sits at byte q × ${gap} ⇒ line ⌊q × ${gap} / ${line}⌋. Core 0 and core ${cores - 1}: lines ${lineOf(0, gap, line)} and ${lineOf(cores - 1, gap, line)}.`, `Bộ đếm của lõi q nằm ở byte q × ${gap} ⇒ dòng ⌊q × ${gap} / ${line}⌋. Lõi 0 và lõi ${cores - 1}: dòng ${lineOf(0, gap, line)} và ${lineOf(cores - 1, gap, line)}.`)}</div>}
          </div>
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.kpis} data-tour="cl-kpi">
            <Kpi k={t('hits', 'trúng')} v={S?.hits ?? 0} tone="ok" />
            <Kpi k={t('line bounces', 'lần dòng nhảy')} v={S?.bounces ?? 0} tone={(S?.bounces ?? 0) > 0 ? 'bad' : undefined} />
            <Kpi k={t('measured (lab)', 'đo thật (lab)')} v={ms === null ? '—' : `${ms} ms`} tone={ms !== null && ms > 300 ? 'bad' : ms !== null && ms < 200 ? 'ok' : 'warn'} />
          </div>
          <div className={s.panel} data-tour="cl-clock">
            <div className={s.panelTitle}>{t(`fs ${cores} threads × 100 M increments (c46, best of 3)`, `fs ${cores} luồng × 100 triệu lần cộng (c46, tốt nhất trong 3)`)}</div>
            <div className={c.bars}>
              {([8, 64, 128, 256] as const).map((g) => (
                <div key={g} className={c.thr} style={{ fontWeight: !local && g === gap ? 800 : 500 }}>
                  <span>{g} B</span>
                  <span className={c.thrTrack}><span className={c.thrFill} style={{ display: 'block', width: `${(100 * FS_MS[cores][g]) / FS_MS[cores][8]}%`, background: !local && g === gap ? 'var(--ol-accent)' : '#94a3b8' }} /></span>
                  <span className={s.mono}>{FS_MS[cores][g]} ms</span>
                </div>
              ))}
              {cores === 8 && <div className={c.thr} style={{ fontWeight: local ? 800 : 500 }}><span>{t('local', 'cục bộ')}</span><span className={c.thrTrack}><span className={c.thrFill} style={{ display: 'block', width: `${(100 * FS_MS[8].local!) / FS_MS[8][8]}%`, background: local ? 'var(--ol-ok)' : '#94a3b8' }} /></span><span className={s.mono}>{FS_MS[8].local} ms</span></div>}
            </div>
            <div className={s.small} style={{ marginTop: 6 }}>
              {t(`1 thread: ${FS_ONE_THREAD} ms at any gap. getconf LEVEL1_DCACHE_LINESIZE says ${GETCONF}, yet 64 B apart is still slow (${FS_MS[cores][64]} ms) and only 128 B is fast — this M1 really moves ${REAL_LINE}-byte lines.`, `1 luồng: ${FS_ONE_THREAD} ms ở mọi khoảng cách. getconf LEVEL1_DCACHE_LINESIZE báo ${GETCONF}, vậy mà cách 64 B vẫn chậm (${FS_MS[cores][64]} ms), chỉ 128 B mới nhanh — M1 này thật ra chuyển dòng ${REAL_LINE} byte.`)}
              {realShared && line === 64 && gap === 64 && <b> {t('With the REAL 128-B line these counters still share — switch the line size to see it.', 'Với dòng THẬT 128 B các bộ đếm này vẫn chung dòng — đổi cỡ dòng để thấy.')}</b>}
            </div>
          </div>
          {java ? (
            <div className={s.panel}>
              <div className={s.panelTitle}>{t('Java, 4 threads × 50 M increments (c46)', 'Java, 4 luồng × 50 triệu lần cộng (c46)')}</div>
              <table className={cx(s.tbl, s.compact)}><tbody>
                <tr><td>AtomicLongArray, {t('adjacent', 'kề nhau')}</td><td className={s.num}><b style={{ color: 'var(--ol-bad)' }}>{JAVA.adjacent} ms</b></td></tr>
                <tr><td>{t('padded 16 longs (128 B)', 'đệm 16 long (128 B)')}</td><td className={s.num}>{JAVA.padded} ms</td></tr>
                <tr><td>LongAdder</td><td className={s.num}>{JAVA.adder} ms</td></tr>
                <tr><td>{t('local, add once at the end', 'cục bộ, cộng một lần cuối')}</td><td className={s.num}><b style={{ color: 'var(--ol-ok)' }}>{JAVA.local} ms</b></td></tr>
              </tbody></table>
            </div>
          ) : (
            <div className={s.small}>{t(`perf stat, 4 threads: task-clock ${PERF.false.taskClock} ms when sharing vs ${PERF.padded.taskClock} ms padded — the cores are BUSY waiting for lines, not idle.`, `perf stat, 4 luồng: task-clock ${PERF.false.taskClock} ms khi chung dòng vs ${PERF.padded.taskClock} ms khi đệm — các lõi BẬN chờ dòng, không phải ngồi không.`)}</div>
          )}
          <WhereBox focus="false-sharing" lang={lang} height={180} />
        </div>
      </div>
    </Frame>
  );
}
