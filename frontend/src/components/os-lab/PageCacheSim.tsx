'use client';
/** Page cache + read-ahead: đọc tuần tự vs ngẫu nhiên, file nguội vs ấm, read() vs mmap(), LRU bị "lụt" bởi vòng lặp lớn. */
import { useMemo, useState } from 'react';
import { pageCache, type PcCfg } from './engine/memtricks';
import { Controls, Explain, Frame, Kpi, Seg, css as s, tx, usePlayer, type Lang } from './ui';

const PRE: Record<string, { cfg: Partial<PcCfg>; en: string; vi: string }> = {
  seq: { cfg: {}, en: 'Reading a cold 1 MiB file (256 pages) from start to end. After the first miss the kernel notices "sequential" and reads ahead in growing windows — 4, 8, 16, 32 pages — in the background, so the program almost never waits.', vi: 'Đọc một file 1 MiB nguội (256 trang) từ đầu tới cuối. Sau lần trượt đầu, kernel nhận ra "tuần tự" và đọc trước theo cửa sổ lớn dần — 4, 8, 16, 32 trang — ở chế độ nền, nên chương trình gần như không phải chờ.' },
  random: { cfg: { pattern: 'rand' }, en: 'Same file, same pages, random order (an index lookup, a hash table on disk). Read-ahead cannot guess, so every page is one trip to the disk.', vi: 'Cùng file, cùng số trang, thứ tự ngẫu nhiên (tra chỉ mục, bảng băm trên đĩa). Read-ahead không đoán được nên trang nào cũng là một chuyến xuống đĩa.' },
  warm: { cfg: { warm: true, pattern: 'rand' }, en: 'Run it again: the file is now in the page cache (buff/cache in free). Zero disk I/O, even in random order — the "second run is 50× faster" effect. Benchmark cold and warm separately!', vi: 'Chạy lại lần nữa: file giờ đã nằm trong page cache (cột buff/cache của free). Không I/O đĩa nào, kể cả thứ tự ngẫu nhiên — hiệu ứng "lần chạy thứ hai nhanh gấp 50 lần". Đo nguội và ấm riêng nhé!' },
  mmap: { cfg: { warm: true, api: 'mmap' }, en: 'read() copies each page from the cache into your buffer (a syscall + a 4 KiB memcpy). mmap() maps the cache pages straight into your address space: the first touch is a minor page fault, then plain memory loads — no copy.', vi: 'read() chép từng trang từ cache sang bộ đệm của bạn (một syscall + memcpy 4 KiB). mmap() ánh xạ thẳng trang cache vào không gian địa chỉ của bạn: lần chạm đầu là lỗi trang minor, sau đó là đọc bộ nhớ thường — không chép.' },
  lru: { cfg: { cachePages: 200, passes: 2, readahead: false }, en: 'The cache holds 200 pages, the loop reads 256, twice. LRU always evicts exactly the page you will need next: the second pass misses EVERY page. (Linux uses two LRU lists — active/inactive — partly to resist this.)', vi: 'Cache chứa 200 trang, vòng lặp đọc 256 trang, hai lần. LRU luôn đuổi đúng trang bạn sắp cần: lượt thứ hai trượt MỌI trang. (Linux dùng hai danh sách LRU — active/inactive — một phần để chống chuyện này.)' },
};
const BASE: PcCfg = { filePages: 256, cachePages: 1024, pattern: 'seq', api: 'read', readahead: true, passes: 1, warm: false, seed: 7 };

export default function PageCacheSim({ lang = 'vi', preset = 'seq' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const k0 = PRE[preset] ? preset : 'seq';
  const [key, setKey] = useState(k0);
  const [cfg, setCfg] = useState<PcCfg>({ ...BASE, ...PRE[k0].cfg });
  const r = useMemo(() => pageCache(cfg), [cfg]);
  const alt = useMemo(() => pageCache({ ...cfg, api: cfg.api === 'read' ? 'mmap' : 'read' }), [cfg]);
  const p = usePlayer(r.acc.length + 1, 70);
  const set = (patch: Partial<PcCfg>) => { setCfg((c) => ({ ...c, ...patch })); p.reset(); };
  const i = p.i - 1;
  const A = i >= 0 ? r.acc[i] : null;
  const cached = i >= 0 ? r.cacheAt[i] : new Set<number>(cfg.warm ? Array.from({ length: Math.min(cfg.filePages, cfg.cachePages) }, (_, k) => k) : []);
  const fetchedNow = new Set(A?.fetched ?? []);
  const sofar = r.acc.slice(0, Math.max(0, i + 1));
  const reqs = sofar.filter((a) => a.fetched.length).length, miss = sofar.filter((a) => !a.hit).length;
  const us = sofar.reduce((a, b) => a + b.ns / 1000, 0);
  const cols = 32;
  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('Page cache and read-ahead', 'Page cache và read-ahead')} sub={t('Why the second run is faster, why random I/O hurts, and what mmap really saves', 'Vì sao lần chạy thứ hai nhanh hơn, vì sao I/O ngẫu nhiên đau, và mmap thật ra tiết kiệm gì')}>
      <div className={s.bar}>
        <span className={s.lbl}>{t('Scenario', 'Kịch bản')}</span>
        {Object.keys(PRE).map((k) => <button type="button" key={k} className={s.btn + (key === k ? ` ${s.on}` : '')} onClick={() => { setKey(k); setCfg({ ...BASE, ...PRE[k].cfg }); p.reset(); }}>{k}</button>)}
      </div>
      <Explain>{t(PRE[key].en, PRE[key].vi)}</Explain>
      <div className={s.bar}>
        <Seg label={t('order', 'thứ tự')} value={cfg.pattern} options={[['seq', t('sequential', 'tuần tự')], ['rand', t('random', 'ngẫu nhiên')]]} onChange={(v) => set({ pattern: v })} />
        <Seg label="API" value={cfg.api} options={[['read', 'read()'], ['mmap', 'mmap()']]} onChange={(v) => set({ api: v })} />
        <Seg label="read-ahead" value={cfg.readahead ? 'on' : 'off'} options={[['on', 'on'], ['off', 'off']]} onChange={(v) => set({ readahead: v === 'on' })} />
        <Seg label={t('cache', 'cache')} value={cfg.warm ? 'warm' : 'cold'} options={[['cold', t('cold', 'nguội')], ['warm', t('warm', 'ấm')]]} onChange={(v) => set({ warm: v === 'warm' })} />
        <Seg label={t('cache size', 'cỡ cache')} value={cfg.cachePages} options={[[200, '200'], [1024, '1024']]} onChange={(v) => set({ cachePages: v })} />
        <Seg label={t('passes', 'số lượt')} value={cfg.passes} options={[[1, '1'], [2, '2']]} onChange={(v) => set({ passes: v })} />
      </div>
      <Controls p={p} lang={lang} label={`${t('access', 'lần đọc')} ${Math.max(0, i + 1)}/${r.acc.length}`} />
      <Explain tone={A && !A.hit ? 'bad' : A?.async ? 'ok' : undefined}>
        {!A ? t('Press Play: each step reads one 4 KiB page of the file.', 'Bấm Chạy: mỗi bước đọc một trang 4 KiB của file.')
          : A.hit ? (A.async ? t(`Page ${A.page}: in cache ✓ — and it carried the read-ahead mark, so the kernel starts reading the next ${A.fetched.length} pages in the background.`, `Trang ${A.page}: có trong cache ✓ — và nó mang mốc read-ahead nên kernel bắt đầu đọc nền ${A.fetched.length} trang kế tiếp.`)
            : t(`Page ${A.page}: in the page cache ✓ (${A.kind === 'minor' ? 'mmap: minor fault, just map it' : cfg.api === 'mmap' ? 'already mapped: a plain load' : 'copy 4 KiB to your buffer'}).`, `Trang ${A.page}: có trong page cache ✓ (${A.kind === 'minor' ? 'mmap: lỗi trang minor, chỉ việc ánh xạ' : cfg.api === 'mmap' ? 'đã ánh xạ: đọc bộ nhớ thường' : 'chép 4 KiB sang bộ đệm của bạn'}).`))
            : t(`Page ${A.page}: NOT in cache ✗ — ${cfg.api === 'mmap' ? 'major page fault, ' : ''}the process sleeps (state D) while the disk reads ${A.fetched.length} page(s) (${(A.ns / 1000).toFixed(0)} µs).`, `Trang ${A.page}: KHÔNG có trong cache ✗ — ${cfg.api === 'mmap' ? 'lỗi trang major, ' : ''}tiến trình ngủ (trạng thái D) trong lúc đĩa đọc ${A.fetched.length} trang (${(A.ns / 1000).toFixed(0)} µs).`)}
      </Explain>
      <div className={s.grid2} style={{ marginTop: 8, alignItems: 'start' }}>
        <div className={s.panel}>
          <div className={s.panelTitle}>{t('The file, page by page (256 × 4 KiB)', 'File, từng trang (256 × 4 KiB)')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 1.5 }}>
            {Array.from({ length: cfg.filePages }, (_, pg) => {
              const cur = A?.page === pg;
              const bg = cur ? (A!.hit ? '#16a34a' : '#dc2626') : fetchedNow.has(pg) ? '#f59e0b' : cached.has(pg) ? '#2563eb' : 'var(--ol-panel2)';
              return <span key={pg} style={{ aspectRatio: '1', borderRadius: 2, background: bg, outline: cur ? '2px solid var(--ol-text)' : undefined, opacity: cached.has(pg) || cur ? 1 : 0.9 }} />;
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 10px', fontSize: 11.5, marginTop: 6 }}>
            {[['#2563eb', t('in page cache', 'trong page cache')], ['#f59e0b', t('being read ahead', 'đang đọc trước')], ['#16a34a', t('hit', 'trúng')], ['#dc2626', t('miss → disk', 'trượt → đĩa')], ['var(--ol-panel2)', t('only on disk', 'chỉ trên đĩa')]].map(([c, n]) => (
              <span key={n} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: c, border: '1px solid var(--ol-border)' }} />{n}</span>
            ))}
          </div>
        </div>
        <div className={s.stack}>
          <div className={s.kpis}>
            <Kpi k={t('disk requests', 'lần xuống đĩa')} v={reqs} tone={reqs > 60 ? 'bad' : reqs > 0 ? 'warn' : 'ok'} />
            <Kpi k={t('misses (waits)', 'trượt (phải chờ)')} v={miss} tone={miss > 20 ? 'bad' : undefined} />
            <Kpi k={t('time so far', 'thời gian tới giờ')} v={us > 1000 ? `${(us / 1000).toFixed(1)} ms` : `${us.toFixed(0)} µs`} />
          </div>
          <div className={s.panel}>
            <div className={s.panelTitle}>{t('Read-ahead windows (pages per disk request)', 'Cửa sổ read-ahead (trang mỗi lần xuống đĩa)')}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 54, overflow: 'hidden' }}>
              {r.windows.slice(0, 60).map((w, k) => <span key={k} title={String(w)} style={{ width: 8, flex: '0 0 auto', height: `${(w / 32) * 100}%`, background: '#f59e0b', borderRadius: 2, opacity: k < reqs ? 1 : 0.25 }} />)}
              {!r.windows.length && <span className={s.empty}>{t('no disk reads at all', 'không đọc đĩa lần nào')}</span>}
            </div>
            <div className={s.small}>{r.windows.length > 60 ? t(`${r.windows.length} requests (first 60 shown)`, `${r.windows.length} lần (hiện 60 lần đầu)`) : ''}</div>
          </div>
          <div className={s.term}>{`$ perf stat -e major-faults,minor-faults ./scan ${cfg.api}
   ${String(r.major).padStart(8)}      major-faults
   ${String(r.minor).padStart(8)}      minor-faults
# whole run (${r.acc.length} pages):
#   ${cfg.api}(): ${r.requests} disk requests, ${r.copies} page copies, ≈ ${(r.totalUs / 1000).toFixed(2)} ms
#   ${cfg.api === 'read' ? 'mmap' : 'read'}(): ${alt.requests} disk requests, ${alt.copies} page copies, ≈ ${(alt.totalUs / 1000).toFixed(2)} ms`}</div>
          <div className={s.small}>{t('Costs are typical NVMe/DRAM orders of magnitude (≈80 µs per disk request, ≈1 µs per cached 4 KiB read()), not measurements — measure your own machine in the lab container (fincore, vmtouch, perf stat).', 'Chi phí là bậc độ lớn điển hình của NVMe/DRAM (≈80 µs mỗi lần xuống đĩa, ≈1 µs cho một read() 4 KiB từ cache), không phải số đo — tự đo máy bạn trong container phòng lab (fincore, vmtouch, perf stat).')}</div>
        </div>
      </div>
    </Frame>
  );
}
