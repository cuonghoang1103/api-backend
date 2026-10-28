'use client';
/** Bộ nhớ ảo: địa chỉ ảo → TLB → bảng trang → khung vật lý; lỗi trang; thay trang; thanh trượt "thiếu RAM" cho thấy thrashing. */
import { useMemo, useState } from 'react';
import { REF_PRESETS, VM_PRESETS, REGIONS, LAT, replace, translate, type Algo } from './engine/vm';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { useEffect, useRef } from 'react';

const REG_COLOR: Record<string, string> = { code: '#b45309', data: '#2563eb', heap: '#059669', stack: '#dc2626', none: '#94a3b8' };
const fmtNs = (ns: number) => (ns >= 1e6 ? `${(ns / 1e6).toFixed(2)} ms` : ns >= 1e3 ? `${(ns / 1e3).toFixed(1)} µs` : `${Math.round(ns)} ns`);

function Translate({ lang, preset }: { lang: Lang; preset: string }) {
  const [pk, setPk] = useState(preset in VM_PRESETS ? preset : 'program');
  const [frames, setFrames] = useState(VM_PRESETS[pk].frames);
  const [algo, setAlgo] = useState<'fifo' | 'lru' | 'clock'>('lru');
  const accs = VM_PRESETS[pk].accs;
  const snaps = useMemo(() => translate(accs, frames, algo), [accs, frames, algo]);
  const p = usePlayer(snaps.length, 1700);
  const S = snaps[Math.min(p.i, snaps.length - 1)];
  const bits = S.acc ? S.acc.va.toString(2).padStart(16, '0') : '0'.repeat(16);

  let msgEn = 'Each step is one memory access by the program. Press Step.', msgVi = 'Mỗi bước là một lần chương trình truy cập bộ nhớ. Bấm Bước.';
  let tone: 'ok' | 'bad' | 'warn' | undefined;
  if (S.acc) {
    const va = `0x${S.acc.va.toString(16).padStart(4, '0')}`, rw = S.acc.w ? tx(lang, 'write', 'ghi') : tx(lang, 'read', 'đọc');
    const head = `${rw} ${va}${S.acc.note ? ` (${S.acc.note})` : ''}: VPN ${S.vpn}, offset 0x${S.off.toString(16)}. `;
    if (S.fault === 'segv') { tone = 'bad'; msgEn = head + `Page ${S.vpn} is not part of any mapping → the kernel sends SIGSEGV ("Segmentation fault", exit 139).`; msgVi = head + `Trang ${S.vpn} không thuộc vùng ánh xạ nào → nhân gửi SIGSEGV ("Segmentation fault", mã thoát 139).`; }
    else {
      const t1en = S.tlbHit ? 'TLB hit — translation in ~1 ns.' : 'TLB miss → walk the page table in RAM.';
      const t1vi = S.tlbHit ? 'Trúng TLB — dịch địa chỉ ~1 ns.' : 'Trượt TLB → đi bảng trang trong RAM.';
      let fen = '', fvi = '';
      if (S.fault === 'minor') { tone = 'warn'; fen = ` Page not present → MINOR page fault: the kernel grabs a free frame${S.victim ? '' : ''} and fills it with zeros (no disk).`; fvi = ' Trang chưa có → lỗi trang MINOR: nhân lấy một khung trống và điền số 0 (không đụng đĩa).'; }
      if (S.fault === 'major') { tone = 'bad'; fen = ' Page not present and its data is on disk/swap → MAJOR page fault: the process sleeps (state D) while the kernel reads it (~100 µs on SSD, ~10 ms on HDD).'; fvi = ' Trang chưa có và dữ liệu nằm trên đĩa/swap → lỗi trang MAJOR: tiến trình ngủ (trạng thái D) trong khi nhân đọc nó (~100 µs trên SSD, ~10 ms trên HDD).'; }
      if (S.victim) { fen += ` RAM full: evicted page ${S.victim.vpn}${S.victim.dirty ? ' (dirty → written to swap first)' : ' (clean → just dropped)'}.`; fvi += ` RAM đầy: đẩy trang ${S.victim.vpn} ra${S.victim.dirty ? ' (bẩn → phải ghi ra swap trước)' : ' (sạch → bỏ luôn)'}.`; }
      msgEn = head + t1en + fen + ` Physical address 0x${(S.pa ?? 0).toString(16)}. This access: ${fmtNs(S.cost)}.`;
      msgVi = head + t1vi + fvi + ` Địa chỉ vật lý 0x${(S.pa ?? 0).toString(16)}. Lần truy cập này: ${fmtNs(S.cost)}.`;
      if (!S.fault || S.fault === 'none') tone = S.tlbHit ? 'ok' : undefined;
    }
  }
  const n = Math.max(1, S.i);
  useLabBridge('vm', {
    preset: pk, frames, algo, i: p.i, vpn: S.acc ? S.vpn : -1, tlbHit: S.acc ? !!S.tlbHit : null, fault: S.acc ? (S.fault ?? 'none') : null,
    minor: S.counts.minor, major: S.counts.major,
  }, {
    load: (k) => { const v = String(k); if (VM_PRESETS[v]) { setPk(v); setFrames(VM_PRESETS[v].frames); p.reset(); } },
    frames: (v) => { setFrames(Number(v)); p.reset(); }, algo: (v) => { setAlgo(v as 'fifo' | 'lru' | 'clock'); p.reset(); },
  });
  // TLB trúng = "ting", lỗi trang = "bộp", segfault = "bịch"
  useOwnStepSound();
  const lastI = useRef(p.i);
  useEffect(() => {
    if (p.i > lastI.current && S.acc) labSfx(S.fault === 'segv' ? 'thud' : S.fault === 'major' || S.fault === 'minor' ? 'miss' : S.tlbHit ? 'hit' : 'tick');
    lastI.current = p.i;
  }, [p.i, S]);

  return (
    <>
      <div className={s.bar} data-tour="vm-config">
        <span className={s.lbl}>{tx(lang, 'Scenario', 'Kịch bản')}
          <select value={pk} onChange={(e) => { setPk(e.target.value); setFrames(VM_PRESETS[e.target.value].frames); p.reset(); }}>
            {Object.entries(VM_PRESETS).map(([k, v]) => <option key={k} value={k}>{tx(lang, v.en, v.vi)}</option>)}
          </select></span>
        <span className={s.lbl}>{tx(lang, 'Free RAM frames', 'Khung RAM còn trống')}
          <input type="range" min={2} max={8} value={frames} onChange={(e) => { setFrames(Number(e.target.value)); p.reset(); }} /><b>{frames}</b></span>
        <Seg label={tx(lang, 'Eviction', 'Thay trang')} value={algo} options={[['fifo', 'FIFO'], ['lru', 'LRU'], ['clock', 'Clock']]} onChange={(v) => { setAlgo(v); p.reset(); }} />
      </div>
      <Controls p={p} lang={lang} />
      <Explain tone={tone}>{tx(lang, msgEn, msgVi)}</Explain>
      <div className={s.panel} style={{ marginTop: 10 }} data-tour="vm-address">
        <div className={s.panelTitle}>{tx(lang, 'Virtual address (16-bit toy; real x86-64 uses 48 bits: 4 × 9-bit levels + 12-bit offset)', 'Địa chỉ ảo (đồ chơi 16 bit; x86-64 thật dùng 48 bit: 4 cấp × 9 bit + 12 bit offset)')}</div>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {bits.split('').map((b, k) => (
            <span key={k} className={s.mono} style={{ width: 24, textAlign: 'center', padding: '3px 0', borderRadius: 4, fontWeight: 800, background: k < 4 ? 'var(--ol-accent-bg)' : 'var(--ol-panel2)', color: k < 4 ? 'var(--ol-accent)' : 'var(--ol-text)', marginRight: k === 3 ? 8 : 0 }}>{b}</span>
          ))}
        </div>
        <div className={s.small}>{tx(lang, 'blue: page number (VPN) → translated · grey: offset inside the 4 KiB page → copied unchanged', 'xanh: số trang (VPN) → được dịch · xám: vị trí trong trang 4 KiB → giữ nguyên')}</div>
      </div>
      <div className={s.grid3} style={{ marginTop: 10, alignItems: 'start' }}>
        <div className={s.panel} data-tour="vm-tlb">
          <div className={s.panelTitle}>TLB (4)</div>
          <table className={s.tbl}><thead><tr><th>VPN</th><th>{tx(lang, 'frame', 'khung')}</th></tr></thead>
            <tbody>{Array.from({ length: 4 }, (_, k) => S.tlb[k]).map((e, k) => (
              <tr key={k} className={e && e.vpn === S.vpn && S.acc && S.fault !== 'segv' ? s.hl : undefined}><td className={s.mono}>{e ? e.vpn : '—'}</td><td className={s.mono}>{e ? e.frame : '—'}</td></tr>
            ))}</tbody></table>
          <div className={s.kpis} style={{ marginTop: 8 }}>
            <Kpi k={tx(lang, 'TLB hit rate', 'tỉ lệ trúng TLB')} v={`${Math.round((100 * S.counts.tlbHit) / Math.max(1, S.counts.tlbHit + S.counts.tlbMiss))}%`} tone={S.counts.tlbHit >= S.counts.tlbMiss ? 'ok' : 'warn'} />
          </div>
        </div>
        <div className={s.panel} data-tour="vm-pagetable">
          <div className={s.panelTitle}>{tx(lang, 'Page table of this process', 'Bảng trang của tiến trình')}</div>
          <div>
            <table className={cx(s.tbl, s.compact)}><thead><tr><th>VPN</th><th>{tx(lang, 'region', 'vùng')}</th><th>P</th><th>{tx(lang, 'frame', 'khung')}</th><th>D</th></tr></thead>
              <tbody>{S.pt.map((e, k) => (
                <tr key={k} className={S.acc && k === S.vpn ? s.hl : undefined} style={{ opacity: e.region === 'none' ? 0.45 : 1 }}>
                  <td className={s.mono}>{k}</td>
                  <td><span style={{ color: REG_COLOR[e.region], fontWeight: 700 }}>{e.region === 'none' ? tx(lang, 'unmapped', 'chưa ánh xạ') : e.region}</span></td>
                  <td className={s.mono}>{e.present ? '1' : '0'}</td>
                  <td className={s.mono}>{e.present ? e.frame : e.swapped ? 'swap' : '—'}</td>
                  <td className={s.mono}>{e.present && e.dirty ? '1' : ''}</td>
                </tr>
              ))}</tbody></table>
          </div>
        </div>
        <div className={s.panel} data-tour="vm-frames">
          <div className={s.panelTitle}>{tx(lang, 'Physical RAM frames', 'Khung RAM vật lý')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 6 }}>
            {S.frames.map((v, k) => (
              <div key={k} style={{ border: `2px solid ${v !== null ? REG_COLOR[REGIONS[v]] : 'var(--ol-border)'}`, borderStyle: v === null ? 'dashed' : 'solid', borderRadius: 8, padding: '5px 7px', background: S.frame === k && S.acc ? 'var(--ol-hl)' : 'var(--ol-bg)' }}>
                <div className={s.small}>{tx(lang, 'frame', 'khung')} {k}</div>
                <div className={s.mono} style={{ fontWeight: 800 }}>{v === null ? tx(lang, 'free', 'trống') : `VPN ${v}`}</div>
              </div>
            ))}
          </div>
          <div className={s.small} style={{ marginTop: 8 }}>swap: {S.swap.length ? S.swap.map((v) => `VPN ${v}`).join(', ') : tx(lang, 'empty', 'trống')}</div>
          <div className={s.kpis} style={{ marginTop: 8 }}>
            <Kpi k={tx(lang, 'minor faults', 'lỗi trang minor')} v={S.counts.minor} />
            <Kpi k={tx(lang, 'major faults', 'lỗi trang major')} v={S.counts.major} tone={S.counts.major ? 'bad' : undefined} />
            <Kpi k={tx(lang, 'avg per access', 'TB mỗi truy cập')} v={fmtNs(S.total / n)} tone={S.total / n > 10_000 ? 'bad' : S.total / n > 1_000 ? 'warn' : 'ok'} />
          </div>
        </div>
      </div>
    </>
  );
}

function Thrash({ lang, preset }: { lang: Lang; preset: string }) {
  const [pk, setPk] = useState(preset in REF_PRESETS ? preset : 'exam');
  const [refsText, setRefsText] = useState(REF_PRESETS[pk].refs.join(' '));
  const [frames, setFrames] = useState(REF_PRESETS[pk].frames);
  const [algo, setAlgo] = useState<Algo>('fifo');
  const refs = useMemo(() => refsText.split(/[\s,]+/).map(Number).filter((x) => Number.isFinite(x) && x >= 0 && x < 100).slice(0, 40), [refsText]);
  const steps = useMemo(() => replace(refs, frames, algo), [refs, frames, algo]);
  const p = usePlayer(steps.length + 1, 700);
  const upto = p.i; // số cột đã hiện
  const faults = steps.slice(0, upto).filter((x) => !x.hit).length;
  const curve = useMemo(() => Array.from({ length: 8 }, (_, k) => replace(refs, k + 1, algo).filter((x) => !x.hit).length), [refs, algo]);
  const ws = new Set(refs).size;
  // thời gian trung bình mỗi truy cập: trúng = RAM, trượt = đọc swap/đĩa
  const eat = (f: number) => (refs.length ? ((refs.length - f) * LAT.ram + f * LAT.major) / refs.length : 0);
  const totalFaults = steps.filter((x) => !x.hit).length;
  const slow = eat(totalFaults) / LAT.ram;
  useLabBridge('thrash', { preset: pk, frames, algo, faults: totalFaults, ws, shown: upto, thrashing: frames < ws && totalFaults > refs.length * 0.6 }, {
    load: (k) => { const v = String(k); if (REF_PRESETS[v]) { setPk(v); setRefsText(REF_PRESETS[v].refs.join(' ')); setFrames(REF_PRESETS[v].frames); p.reset(); } },
    frames: (v) => { setFrames(Number(v)); p.reset(); }, algo: (v) => { setAlgo(v as Algo); p.reset(); },
  });

  return (
    <>
      <div className={s.bar}>
        <span className={s.lbl}>{tx(lang, 'Preset', 'Mẫu')}
          <select value={pk} onChange={(e) => { const v = e.target.value; setPk(v); setRefsText(REF_PRESETS[v].refs.join(' ')); setFrames(REF_PRESETS[v].frames); p.reset(); }}>
            {Object.entries(REF_PRESETS).map(([k, v]) => <option key={k} value={k}>{tx(lang, v.en, v.vi)}</option>)}
          </select></span>
        <Seg label={tx(lang, 'Algorithm', 'Thuật toán')} value={algo} options={[['fifo', 'FIFO'], ['lru', 'LRU'], ['opt', 'OPT'], ['clock', 'Clock']]} onChange={(v) => { setAlgo(v); p.reset(); }} />
      </div>
      <div className={s.bar}>
        <span className={s.lbl} style={{ flex: '1 1 260px' }}>{tx(lang, 'Reference string', 'Chuỗi tham chiếu')}
          <input type="text" value={refsText} onChange={(e) => { setRefsText(e.target.value); p.reset(); }} style={{ flex: 1, minWidth: 180 }} /></span>
        <span className={s.lbl} data-tour="thrash-frames">{tx(lang, 'RAM frames (RAM pressure ←)', 'Số khung RAM (← thiếu RAM)')}
          <input type="range" min={1} max={8} value={frames} onChange={(e) => { setFrames(Number(e.target.value)); p.reset(); }} /><b>{frames}</b></span>
      </div>
      <Controls p={p} lang={lang} label={tx(lang, `${upto}/${steps.length} references · ${faults} faults`, `${upto}/${steps.length} tham chiếu · ${faults} lỗi trang`)} />
      <div className={s.scrollX} data-tour="thrash-table">
        <table className={s.tbl} style={{ width: 'auto' }}>
          <tbody>
            <tr><th>{tx(lang, 'ref', 'tham chiếu')}</th>{steps.map((x, k) => <th key={k} className={s.mono} style={{ textAlign: 'center', opacity: k < upto ? 1 : 0.35 }}>{x.ref}</th>)}</tr>
            {Array.from({ length: frames }, (_, f) => (
              <tr key={f}><th>{tx(lang, 'frame', 'khung')} {f}</th>{steps.map((x, k) => (
                <td key={k} className={s.mono} style={{ textAlign: 'center', minWidth: 26, background: k < upto && !x.hit && x.frames[f] === x.ref ? 'var(--ol-bad-bg)' : undefined, fontWeight: x.frames[f] === x.ref && k < upto ? 800 : 400 }}>{k < upto ? (x.frames[f] ?? '') : ''}</td>
              ))}</tr>
            ))}
            <tr><th>{tx(lang, 'fault?', 'lỗi?')}</th>{steps.map((x, k) => <td key={k} style={{ textAlign: 'center', color: x.hit ? 'var(--ol-ok)' : 'var(--ol-bad)', fontWeight: 800 }}>{k < upto ? (x.hit ? '✓' : 'F') : ''}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <div className={s.grid2} style={{ marginTop: 10 }}>
        <div className={s.panel} data-tour="thrash-curve">
          <div className={s.panelTitle}>{tx(lang, `Page faults vs RAM frames (${algo.toUpperCase()})`, `Lỗi trang theo số khung RAM (${algo.toUpperCase()})`)}</div>
          <svg width="100%" height={170} viewBox="0 0 360 170" role="img" aria-label="faults vs frames">
            {curve.map((v, k) => {
              const max = Math.max(1, ...curve), h = (v / max) * 110, x = 20 + k * 42;
              return (
                <g key={k}>
                  <rect x={x} y={130 - h} width={30} height={h} rx={3} fill={k + 1 === frames ? 'var(--ol-accent)' : k + 1 < ws ? 'var(--ol-bad)' : 'var(--ol-ok)'} opacity={0.85} />
                  <text x={x + 15} y={124 - h} fontSize={11} textAnchor="middle" className={s.svgText}>{v}</text>
                  <text x={x + 15} y={146} fontSize={11} textAnchor="middle" className={s.svgMuted}>{k + 1}</text>
                </g>
              );
            })}
            <text x={20} y={164} fontSize={10.5} className={s.svgMuted}>{tx(lang, `frames · ${ws} distinct pages · red = fewer frames than pages in use`, `khung · ${ws} trang khác nhau · đỏ = ít khung hơn số trang đang dùng`)}</text>
          </svg>
        </div>
        <div className={s.stack}>
          <div className={s.kpis} data-tour="thrash-kpis">
            <Kpi k={tx(lang, 'faults (whole string)', 'lỗi trang (cả chuỗi)')} v={totalFaults} tone={totalFaults > ws ? 'bad' : 'ok'} />
            <Kpi k={tx(lang, 'avg time per access', 'TB mỗi truy cập')} v={fmtNs(eat(totalFaults))} tone={slow > 100 ? 'bad' : slow > 5 ? 'warn' : 'ok'} />
            <Kpi k={tx(lang, 'slower than all-in-RAM', 'chậm hơn khi đủ RAM')} v={`×${Math.round(slow)}`} tone={slow > 100 ? 'bad' : slow > 5 ? 'warn' : 'ok'} />
          </div>
          <Explain tone={frames < ws && totalFaults > refs.length * 0.6 ? 'bad' : undefined}>
            {frames < ws && totalFaults > refs.length * 0.6
              ? tx(lang, `THRASHING: the program keeps using ${ws} pages but only ${frames} fit in RAM, so almost every access evicts a page it will need again soon. The CPU sits idle waiting for the disk; vmstat shows high si/so and wa. Fix: give it RAM, use less memory, or run fewer things at once — a faster CPU does not help.`,
                `THRASHING: chương trình liên tục dùng ${ws} trang mà RAM chỉ chứa ${frames}, nên gần như lần truy cập nào cũng đẩy ra một trang sắp cần lại. CPU ngồi không chờ đĩa; vmstat hiện si/so và wa cao. Cách chữa: thêm RAM, dùng ít bộ nhớ hơn, hoặc chạy ít việc cùng lúc — CPU nhanh hơn chẳng giúp gì.`)
              : tx(lang, 'Each fault costs ~100 µs (an SSD read) versus ~100 ns for a RAM hit — a factor of 1,000. A few faults are invisible; a fault on most accesses makes the machine feel frozen. Drag the frames slider left to feel it.',
                'Mỗi lỗi trang tốn ~100 µs (một lần đọc SSD) so với ~100 ns khi trúng RAM — gấp 1.000 lần. Vài lỗi thì không thấy gì; lỗi ở hầu hết các lần truy cập thì máy như đơ. Kéo thanh số khung sang trái để cảm nhận.')}
          </Explain>
          <div className={s.small}>{tx(lang, 'OPT (Bélády 1966) evicts the page used farthest in the future — impossible in practice, but the lower bound every real algorithm is measured against.', 'OPT (Bélády 1966) đẩy ra trang sẽ được dùng xa nhất trong tương lai — không làm được trong thực tế, nhưng là cận dưới để so mọi thuật toán thật.')}</div>
        </div>
      </div>
    </>
  );
}

export default function VirtualMemorySim({ lang = 'vi', preset = 'program' }: { lang?: Lang; preset?: string }) {
  const [tab, setTab] = useState<'tr' | 'rep'>(preset in REF_PRESETS ? 'rep' : 'tr');
  useLabBridge('vmtab', { tab }, { tab: (v) => setTab(v === 'rep' ? 'rep' : 'tr') });
  return (
    <Frame badge={tx(lang, 'OS lab', 'Phòng lab OS')} title={tx(lang, 'Virtual memory', 'Bộ nhớ ảo')} sub={tx(lang, 'From a pointer in your code to a byte in RAM — and why too little RAM makes everything crawl', 'Từ một con trỏ trong code tới một byte trong RAM — và vì sao thiếu RAM làm mọi thứ bò như rùa')}>
      <div className={s.tabs} role="tablist" data-tour="tabs">
        <button type="button" role="tab" className={cx(s.tab, tab === 'tr' && s.on)} onClick={() => setTab('tr')}>{tx(lang, 'Address translation & page faults', 'Dịch địa chỉ & lỗi trang')}</button>
        <button type="button" role="tab" className={cx(s.tab, tab === 'rep' && s.on)} onClick={() => setTab('rep')}>{tx(lang, 'Page replacement & thrashing', 'Thay trang & thrashing')}</button>
      </div>
      {tab === 'tr' ? <Translate lang={lang} preset={preset} /> : <Thrash lang={lang} preset={preset} />}
      <div className={s.small} style={{ marginTop: 8 }}>{tx(lang, 'Times are orders of magnitude for comparison (RAM ~100 ns, minor fault ~1 µs, SSD read ~100 µs), not measurements.', 'Thời gian là cỡ độ lớn để so sánh (RAM ~100 ns, lỗi trang minor ~1 µs, đọc SSD ~100 µs), không phải số đo.')}</div>
    </Frame>
  );
}
