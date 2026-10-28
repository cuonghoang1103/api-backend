'use client';
/** Copy-on-write sau fork(): bảng trang cha/con trỏ chung khung, ghi ⇒ chép đúng một trang; máy tính bộ nhớ của Redis BGSAVE. */
import { useMemo, useState } from 'react';
import { bgsave, cowExec, cowExit, cowFork, cowInit, cowWrite, framesInUse, type CowState } from './engine/memtricks';
import { LineChart } from './charts';
import { Explain, Frame, Kpi, Seg, css as s, cx, tx, type Lang } from './ui';

const PAGES = 16;
const C = { shared: '#64748b', parent: '#2563eb', child: '#9333ea' };

export default function CowSim({ lang = 'vi', preset = 'fork' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [hist, setHist] = useState<CowState[]>(() => [preset === 'fork' || preset === 'exec' ? cowFork(cowInit(PAGES)) : cowInit(PAGES)]);
  const S = hist[hist.length - 1];
  const go = (fn: (x: CowState) => CowState) => setHist((h) => [...h, fn(h[h.length - 1])]);
  const randPage = () => Math.floor(Math.random() * PAGES);
  const [gib, setGib] = useState(4);
  const [wps, setWps] = useState(10000);
  const [secs, setSecs] = useState(30);
  const [page, setPage] = useState<4 | 2048>(preset === 'hugepage' ? 2048 : 4);
  const calc = useMemo(() => bgsave(gib, wps, secs, page), [gib, wps, secs, page]);
  const other = useMemo(() => bgsave(gib, wps, secs, page === 4 ? 2048 : 4).final, [gib, wps, secs, page]);

  // ── sơ đồ bảng trang ↔ khung ──
  const rowH = 17, top = 24, W = 560, H = top + PAGES * rowH + 8;
  const nF = S.frames.length;
  const fCols = Math.ceil(nF / PAGES);
  const fx = (id: number) => 220 + Math.floor(id / PAGES) * 64, fy = (id: number) => top + (id % PAGES) * rowH;
  const pX = 18, cX = W - 100;
  const colorFrame = (id: number) => { const f = S.frames[id]; if (f.refs === 0) return 'transparent'; if (f.refs > 1) return C.shared; return S.child?.includes(id) ? C.child : C.parent; };
  const used = framesInUse(S);
  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('Copy-on-write after fork()', 'Copy-on-write sau fork()')} sub={t('Why fork is cheap — and why Redis BGSAVE can still double your RAM', 'Vì sao fork rẻ — và vì sao Redis BGSAVE vẫn có thể nhân đôi RAM')}>
      <div className={s.bar}>
        <button type="button" className={cx(s.btn, s.primary)} disabled={!!S.child} onClick={() => go(cowFork)}>fork()</button>
        <button type="button" className={s.btn} onClick={() => go((x) => cowWrite(x, 'parent', randPage()))} style={{ borderColor: C.parent }}>{t('parent writes a random page', 'cha ghi một trang ngẫu nhiên')}</button>
        <button type="button" className={s.btn} disabled={!S.child} onClick={() => go((x) => cowWrite(x, 'child', randPage()))} style={{ borderColor: C.child }}>{t('child writes a random page', 'con ghi một trang ngẫu nhiên')}</button>
        <button type="button" className={s.btn} disabled={!S.child} onClick={() => go(cowExec)}>{t('child: execve()', 'con: execve()')}</button>
        <button type="button" className={s.btn} disabled={!S.child} onClick={() => go(cowExit)}>{t('child: exit()', 'con: exit()')}</button>
        <button type="button" className={s.btn} disabled={hist.length < 2} onClick={() => setHist((h) => h.slice(0, -1))}>{t('undo', 'hoàn tác')}</button>
        <button type="button" className={s.btn} onClick={() => setHist([cowInit(PAGES)])}>{t('reset', 'làm lại')}</button>
      </div>
      <Explain tone={S.last?.copied ? 'warn' : undefined}>{t(S.en, S.vi)}</Explain>
      <div className={s.grid2} style={{ marginTop: 8, gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', alignItems: 'start' }}>
        <div className={s.panel}>
          <div className={s.svgWrap}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%' }} role="img" aria-label="page tables">
              <text x={pX} y={14} fontSize={12} fontWeight={800} fill={C.parent}>{t('parent page table', 'bảng trang của cha')}</text>
              <text x={220} y={14} fontSize={12} fontWeight={800} className={s.svgText}>{t('physical frames', 'khung vật lý')}</text>
              {S.child && <text x={cX} y={14} fontSize={12} fontWeight={800} fill={C.child}>{t('child', 'con')}</text>}
              {S.parent.map((f, pg) => <line key={`lp${pg}`} x1={pX + 70} y1={top + pg * rowH + 7} x2={fx(f)} y2={fy(f) + 7} stroke={S.frames[f].refs > 1 ? C.shared : C.parent} strokeWidth={1.4} opacity={0.75} />)}
              {S.child?.map((f, pg) => <line key={`lc${pg}`} x1={cX} y1={top + pg * rowH + 7} x2={fx(f) + 52} y2={fy(f) + 7} stroke={S.frames[f].refs > 1 ? C.shared : C.child} strokeWidth={1.4} opacity={0.75} />)}
              {S.parent.map((f, pg) => (
                <g key={`p${pg}`} style={{ cursor: 'pointer' }} onClick={() => go((x) => cowWrite(x, 'parent', pg))}>
                  <rect x={pX} y={top + pg * rowH} width={70} height={rowH - 3} rx={3} fill={S.last?.who === 'parent' && S.last.page === pg ? 'var(--ol-hl)' : 'var(--ol-panel2)'} stroke="var(--ol-border)" />
                  <text x={pX + 5} y={top + pg * rowH + 11} fontSize={10.5} className={s.svgText}>pg {pg} {S.frames[f].refs > 1 ? '🔒' : '✎'}</text>
                </g>
              ))}
              {S.child?.map((f, pg) => (
                <g key={`c${pg}`} style={{ cursor: 'pointer' }} onClick={() => go((x) => cowWrite(x, 'child', pg))}>
                  <rect x={cX} y={top + pg * rowH} width={70} height={rowH - 3} rx={3} fill={S.last?.who === 'child' && S.last.page === pg ? 'var(--ol-hl)' : 'var(--ol-panel2)'} stroke="var(--ol-border)" />
                  <text x={cX + 5} y={top + pg * rowH + 11} fontSize={10.5} className={s.svgText}>pg {pg} {S.frames[f].refs > 1 ? '🔒' : '✎'}</text>
                </g>
              ))}
              {S.frames.map((f) => f.refs > 0 && (
                <g key={`f${f.id}`}>
                  <rect x={fx(f.id)} y={fy(f.id)} width={52} height={rowH - 3} rx={3} fill={colorFrame(f.id)} />
                  <text x={fx(f.id) + 4} y={fy(f.id) + 11} fontSize={10} fill="#fff" fontWeight={700}>#{f.id} ×{f.refs}</text>
                </g>
              ))}
            </svg>
          </div>
          <div className={s.small}>{t(`Click a page in either table to write it. 🔒 = read-only (shared, a write will fault), ✎ = private. ${fCols > 1 ? 'New columns of frames = copies.' : ''}`, `Bấm một trang ở bảng nào cũng được để ghi vào nó. 🔒 = chỉ-đọc (dùng chung, ghi là lỗi trang), ✎ = riêng. ${fCols > 1 ? 'Cột khung mới = các bản chép.' : ''}`)}</div>
        </div>
        <div className={s.stack}>
          <div className={s.kpis}>
            <Kpi k={t('frames in use', 'khung đang dùng')} v={`${used} × 4 KiB`} tone={used > PAGES * 1.5 ? 'warn' : undefined} />
            <Kpi k={t('pages copied', 'trang đã chép')} v={S.copies} tone={S.copies ? 'warn' : 'ok'} />
            <Kpi k={t('COW faults', 'lỗi trang COW')} v={S.faults} />
          </div>
          <div className={s.small}>{t('Without copy-on-write, fork() would have to copy all 16 pages up front — and for a 4 GiB Redis that is 4 GiB and about a second, just to then exec() and throw it away.', 'Không có copy-on-write, fork() sẽ phải chép cả 16 trang ngay lập tức — với Redis 4 GiB là 4 GiB và cỡ một giây, chỉ để rồi exec() vứt đi.')}</div>
          <div className={s.term}>{`$ grep -E 'Rss|Pss|Shared_Dirty|Private_Dirty' /proc/<child>/smaps_rollup
Rss:            ${S.child ? S.child.length * 4 : 0} kB
Pss:            ${S.child ? Math.round(S.child.reduce((a, f) => a + 4 / S.frames[f].refs, 0)) : 0} kB
Shared_Dirty:   ${S.child ? S.child.filter((f) => S.frames[f].refs > 1).length * 4 : 0} kB
Private_Dirty:  ${S.child ? S.child.filter((f) => S.frames[f].refs === 1).length * 4 : 0} kB`}</div>
        </div>
      </div>

      <div className={s.panel} style={{ marginTop: 10 }}>
        <div className={s.panelTitle}>{t('Redis BGSAVE: how much extra RAM?', 'Redis BGSAVE: tốn thêm bao nhiêu RAM?')}</div>
        <div className={s.grid2}>
          <div className={s.stack} style={{ gap: 4 }}>
            <label className={s.lbl}>{t('dataset', 'dữ liệu')} <input type="range" min={1} max={32} value={gib} onChange={(e) => setGib(Number(e.target.value))} /> <b>{gib} GiB</b></label>
            <label className={s.lbl}>{t('writes/s during the save', 'lệnh ghi/giây trong lúc lưu')} <input type="range" min={2} max={5} step={0.1} value={Math.log10(wps)} onChange={(e) => setWps(Math.round(10 ** Number(e.target.value)))} /> <b>{wps.toLocaleString()}</b></label>
            <label className={s.lbl}>{t('save takes', 'lưu mất')} <input type="range" min={1} max={120} value={secs} onChange={(e) => setSecs(Number(e.target.value))} /> <b>{secs} s</b></label>
            <Seg label={t('page size', 'cỡ trang')} value={page} options={[[4, '4 KiB'], [2048, t('2 MiB (THP on)', '2 MiB (bật THP)')]]} onChange={setPage} />
          </div>
          <div>
            <LineChart height={120} title={t('extra RAM used by copies (MiB)', 'RAM thêm cho các bản chép (MiB)')} series={[{ name: 'MiB', color: page === 4 ? C.parent : '#dc2626', data: calc.series.map((x) => x.extraMiB), area: true }]} refs={[{ y: gib * 1024, label: t(`whole dataset ${gib} GiB`, `toàn bộ ${gib} GiB`) }]} xLabels={['0 s', `${secs} s`]} yMax={gib * 1024 * 1.1} />
          </div>
        </div>
        <Explain tone={calc.final.extraMiB > gib * 512 ? 'bad' : calc.final.extraMiB > gib * 100 ? 'warn' : 'ok'}>
          {t(`${(wps * secs).toLocaleString()} writes land on ${Math.round(calc.final.touched).toLocaleString()} of ${Math.round(calc.pages).toLocaleString()} pages (${((100 * calc.final.touched) / calc.pages).toFixed(1)}%) → about ${Math.round(calc.final.extraMiB).toLocaleString()} MiB copied. With ${page === 4 ? '2 MiB huge pages' : '4 KiB pages'} it would be ${Math.round(other.extraMiB).toLocaleString()} MiB.`, `${(wps * secs).toLocaleString()} lệnh ghi rơi vào ${Math.round(calc.final.touched).toLocaleString()} trên ${Math.round(calc.pages).toLocaleString()} trang (${((100 * calc.final.touched) / calc.pages).toFixed(1)}%) → chép khoảng ${Math.round(calc.final.extraMiB).toLocaleString()} MiB. Với ${page === 4 ? 'huge page 2 MiB' : 'trang 4 KiB'} sẽ là ${Math.round(other.extraMiB).toLocaleString()} MiB.`)}
          {page === 2048 && t(' This is why Redis logs "WARNING you have Transparent Huge Pages (THP) support enabled" and tells you to set it to never/madvise.', ' Đây là lý do Redis in "WARNING you have Transparent Huge Pages (THP) support enabled" và bảo bạn đặt về never/madvise.')}
        </Explain>
      </div>
    </Frame>
  );
}
