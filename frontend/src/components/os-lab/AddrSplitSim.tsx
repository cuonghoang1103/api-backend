'use client';
/**
 * Tách bit địa chỉ ảo & cỡ bảng trang (bài 16.4): dải bit tô màu theo trường, lời giải từng bước kiểu đề thi
 * (hex → nhị phân → offset → chỉ số từng cấp → đi bảng → địa chỉ vật lý), máy tính cỡ bảng trang một mức vs nhiều mức,
 * TLB (EAT, TLB reach) và phân đoạn (base + limit, trap). Engine: engine/addr.ts (khớp osgcalc.py, c164/c168).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { eat, fmtBytes, hex, log2i, multiLevel, pageTableSize, parseAddr, segTranslate, splitVA, tlbReach } from './engine/addr';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab3.module.css';

type View = 'split' | 'table' | 'tlb' | 'seg';
const FIELD_COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#db2777'];
const OFF_COLOR = '#d97706';
const LAYOUTS: Array<[string, number[]]> = [['10/10/12', [10, 10, 12]], ['9/11/12', [9, 11, 12]], ['8/12/12', [8, 12, 12]], ['20/12', [20, 12]], ['9/9/9/9/12', [9, 9, 9, 9, 12]]];
const PRESET: Record<string, { view: View; va: string; bits: number[] }> = {
  split: { view: 'split', va: '0x12345678', bits: [10, 10, 12] },
  x64: { view: 'split', va: '0x00007FFDE3A41F28', bits: [9, 9, 9, 9, 12] },
  table: { view: 'table', va: '0x12345678', bits: [10, 10, 12] },
  tlb: { view: 'tlb', va: '0x12345678', bits: [10, 10, 12] },
  seg: { view: 'seg', va: '0x12345678', bits: [10, 10, 12] },
};
const SEG_TABLE: Array<[number, number]> = [[2100, 500], [3800, 120], [900, 300], [5000, 750]];
const FRAME_EXAMPLE = 0x3a7; // khung minh hoạ cho bước "đi bảng" — ghi rõ là giả định

interface Step { en: string; vi: string; hl?: number | 'all' | 'walk'; tone?: 'ok' | 'bad' | 'warn' }

export default function AddrSplitSim({ lang = 'vi', preset = 'split' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const P0 = PRESET[preset] ?? PRESET.split;
  const [view, setView] = useState<View>(P0.view);
  const [vaText, setVaText] = useState(P0.va);
  const [bits, setBits] = useState<number[]>(P0.bits);
  const [bitsText, setBitsText] = useState(P0.bits.join(','));
  // bảng trang
  const [vaBits, setVaBits] = useState(32);
  const [pageLog, setPageLog] = useState(12);
  const [pte, setPte] = useState(4);
  // TLB
  const [tlbNs, setTlbNs] = useState(10);
  const [memNs, setMemNs] = useState(80);
  const [hit, setHit] = useState(95);
  const [levels, setLevels] = useState(1);
  // phân đoạn
  const [segNo, setSegNo] = useState(2);
  const [segOff, setSegOff] = useState(250);

  const va = parseAddr(vaText) ?? BigInt(0);
  const SP = useMemo(() => splitVA(va, bits), [va, bits]);
  const offBits = bits[bits.length - 1];
  const pageBytes = 2 ** pageLog;
  const T1 = pageTableSize(vaBits, pageBytes, pte);
  const perLevel = log2i(pageBytes / pte);
  const nLevels = Math.max(1, Math.ceil(T1.vpnBits / perLevel));
  const mlBits = [...Array.from({ length: nLevels }, (_, k) => (k === 0 ? T1.vpnBits - perLevel * (nLevels - 1) : perLevel)), pageLog];
  const topVA = BigInt(1) << BigInt(vaBits);
  const ML = multiLevel(mlBits, pte, [[BigInt(0), BigInt(4) << BigInt(20)], [topVA - BigInt(pageBytes), topVA]]);
  const E = eat(tlbNs, memNs, hit / 100, levels);
  const SG = segTranslate(SEG_TABLE, segNo, segOff);

  const steps: Step[] = useMemo(() => {
    if (view === 'split') {
      const out: Step[] = [{ hl: 'all', en: `Write ${hex(va)} in binary, one hex digit = 4 bits: ${SP.bin.match(/.{1,4}/g)!.join(' ')} (${SP.total} bits).`, vi: `Viết ${hex(va)} ra nhị phân, mỗi chữ số hex = 4 bit: ${SP.bin.match(/.{1,4}/g)!.join(' ')} (${SP.total} bit).` }];
      const off = SP.fields[SP.fields.length - 1];
      out.push({ hl: SP.fields.length - 1, en: `Offset = the lowest ${offBits} bits (page size 2^${offBits} = ${fmtBytes(2 ** offBits)}): ${off.bin} = ${off.value} = ${hex(off.value)}. The offset is copied unchanged into the physical address.`, vi: `Offset = ${offBits} bit thấp nhất (trang 2^${offBits} = ${fmtBytes(2 ** offBits)}): ${off.bin} = ${off.value} = ${hex(off.value)}. Offset được chép nguyên vào địa chỉ vật lý.` });
      SP.fields.slice(0, -1).forEach((f, k) => out.push({ hl: k, en: `${f.name} = bits ${f.hi}…${f.lo} = ${f.bin} = ${f.value}${k === 0 ? ` — index into the top-level table (2^${f.bits} = ${2 ** f.bits} entries)` : ` — index into a level-${k + 1} table`}.`, vi: `${f.name} = bit ${f.hi}…${f.lo} = ${f.bin} = ${f.value}${k === 0 ? ` — chỉ số trong bảng cấp trên cùng (2^${f.bits} = ${2 ** f.bits} mục)` : ` — chỉ số trong bảng cấp ${k + 1}`}.` }));
      const idx = SP.fields.slice(0, -1).map((f) => `[${f.value}]`).join('');
      const pa = (BigInt(FRAME_EXAMPLE) << BigInt(offBits)) | BigInt(off.value);
      out.push({ hl: 'walk', tone: 'ok', en: `The MMU walks: register → table${idx} → frame. If that last entry says frame ${hex(FRAME_EXAMPLE)} (an example), PA = ${hex(FRAME_EXAMPLE)} × 2^${offBits} + ${hex(off.value)} = ${hex(pa)}. ${SP.fields.length - 1} memory reads before the real one — that is why the TLB exists.`, vi: `MMU đi bảng: thanh ghi → bảng${idx} → khung. Giả sử mục cuối ghi khung ${hex(FRAME_EXAMPLE)} (ví dụ), PA = ${hex(FRAME_EXAMPLE)} × 2^${offBits} + ${hex(off.value)} = ${hex(pa)}. ${SP.fields.length - 1} lần đọc bộ nhớ trước lần đọc thật — vì thế mới cần TLB.` });
      return out;
    }
    if (view === 'table') {
      const lv = ML.levels.map((l) => `${l.tables} × ${fmtBytes(l.bytesEach)}`).join(' + ');
      return [
        { en: `Offset bits = log2(page size) = log2(${pageBytes}) = ${T1.offBits}.`, vi: `Số bit offset = log2(cỡ trang) = log2(${pageBytes}) = ${T1.offBits}.` },
        { en: `Page-number bits = ${vaBits} − ${T1.offBits} = ${T1.vpnBits} ⇒ 2^${T1.vpnBits} = ${T1.pages.toLocaleString('en-US')} pages.`, vi: `Số bit số trang = ${vaBits} − ${T1.offBits} = ${T1.vpnBits} ⇒ 2^${T1.vpnBits} = ${T1.pages.toLocaleString('vi-VN')} trang.` },
        { tone: 'warn', en: `ONE-level table: one ${pte}-byte entry per page = ${T1.pages.toLocaleString('en-US')} × ${pte} B = ${fmtBytes(T1.bytes)} — per process, even if it uses almost nothing.`, vi: `Bảng MỘT mức: mỗi trang một mục ${pte} byte = ${T1.pages.toLocaleString('vi-VN')} × ${pte} B = ${fmtBytes(T1.bytes)} — cho MỖI tiến trình, kể cả khi nó gần như không dùng gì.` },
        { en: `Multi-level: make every table exactly one page: ${pageBytes} / ${pte} = ${pageBytes / pte} entries = ${perLevel} bits per level ⇒ ${nLevels} level${nLevels > 1 ? 's' : ''} (${mlBits.join('/')}).`, vi: `Nhiều mức: cho mỗi bảng vừa đúng một trang: ${pageBytes} / ${pte} = ${pageBytes / pte} mục = ${perLevel} bit mỗi mức ⇒ ${nLevels} mức (${mlBits.join('/')}).` },
        { tone: 'ok', en: `A process with 4 MiB of code at the bottom and one stack page at the top needs only ${lv} = ${fmtBytes(ML.bytes)} of tables: missing sub-tables are simply "not present".`, vi: `Một tiến trình có 4 MiB mã ở đáy và một trang stack ở đỉnh chỉ cần ${lv} = ${fmtBytes(ML.bytes)} bảng: bảng con nào không dùng thì đơn giản là "không có mặt".` },
      ];
    }
    if (view === 'tlb') return [
      { en: `TLB hit: look in the TLB (${tlbNs} ns) + read the data (${memNs} ns) = ${E.hit} ns.`, vi: `TLB trúng: tra TLB (${tlbNs} ns) + đọc dữ liệu (${memNs} ns) = ${E.hit} ns.` },
      { tone: 'warn', en: `TLB miss: ${tlbNs} + ${levels} page-table read${levels > 1 ? 's' : ''} × ${memNs} + ${memNs} = ${E.miss} ns.`, vi: `TLB trượt: ${tlbNs} + ${levels} lần đọc bảng trang × ${memNs} + ${memNs} = ${E.miss} ns.` },
      { tone: 'ok', en: `EAT = ${hit / 100} × ${E.hit} + ${(1 - hit / 100).toFixed(2)} × ${E.miss} = ${+E.eat.toFixed(2)} ns (vs ${memNs} ns with no paging, ${(((E.eat - memNs) / memNs) * 100).toFixed(0)} % slower).`, vi: `EAT = ${hit / 100} × ${E.hit} + ${(1 - hit / 100).toFixed(2)} × ${E.miss} = ${+E.eat.toFixed(2)} ns (so với ${memNs} ns khi không phân trang, chậm hơn ${(((E.eat - memNs) / memNs) * 100).toFixed(0)} %).` },
      { en: `TLB reach = entries × page size: 64 × 4 KiB = ${fmtBytes(tlbReach(64, 4096))}; with 2 MiB huge pages ${fmtBytes(tlbReach(64, 2 << 20))}. A working set bigger than the reach misses all the time.`, vi: `Phạm vi TLB = số mục × cỡ trang: 64 × 4 KiB = ${fmtBytes(tlbReach(64, 4096))}; với trang lớn 2 MiB là ${fmtBytes(tlbReach(64, 2 << 20))}. Tập làm việc lớn hơn phạm vi đó thì trượt liên tục.` },
    ];
    const [base, limit] = SEG_TABLE[segNo];
    return [
      { en: `Logical address = (segment ${segNo}, offset ${segOff}). Look up row ${segNo}: base ${base}, limit ${limit}.`, vi: `Địa chỉ logic = (đoạn ${segNo}, offset ${segOff}). Tra dòng ${segNo}: base ${base}, limit ${limit}.` },
      SG.ok ? { en: `Check first: ${segOff} < ${limit} — inside the segment.`, vi: `Kiểm trước: ${segOff} < ${limit} — nằm trong đoạn.` } : { tone: 'bad', en: `Check first: ${segOff} ≥ ${limit} — outside the segment!`, vi: `Kiểm trước: ${segOff} ≥ ${limit} — vượt ra ngoài đoạn!` },
      SG.ok ? { tone: 'ok', en: `Physical = base + offset = ${base} + ${segOff} = ${SG.phys}.`, vi: `Địa chỉ vật lý = base + offset = ${base} + ${segOff} = ${SG.phys}.` } : { tone: 'bad', en: 'TRAP: the hardware raises an addressing error (segmentation fault) — no physical address is formed.', vi: 'TRAP: phần cứng báo lỗi địa chỉ (segmentation fault) — không tạo ra địa chỉ vật lý nào.' },
    ];
  }, [view, va, SP, offBits, pageBytes, T1, vaBits, pte, perLevel, nLevels, mlBits.join(), ML, tlbNs, memNs, hit, levels, E, segNo, segOff, SG]); // eslint-disable-line react-hooks/exhaustive-deps

  const p = usePlayer(steps.length, 1700);
  const i = Math.min(p.i, steps.length - 1);
  const st = steps[i];
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => { if (p.i !== prev.current) labSfx(st.tone === 'bad' ? 'oops' : st.tone === 'ok' ? 'hit' : 'blip-decode'); prev.current = p.i; }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { p.reset(); }, [view, vaText, bits.join(), vaBits, pageLog, pte, segNo, segOff]); // eslint-disable-line react-hooks/exhaustive-deps

  const setLayout = (b: number[]) => { setBits(b); setBitsText(b.join(',')); labSfx('tap'); };
  const bitsOk = (txt: string) => { const b = txt.split(/[\s,/]+/).map(Number).filter((x) => Number.isInteger(x) && x > 0); return b.length >= 2 && b.reduce((a, x) => a + x, 0) <= 64 ? b : null; };
  useLabBridge('addr', {
    view, va: hex(va), bits: bits.join('/'), i: p.i, atEnd: p.atEnd, idx: SP.fields.map((f) => f.value).join('/'),
    table: Number(T1.bytes), multi: Number(ML.bytes), eat: +E.eat.toFixed(2), levels, hit, trap: !SG.ok, phys: SG.ok ? SG.phys : -1, seg: segNo, off: segOff,
  }, {
    view: (v) => { setView(v as View); labSfx('tap'); }, va: (v) => setVaText(String(v)), bits: (v) => { const b = bitsOk(String(v)); if (b) setLayout(b); },
    hit: (v) => setHit(Number(v)), levels: (v) => setLevels(Number(v)), seg: (v) => { const [a, b] = String(v).split(':').map(Number); setSegNo(a); setSegOff(b); labSfx('tap'); },
    page: (v) => setPageLog(Number(v)), pte: (v) => setPte(Number(v)), vabits: (v) => setVaBits(Number(v)),
  });

  const hlField = st.hl;
  return (
    <Frame badge={t('OS lab · exam', 'Phòng lab OS · luyện thi')} title={t('Address split & page-table size', 'Tách bit địa chỉ & cỡ bảng trang')}
      sub={t('Which bits index which table, how big the tables are, and what the TLB buys you', 'Bit nào chỉ vào bảng nào, bảng to cỡ nào, và TLB đem lại gì')}>
      <div className={s.bar} data-tour="addr-view">
        <Seg value={view} options={[['split', t('split an address', 'tách địa chỉ')], ['table', t('table size', 'cỡ bảng trang')], ['tlb', 'TLB · EAT'], ['seg', t('segmentation', 'phân đoạn')]]} onChange={(v) => { setView(v); labSfx('tap'); }} />
      </div>
      {view === 'split' && (
        <div className={s.bar} data-tour="addr-input">
          <span className={s.lbl}>VA <input type="text" value={vaText} onChange={(e) => setVaText(e.target.value)} style={{ width: 170 }} aria-label="virtual address" /></span>
          <Seg value={bits.join('/')} options={LAYOUTS.map(([k]) => [k, k] as [string, string])} onChange={(v) => setLayout(LAYOUTS.find(([k]) => k === v)![1])} />
          <span className={s.lbl}>{t('custom', 'tự đặt')} <input type="text" value={bitsText} onChange={(e) => { setBitsText(e.target.value); const b = bitsOk(e.target.value); if (b) setBits(b); }} style={{ width: 96 }} aria-label="bits" /></span>
        </div>
      )}
      {view === 'table' && (
        <div className={s.bar} data-tour="addr-input">
          <span className={s.lbl}>{t('VA bits', 'bit địa chỉ ảo')} <select value={vaBits} onChange={(e) => setVaBits(Number(e.target.value))}>{[16, 20, 24, 32, 39, 48, 57, 64].map((v) => <option key={v} value={v}>{v}</option>)}</select></span>
          <span className={s.lbl}>{t('page', 'trang')} <select value={pageLog} onChange={(e) => setPageLog(Number(e.target.value))}>{[9, 10, 11, 12, 13, 14, 16, 21].map((v) => <option key={v} value={v}>{fmtBytes(2 ** v)}</option>)}</select></span>
          <Seg label="PTE" value={pte} options={[[4, '4 B'], [8, '8 B']]} onChange={setPte} />
        </div>
      )}
      {view === 'tlb' && (
        <div className={s.stack} style={{ gap: 4, margin: '8px 0' }} data-tour="addr-input">
          <label className={c.slider}><span>{t('TLB hit rate', 'tỉ lệ trúng TLB')}</span><input type="range" min={50} max={100} value={hit} onChange={(e) => setHit(Number(e.target.value))} /><output>{hit} %</output></label>
          <label className={c.slider}><span>{t('table levels', 'số mức bảng')}</span><input type="range" min={1} max={5} value={levels} onChange={(e) => setLevels(Number(e.target.value))} /><output>{levels}</output></label>
          <label className={c.slider}><span>TLB (ns)</span><input type="range" min={1} max={40} value={tlbNs} onChange={(e) => setTlbNs(Number(e.target.value))} /><output>{tlbNs}</output></label>
          <label className={c.slider}><span>{t('memory (ns)', 'bộ nhớ (ns)')}</span><input type="range" min={20} max={200} step={5} value={memNs} onChange={(e) => setMemNs(Number(e.target.value))} /><output>{memNs}</output></label>
        </div>
      )}
      {view === 'seg' && (
        <div className={s.bar} data-tour="addr-input">
          <Seg label={t('segment', 'đoạn')} value={segNo} options={SEG_TABLE.map((_, k) => [k, String(k)] as [number, string])} onChange={(v) => { setSegNo(v); labSfx('tap'); }} />
          <span className={s.lbl}>offset <input type="number" min={0} max={2000} value={segOff} onChange={(e) => setSegOff(Math.max(0, Number(e.target.value) || 0))} /></span>
        </div>
      )}
      <Controls p={p} lang={lang} />
      <Explain tone={st.tone}>{t(st.en, st.vi)}</Explain>

      <div className={c.cols} style={{ marginTop: 10 }}>
        <div className={s.stack} style={{ gap: 8 }}>
          {view === 'split' && <>
            <div className={s.panel} data-tour="addr-bits">
              <div className={s.panelTitle}>{t(`${hex(va)} — ${SP.total} bits, coloured by field`, `${hex(va)} — ${SP.total} bit, tô màu theo trường`)}</div>
              <div className={c.bitstrip}>
                {SP.fields.map((f, k) => {
                  const col = k === SP.fields.length - 1 ? OFF_COLOR : FIELD_COLORS[k % FIELD_COLORS.length];
                  const on = hlField === k || hlField === 'all' || hlField === 'walk';
                  return (
                    <div key={k} className={cx(c.field, hlField === k && c.fieldOn, !on && c.fieldDim)}>
                      <div className={c.fieldLbl} style={{ color: col }}><span>{f.name}</span><span>{f.bits} {t('bits', 'bit')}</span></div>
                      <div className={c.fieldBits}>
                        {f.bin.split('').map((b, j) => { const g = f.hi - j; return <span key={j} className={cx(c.b, g % 4 === 3 && j > 0 && c.bNib)} style={{ background: col, opacity: b === '1' ? 1 : 0.55 }} title={`bit ${g}`}>{b}</span>; })}
                      </div>
                      <div className={s.mono} style={{ fontSize: 12, fontWeight: 800 }}>= {f.value}{k === SP.fields.length - 1 ? ` (${hex(f.value)})` : ''}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={s.panel} data-tour="addr-walk">
              <div className={s.panelTitle}>{t('The page walk', 'Đi bảng trang')}</div>
              <div className={c.walk}>
                <div className={cx(c.walkBox, hlField === 'walk' ? c.walkOn : c.walkFuture)}><b>{t('register', 'thanh ghi')}</b>CR3 / TTBR</div>
                {SP.fields.slice(0, -1).map((f, k) => (
                  <span key={k} style={{ display: 'contents' }}>
                    <span className={c.walkArrow}>→</span>
                    <div className={cx(c.walkBox, (hlField === k || hlField === 'walk') ? c.walkOn : typeof hlField === 'number' && hlField > k && hlField !== SP.fields.length - 1 ? undefined : c.walkFuture)}><b>{t(`level ${k + 1}`, `cấp ${k + 1}`)}</b>[{f.value}]</div>
                  </span>
                ))}
                <span className={c.walkArrow}>→</span>
                <div className={cx(c.walkBox, hlField === 'walk' ? c.walkOn : c.walkFuture)}><b>{t('frame (example)', 'khung (ví dụ)')}</b>{hex(FRAME_EXAMPLE)}</div>
                <span className={c.walkArrow}>+</span>
                <div className={cx(c.walkBox, hlField === SP.fields.length - 1 || hlField === 'walk' ? c.walkOn : c.walkFuture)}><b>offset</b>{hex(SP.fields[SP.fields.length - 1].value)}</div>
              </div>
            </div>
          </>}
          {view === 'table' && (
            <div className={s.panel} data-tour="addr-table">
              <div className={s.panelTitle}>{t('One level vs many levels', 'Một mức vs nhiều mức')}</div>
              <div className={s.kpis}>
                <Kpi k={t('pages', 'số trang')} v={`2^${T1.vpnBits}`} />
                <Kpi k={t('one-level table', 'bảng một mức')} v={fmtBytes(T1.bytes)} tone="bad" />
                <Kpi k={t(`${nLevels} levels, sparse process`, `${nLevels} mức, tiến trình thưa`)} v={fmtBytes(ML.bytes)} tone="ok" />
              </div>
              <table className={cx(s.tbl, s.compact)} style={{ marginTop: 8 }}>
                <thead><tr><th>{t('level', 'mức')}</th><th className={s.num}>{t('bits', 'bit')}</th><th className={s.num}>{t('entries', 'số mục')}</th><th className={s.num}>{t('tables needed', 'số bảng cần')}</th></tr></thead>
                <tbody>{ML.levels.map((l) => <tr key={l.level}><td>{l.level}</td><td className={s.num}>{mlBits[l.level - 1]}</td><td className={s.num}>{l.entries}</td><td className={s.num}>{String(l.tables)}</td></tr>)}</tbody>
              </table>
              <div className={s.small} style={{ marginTop: 4 }}>{t(`Every table is ${fmtBytes(pageBytes)} (one page). Address layout: ${mlBits.join(' / ')}.`, `Mỗi bảng ${fmtBytes(pageBytes)} (đúng một trang). Cách chia địa chỉ: ${mlBits.join(' / ')}.`)}</div>
            </div>
          )}
          {view === 'tlb' && (
            <div className={s.panel} data-tour="addr-table">
              <div className={s.kpis}>
                <Kpi k={t('hit', 'trúng')} v={`${E.hit} ns`} tone="ok" />
                <Kpi k={t('miss', 'trượt')} v={`${E.miss} ns`} tone="bad" />
                <Kpi k="EAT" v={`${+E.eat.toFixed(2)} ns`} tone={E.eat > memNs * 1.3 ? 'warn' : undefined} />
              </div>
              <div className={s.small} style={{ marginTop: 6 }}>{t('Chapter 16 (c164): 10 / 80 ns, 95 % ⇒ 94 ns; with 4 levels ⇒ 106 ns; at 80 % hits ⇒ 154 ns.', 'Chương 16 (c164): 10 / 80 ns, 95 % ⇒ 94 ns; 4 mức ⇒ 106 ns; trúng 80 % ⇒ 154 ns.')}</div>
            </div>
          )}
          {view === 'seg' && (
            <div className={s.panel} data-tour="addr-table">
              <table className={cx(s.tbl, s.compact)}>
                <thead><tr><th>{t('segment', 'đoạn')}</th><th className={s.num}>base</th><th className={s.num}>limit</th></tr></thead>
                <tbody>{SEG_TABLE.map(([b, l], k) => <tr key={k} className={k === segNo ? s.hl : undefined}><td>{k}</td><td className={s.num}>{b}</td><td className={s.num}>{l}</td></tr>)}</tbody>
              </table>
              <div className={s.kpis} style={{ marginTop: 8 }}><Kpi k={t('result', 'kết quả')} v={SG.ok ? SG.phys : 'TRAP'} tone={SG.ok ? 'ok' : 'bad'} /></div>
            </div>
          )}
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel}>
            <div className={s.panelTitle}>{t('Exam steps', 'Các bước làm bài')}</div>
            <ol className={c.rules}>{steps.map((x, k) => <li key={k} style={{ fontWeight: k === i ? 800 : 400, opacity: k > i ? 0.45 : 1 }}>{t(x.en, x.vi).split('. ')[0].replace(/\.$/, '')}.</li>)}</ol>
          </div>
          <WhereBox focus={view === 'tlb' ? 'tlb' : 'address-split'} lang={lang} height={190} />
        </div>
      </div>
    </Frame>
  );
}
