'use client';
/** Cache & phân cấp bộ nhớ — địa chỉ tách tag | index | offset, ánh xạ trực tiếp / kết hợp tập hợp / toàn phần, LRU/FIFO. */
import { useMemo, useState } from 'react';
import { CACHE_PRESETS, amat, geometry, simulate, split, type CacheCfg, type Policy } from './engine/cache';
import { useEffect, useRef } from 'react';
import { Controls, Explain, Kpi, Seg, css as s, usePlayer } from '../os-lab/ui';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { CpuFrame, cc as c, cx, tx, type Lang } from './parts';

const hexA = (a: number, bits: number) => a.toString(16).toUpperCase().padStart(Math.ceil(bits / 4), '0');

export default function CacheSim({ lang = 'vi', preset }: { lang?: Lang; preset?: string }) {
  const first = preset && preset in CACHE_PRESETS ? preset : 'textbook';
  const [pk, setPk] = useState(first);
  const [cfg, setCfg] = useState<CacheCfg>(CACHE_PRESETS[first].cfg);
  const [trace, setTrace] = useState(CACHE_PRESETS[first].addrs.map((a) => a.toString(16).toUpperCase()).join(' '));
  const addrs = useMemo(() => trace.split(/[\s,;]+/).map((t) => parseInt(t.replace(/^0x/i, ''), 16)).filter((x) => Number.isFinite(x) && x >= 0 && x < 2 ** cfg.addrBits).slice(0, 64), [trace, cfg.addrBits]);
  const snaps = useMemo(() => simulate(addrs, cfg), [addrs, cfg]);
  const p = usePlayer(snaps.length, 1300);
  const S = snaps[Math.min(p.i, snaps.length - 1)];
  const g = geometry(cfg);
  const pick = (k: string) => { setPk(k); setCfg(CACHE_PRESETS[k].cfg); setTrace(CACHE_PRESETS[k].addrs.map((a) => a.toString(16).toUpperCase()).join(' ')); p.reset(); };
  const set = (patch: Partial<CacheCfg>) => { setCfg({ ...cfg, ...patch }); p.reset(); };
  const A = S.acc;
  const bits = A ? A.addr.toString(2).padStart(cfg.addrBits, '0') : '0'.repeat(cfg.addrBits);
  const n = S.hits + S.misses;
  const mapping = cfg.ways === 1 ? tx(lang, 'direct-mapped', 'ánh xạ trực tiếp') : cfg.ways >= cfg.lines ? tx(lang, 'fully associative', 'kết hợp toàn phần') : tx(lang, `${cfg.ways}-way set associative`, `kết hợp tập hợp ${cfg.ways} đường`);

  useLabBridge('cache', {
    preset: pk, lines: cfg.lines, ways: cfg.ways, block: cfg.blockSize, hits: S.hits, misses: S.misses, i: p.i, n: addrs.length,
    hit: A ? A.hit : null, missKind: A && !A.hit ? A.missKind : null,
  }, {
    load: (k) => { if (String(k) in CACHE_PRESETS) pick(String(k)); }, ways: (v) => set({ ways: Number(v) }), lines: (v) => set({ lines: Number(v) }),
    block: (v) => set({ blockSize: Number(v) }),
  });
  // trúng = "ting", trượt = "bộp" — nghe được tỉ lệ trúng khi bấm Chạy
  useOwnStepSound();
  const lastI = useRef(p.i);
  useEffect(() => { if (p.i > lastI.current && A) labSfx(A.hit ? 'hit' : 'miss'); lastI.current = p.i; }, [p.i, A]);

  let msgEn = 'Each step is one memory access by the program. The cache checks the set chosen by the index bits, comparing tags.';
  let msgVi = 'Mỗi bước là một lần chương trình truy cập bộ nhớ. Cache xem tập do các bit index chọn, so sánh tag.';
  let tone: 'ok' | 'bad' | 'warn' | undefined;
  if (A) {
    const head = `0x${hexA(A.addr, cfg.addrBits)} → tag ${A.tag}, index ${A.index}, offset ${A.offset} (${tx(lang, 'block', 'khối')} ${A.block}). `;
    if (A.hit) { tone = 'ok'; msgEn = head + `HIT in way ${A.way}: data comes from the cache in ~1 ns.`; msgVi = head + `TRÚNG ở đường ${A.way}: dữ liệu lấy từ cache trong ~1 ns.`; }
    else {
      tone = 'bad';
      const kindEn = A.missKind === 'cold' ? 'compulsory (first time this block is touched)' : cfg.ways >= cfg.lines ? 'capacity (the cache is too small for the working set)' : 'conflict (another block took this set)';
      const kindVi = A.missKind === 'cold' ? 'bắt buộc (lần đầu đụng khối này)' : cfg.ways >= cfg.lines ? 'dung lượng (cache quá nhỏ cho tập làm việc)' : 'xung đột (khối khác chiếm mất tập này)';
      msgEn = head + `MISS — ${kindEn}. The whole ${cfg.blockSize}-byte block is fetched from RAM (~100 ns)${A.evicted !== null ? ` and evicts block ${A.evicted} (${cfg.policy.toUpperCase()})` : ''}.`;
      msgVi = head + `TRƯỢT — ${kindVi}. Cả khối ${cfg.blockSize} byte được nạp từ RAM (~100 ns)${A.evicted !== null ? ` và đẩy khối ${A.evicted} ra (${cfg.policy.toUpperCase()})` : ''}.`;
    }
  }

  return (
    <CpuFrame lang={lang} title={tx(lang, 'Cache memory', 'Bộ nhớ đệm (cache)')} sub={tx(lang, 'Why the same loop can be 10× faster or slower', 'Vì sao cùng một vòng lặp có thể nhanh hay chậm gấp 10 lần')}>
      <div className={s.bar} data-tour="cache-config">
        <span className={s.lbl}>{tx(lang, 'Scenario', 'Kịch bản')}
          <select value={pk} onChange={(e) => pick(e.target.value)}>
            {Object.entries(CACHE_PRESETS).map(([k, v]) => <option key={k} value={k}>{tx(lang, v.en, v.vi)}</option>)}
          </select></span>
        <Seg label={tx(lang, 'Lines', 'Số dòng')} value={cfg.lines} options={[[2, '2'], [4, '4'], [8, '8'], [16, '16']]} onChange={(v) => set({ lines: v, ways: Math.min(cfg.ways, v) })} />
        <Seg label={tx(lang, 'Block', 'Khối')} value={cfg.blockSize} options={[[1, '1 B'], [4, '4 B'], [16, '16 B']]} onChange={(v) => set({ blockSize: v })} />
        <Seg label={tx(lang, 'Ways', 'Đường/tập')} value={Math.min(cfg.ways, cfg.lines)} options={[[1, '1'], [2, '2'], [4, '4'], [cfg.lines, tx(lang, 'all', 'tất cả')]].filter((o, k, a) => (o[0] as number) <= cfg.lines && a.findIndex((x) => x[0] === o[0]) === k) as Array<[number, string]>} onChange={(v) => set({ ways: v })} />
        <Seg label={tx(lang, 'Replace', 'Thay thế')} value={cfg.policy} options={[['lru', 'LRU'], ['fifo', 'FIFO']]} onChange={(v: Policy) => set({ policy: v })} />
      </div>
      <div className={s.bar}>
        <span className={s.lbl} style={{ flex: '1 1 300px' }}>{tx(lang, 'Addresses (hex)', 'Dãy địa chỉ (hex)')}
          <input type="text" value={trace} onChange={(e) => { setTrace(e.target.value); p.reset(); }} style={{ flex: 1, minWidth: 180 }} /></span>
      </div>
      <Controls p={p} lang={lang} label={`${p.i}/${addrs.length}`} />
      <Explain tone={tone}>{tx(lang, msgEn, msgVi)}</Explain>
      <div className={s.grid2} style={{ marginTop: 10, alignItems: 'start' }}>
        <div className={s.panel} data-tour="cache-split">
          <div className={s.panelTitle}>{tx(lang, `Address split (${cfg.addrBits}-bit): ${mapping}`, `Tách địa chỉ (${cfg.addrBits} bit): ${mapping}`)}</div>
          <div className={c.addrSplit}>
            {bits.split('').map((b, k) => <span key={k} className={k < g.tagBits ? c.tagC : k < g.tagBits + g.indexBits ? c.idxC : c.offC}>{b}</span>)}
          </div>
          <div className={s.small} style={{ marginTop: 6 }}>
            <b style={{ color: '#7c3aed' }}>tag {g.tagBits}</b> · <b style={{ color: '#059669' }}>index {g.indexBits}</b> ({g.sets} {tx(lang, 'sets', 'tập')}) · <b style={{ color: '#d97706' }}>offset {g.offsetBits}</b> ({cfg.blockSize} B/{tx(lang, 'block', 'khối')}) · {tx(lang, 'capacity', 'dung lượng')} {cfg.lines * cfg.blockSize} B
          </div>
          <div className={s.small}>{tx(lang, 'offset = which byte inside the block · index = which set to look in · tag = which of the many blocks that share this set', 'offset = byte nào trong khối · index = xem ở tập nào · tag = khối nào trong số rất nhiều khối dùng chung tập này')}</div>
          <div className={s.kpis} style={{ marginTop: 8 }} data-tour="cache-kpis">
            <Kpi k={tx(lang, 'hits', 'trúng')} v={S.hits} tone="ok" />
            <Kpi k={tx(lang, 'misses', 'trượt')} v={S.misses} tone={S.misses ? 'bad' : undefined} />
            <Kpi k={tx(lang, 'hit rate', 'tỉ lệ trúng')} v={n ? `${Math.round((100 * S.hits) / n)}%` : '—'} tone={n && S.hits / n >= 0.7 ? 'ok' : 'warn'} />
            <Kpi k="AMAT" v={n ? `${amat(S.hits, S.misses).toFixed(1)} ns` : '—'} />
          </div>
          <div className={s.small} style={{ marginTop: 4 }}>AMAT = 1 ns + {tx(lang, 'miss rate', 'tỉ lệ trượt')} × 100 ns</div>
        </div>
        <div className={s.panel} style={{ overflowX: 'auto' }} data-tour="cache-table">
          <div className={s.panelTitle}>{tx(lang, 'The cache', 'Cache')}</div>
          <table className={cx(s.tbl, s.compact)}>
            <thead><tr><th>{tx(lang, 'set', 'tập')}</th>{Array.from({ length: cfg.ways }, (_, w) => <th key={w}>{tx(lang, 'way', 'đường')} {w}</th>)}</tr></thead>
            <tbody>{S.sets.map((ways, k) => (
              <tr key={k} className={A && A.index === k ? s.hl : undefined}>
                <td className={s.mono}>{k}</td>
                {ways.map((l, w) => (
                  <td key={w} className={s.mono} style={{ outline: A && A.index === k && A.way === w ? `2px solid ${A.hit ? 'var(--ol-ok)' : 'var(--ol-bad)'}` : undefined }}>
                    {l.valid ? <><b>tag {l.tag}</b><br /><span className={s.small}>{tx(lang, 'block', 'khối')} {l.block} · {hexA(l.block * cfg.blockSize, cfg.addrBits)}–{hexA(l.block * cfg.blockSize + cfg.blockSize - 1, cfg.addrBits)}</span></> : <span className={s.empty}>{tx(lang, 'empty', 'trống')}</span>}
                  </td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div className={s.panel} style={{ marginTop: 10, overflowX: 'auto' }} data-tour="cache-history">
        <div className={s.panelTitle}>{tx(lang, 'Access history', 'Lịch sử truy cập')}</div>
        <div className={s.chips}>
          {addrs.map((a, k) => {
            const st = snaps[k + 1];
            const done = k < p.i;
            return <span key={k} className={s.chip} style={{ background: !done ? 'var(--ol-panel2)' : st.acc?.hit ? 'var(--ol-ok)' : 'var(--ol-bad)', color: done ? '#fff' : 'var(--ol-muted)', outline: k === p.i - 1 ? '3px solid #f59e0b' : undefined }} title={`0x${hexA(a, cfg.addrBits)}`}>{hexA(a, cfg.addrBits)}{done ? (st.acc?.hit ? ' H' : ' M') : ''}</span>;
          })}
        </div>
        <div className={s.small} style={{ marginTop: 6 }}>{tx(lang, CACHE_PRESETS[pk].noteEn, CACHE_PRESETS[pk].noteVi)}</div>
      </div>
      <div className={s.small} style={{ marginTop: 8 }}>
        {tx(lang, 'Why it matters: RAM is ~100× slower than L1 cache —', 'Vì sao quan trọng: RAM chậm hơn cache L1 ~100 lần —')} <a href={`/os-lab?sim=latency&lang=${lang}`} target="_blank" rel="noopener" style={{ color: 'var(--ol-accent)', fontWeight: 700 }}>{tx(lang, 'see the latency ladder →', 'xem thang độ trễ →')}</a>{' '}
        {tx(lang, 'Your own machine: lscpu | grep cache (Linux), sysctl hw.l1dcachesize (macOS). Split rule: ', 'Máy của bạn: lscpu | grep cache (Linux), sysctl hw.l1dcachesize (macOS). Luật tách: ')}{split(0, cfg).offsetBits}+{split(0, cfg).indexBits}+{split(0, cfg).tagBits} = {cfg.addrBits} bit.
      </div>
    </CpuFrame>
  );
}
