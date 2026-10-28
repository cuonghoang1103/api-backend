'use client';
/** Thread pool + hàng đợi + pool CSDL: định luật Little, điểm gãy khi quá tải, timeout, virtual thread. */
import { useMemo, useState } from 'react';
import { capacity, erlangC, simulate, sweep, WS, type QCfg } from './engine/queueing';
import { LineChart } from './charts';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';

const BASE: QCfg = { lambda: 200, cpuMs: 5, dbMs: 20, workers: 8, cores: 4, dbPool: 10, queueCap: Infinity, timeoutMs: 1000, dropExpired: false, virtual: false, dist: 'exp', duration: 30, seed: 7 };
const PRESETS: Record<string, { cfg: Partial<QCfg>; en: string; vi: string }> = {
  healthy: { cfg: {}, en: '200 req/s into a pool that can do 320/s: utilisation 62%, short queue, fast answers.', vi: '200 req/s vào một pool làm được 320/s: bận 62%, hàng ngắn, trả lời nhanh.' },
  overload: { cfg: { lambda: 360 }, en: '360 req/s, capacity 320/s. Only 12% too much — and the queue grows forever: every second 40 more requests are waiting than before. Latency climbs in a straight line.', vi: '360 req/s, sức chứa 320/s. Chỉ thừa 12% — mà hàng đợi dài ra mãi: mỗi giây thêm 40 request phải chờ. Độ trễ leo theo đường thẳng.' },
  timeout: { cfg: { lambda: 360, timeoutMs: 500 }, en: 'Same overload, clients give up after 500 ms. The server is 100% busy… answering people who already left. Try "drop expired", then a bounded queue (64).', vi: 'Cùng quá tải, client bỏ cuộc sau 500 ms. Máy chủ bận 100%… để trả lời những người đã bỏ đi. Thử "bỏ request quá hạn", rồi hàng đợi có giới hạn (64).' },
  dbpool: { cfg: { workers: 50, dbPool: 5, lambda: 230 }, en: '50 threads, but only 5 database connections. Raising threads does nothing: they just wait for a connection (yellow). The bottleneck is the pool behind you.', vi: '50 luồng, nhưng chỉ 5 kết nối CSDL. Tăng luồng chẳng được gì: chúng chỉ ngồi chờ kết nối (vàng). Nút cổ chai là cái pool phía sau.' },
  virtual: { cfg: { lambda: 380, virtual: true }, en: 'Virtual threads (Java 21): a thread per request is cheap, so the worker limit disappears. 380 req/s now works — until the 10 DB connections (500/s) run out.', vi: 'Virtual thread (Java 21): mỗi request một luồng mà rẻ, nên giới hạn worker biến mất. 380 req/s giờ chạy được — cho tới khi 10 kết nối CSDL (500/s) cạn.' },
  mm1: { cfg: { lambda: 80, cpuMs: 10, dbMs: 0, workers: 1, cores: 1, timeoutMs: Infinity, duration: 60 }, en: 'Textbook M/M/1: one server, λ = 80/s, S = 10 ms ⇒ ρ = 0.8, W = 1/(μ − λ) = 50 ms, L = λW = 4. Five times the bare service time — at only 80% busy.', vi: 'M/M/1 sách giáo khoa: một máy, λ = 80/s, S = 10 ms ⇒ ρ = 0,8, W = 1/(μ − λ) = 50 ms, L = λW = 4. Gấp năm lần thời gian phục vụ — mà mới bận 80%.' },
};
const WCOL = ['var(--ol-panel2)', '#a855f7', '#2563eb', '#eab308', '#059669'];

function Num({ label, v, min, max, step = 1, on, fmt }: { label: string; v: number; min: number; max: number; step?: number; on: (x: number) => void; fmt?: (x: number) => string }) {
  return (
    <label className={s.lbl} style={{ display: 'grid', gridTemplateColumns: 'minmax(96px,auto) minmax(0,1fr) 54px', gap: 6, width: '100%' }}>
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => on(Number(e.target.value))} />
      <span className={s.mono} style={{ textAlign: 'right', color: 'var(--ol-text)' }}>{fmt ? fmt(v) : v}</span>
    </label>
  );
}

export default function ThreadPoolSim({ lang = 'vi', preset = 'healthy' }: { lang?: Lang; preset?: string }) {
  const pk = PRESETS[preset] ? preset : 'healthy';
  const [key, setKey] = useState(pk);
  const [cfg, setCfg] = useState<QCfg>({ ...BASE, ...PRESETS[pk].cfg });
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const res = useMemo(() => simulate(cfg, 100, 600), [cfg]);
  const curve = useMemo(() => sweep(cfg, 12), [cfg]);
  const p = usePlayer(res.frames.length, 110);
  const F = res.frames[Math.min(p.i, res.frames.length - 1)];
  const cap = capacity(cfg);
  const set = (patch: Partial<QCfg>) => { setCfg((c) => ({ ...c, ...patch })); p.reset(); };
  const load = (k: string) => { setKey(k); setCfg({ ...BASE, ...PRESETS[k].cfg }); p.reset(); };
  const rho = cfg.lambda / cap.rps;
  const secNow = Math.floor(F.t / 1000);
  const secs = res.secs.slice(0, Math.max(1, secNow));
  const mm = cfg.dbMs === 0 && cfg.cores >= cfg.workers && !cfg.virtual && cfg.dist === 'exp' && cfg.queueCap === Infinity ? erlangC(cfg.workers, cfg.lambda, 1000 / cfg.cpuMs) : null;
  const bottleneck = { workers: t('worker threads', 'số luồng worker'), cores: t('CPU cores', 'số lõi CPU'), db: t('DB connections', 'kết nối CSDL') }[cap.by];

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t("Thread pools and Little's law", 'Thread pool và định luật Little')}
      sub={t('Requests arrive, wait for a thread, a core and a DB connection. Where does it break?', 'Request đến, chờ một luồng, một lõi và một kết nối CSDL. Gãy ở đâu?')}>
      <div className={s.bar}>
        <span className={s.lbl}>{t('Scenario', 'Kịch bản')}</span>
        {Object.keys(PRESETS).map((k) => <button type="button" key={k} className={cx(s.btn, key === k && s.on)} onClick={() => load(k)}>{k}</button>)}
      </div>
      <Explain>{t(PRESETS[key].en, PRESETS[key].vi)}</Explain>
      <div className={s.grid2} style={{ marginTop: 8 }}>
        <div className={s.stack} style={{ gap: 4 }}>
          <Num label={t('arrivals λ (req/s)', 'tốc độ đến λ (req/s)')} v={cfg.lambda} min={10} max={800} step={10} on={(x) => set({ lambda: x })} />
          <Num label={t('CPU per request', 'CPU mỗi request')} v={cfg.cpuMs} min={1} max={50} on={(x) => set({ cpuMs: x })} fmt={(x) => `${x} ms`} />
          <Num label={t('DB per request', 'CSDL mỗi request')} v={cfg.dbMs} min={0} max={100} on={(x) => set({ dbMs: x })} fmt={(x) => `${x} ms`} />
          <Num label={t('CPU cores', 'Số lõi')} v={cfg.cores} min={1} max={16} on={(x) => set({ cores: x })} />
        </div>
        <div className={s.stack} style={{ gap: 4 }}>
          <Seg label={t('Threads', 'Luồng')} value={cfg.virtual ? 'v' : 'p'} options={[['p', t('platform thread pool', 'thread pool thường')], ['v', t('virtual threads', 'virtual thread')]]} onChange={(v) => set({ virtual: v === 'v' })} />
          {!cfg.virtual && <Num label={t('worker threads', 'luồng worker')} v={cfg.workers} min={1} max={64} on={(x) => set({ workers: x })} />}
          <Num label={t('DB pool size', 'pool kết nối CSDL')} v={cfg.dbPool} min={1} max={50} on={(x) => set({ dbPool: x })} />
          <div className={s.bar} style={{ margin: 0 }}>
            <Seg label={t('queue', 'hàng đợi')} value={String(cfg.queueCap)} options={[['Infinity', '∞'], ['64', '64'], ['16', '16']]} onChange={(v) => set({ queueCap: Number(v) })} />
            <Seg label="timeout" value={String(cfg.timeoutMs)} options={[['Infinity', '∞'], ['500', '0.5 s'], ['1000', '1 s'], ['2000', '2 s']]} onChange={(v) => set({ timeoutMs: Number(v) })} />
            <label className={s.lbl}><input type="checkbox" checked={cfg.dropExpired} onChange={(e) => set({ dropExpired: e.target.checked })} />{t('drop expired', 'bỏ request quá hạn')}</label>
          </div>
        </div>
      </div>
      <Explain tone={rho >= 1 ? 'bad' : rho > 0.85 ? 'warn' : 'ok'}>
        <b>{t('Capacity', 'Sức chứa')} = min(</b>
        {!cfg.virtual && <>{t('threads', 'luồng')} {cfg.workers}/{cfg.cpuMs + cfg.dbMs} ms = {Math.round(cap.byW)}, </>}
        {t('cores', 'lõi')} {cfg.cores}/{cfg.cpuMs} ms = {Math.round(cap.byC)}{cfg.dbMs > 0 && <>, {t('conns', 'kết nối')} {cfg.dbPool}/{cfg.dbMs} ms = {Math.round(cap.byD)}</>}<b>) = {Math.round(cap.rps)} req/s</b> — {t('bottleneck', 'nút cổ chai')}: <b>{bottleneck}</b>.{' '}
        ρ = λ / {t('capacity', 'sức chứa')} = <b>{rho.toFixed(2)}</b>.{' '}
        {rho >= 1 ? t('More arrives than can leave: the queue can only grow.', 'Đến nhiều hơn đi: hàng đợi chỉ có thể dài ra.') : rho > 0.85 ? t('Stable, but past ~85% busy waiting time explodes (the knee of the curve).', 'Ổn định, nhưng quá ~85% bận thì thời gian chờ bùng nổ (khúc gãy của đường cong).') : t('Comfortable headroom.', 'Còn dư sức thoải mái.')}
      </Explain>
      <Controls p={p} lang={lang} label={`t = ${(F.t / 1000).toFixed(1)} s / ${cfg.duration} s`} />

      <div className={s.grid2} style={{ alignItems: 'start' }}>
        <div className={s.panel}>
          <div className={s.panelTitle}>{t('Waiting queue', 'Hàng đợi')} · {F.queue}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, minHeight: 18 }}>
            {Array.from({ length: Math.min(F.queue, 120) }, (_, k) => <span key={k} style={{ width: 8, height: 8, borderRadius: 2, background: '#94a3b8' }} />)}
            {F.queue > 120 && <span className={s.small}>+{F.queue - 120}</span>}
          </div>
          <div className={s.panelTitle} style={{ marginTop: 8 }}>{cfg.virtual ? t('Virtual threads (one per request)', 'Virtual thread (mỗi request một cái)') : t(`Worker threads (${cfg.workers})`, `Luồng worker (${cfg.workers})`)}</div>
          {cfg.virtual ? (
            <div className={s.kpis}>
              <Kpi k={t('alive', 'đang sống')} v={F.w[0]} />
              <Kpi k={t('on a core', 'trên lõi')} v={F.w[2]} />
              <Kpi k={t('wait core', 'chờ lõi')} v={F.w[1]} />
              <Kpi k={t('wait conn', 'chờ kết nối')} v={F.w[3]} tone={F.w[3] > 20 ? 'warn' : undefined} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(16, cfg.workers)}, minmax(0, 1fr))`, gap: 3 }}>
              {F.w.map((st, k) => <span key={k} title={String(st)} style={{ height: 18, borderRadius: 4, background: WCOL[st], border: '1px solid var(--ol-border)' }} />)}
            </div>
          )}
          <div className={s.panelTitle} style={{ marginTop: 8 }}>{t(`DB connections (${cfg.dbPool})`, `Kết nối CSDL (${cfg.dbPool})`)}{F.waitConn ? ` · ${F.waitConn} ${t('waiting', 'đang chờ')}` : ''}</div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(25, cfg.dbPool)}, minmax(0, 1fr))`, gap: 3 }}>
            {Array.from({ length: cfg.dbPool }, (_, k) => <span key={k} style={{ height: 14, borderRadius: 4, background: k < F.conns ? WCOL[4] : 'var(--ol-panel2)', border: '1px solid var(--ol-border)' }} />)}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 10px', fontSize: 11.5, marginTop: 6 }}>
            {[[t('idle', 'rảnh'), 0], [t('waits for a core', 'chờ lõi'), 1], [t('on a core', 'đang chạy CPU'), 2], [t('waits for a DB conn', 'chờ kết nối'), 3], [t('in the DB', 'trong CSDL'), 4]].map(([n, c]) => (
              <span key={String(c)} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: WCOL[c as number], border: '1px solid var(--ol-border)' }} />{n}</span>
            ))}
          </div>
          <div className={s.kpis} style={{ marginTop: 8 }}>
            <Kpi k={t('in system (L)', 'trong hệ (L)')} v={F.inSys} />
            <Kpi k={t('answered in time', 'trả lời kịp')} v={F.ok} tone="ok" />
            <Kpi k={t('too late', 'quá hạn')} v={F.late} tone={F.late ? 'bad' : undefined} />
            <Kpi k="503" v={F.rej + F.dropped} tone={F.rej + F.dropped ? 'warn' : undefined} />
          </div>
        </div>
        <div className={s.panel}>
          <div className={s.panelTitle}>{t('Second by second', 'Từng giây')}</div>
          <LineChart height={100} title={t('throughput (req/s): arrivals vs answered vs answered in time', 'thông lượng (req/s): đến vs trả lời vs trả lời kịp')} xCount={cfg.duration}
            series={[{ name: t('arrived', 'đến'), color: '#94a3b8', data: secs.map((x) => x.arr) }, { name: t('answered', 'trả lời'), color: '#2563eb', data: secs.map((x) => x.done) }, { name: t('in time', 'kịp'), color: '#16a34a', data: secs.map((x) => x.ok), dash: '5 3' }]} />
          <LineChart height={100} title={t('latency p50 / p99 (ms)', 'độ trễ p50 / p99 (ms)')} xCount={cfg.duration}
            series={[{ name: 'p50', color: '#2563eb', data: secs.map((x) => x.p50) }, { name: 'p99', color: '#dc2626', data: secs.map((x) => x.p99) }]} refs={Number.isFinite(cfg.timeoutMs) ? [{ y: cfg.timeoutMs, label: 'timeout' }] : []} />
          <LineChart height={80} title={t('queue length', 'độ dài hàng đợi')} xCount={cfg.duration} series={[{ name: 'queue', color: '#a855f7', data: secs.map((x) => x.queue), area: true }]} xLabels={['0 s', `${cfg.duration} s`]} />
        </div>
      </div>

      <div className={s.grid2} style={{ marginTop: 10, alignItems: 'start' }}>
        <div className={s.panel}>
          <div className={s.panelTitle}>{t("Little's law on this run", 'Định luật Little trên lần chạy này')}</div>
          <div className={s.mono} style={{ fontSize: 13, lineHeight: 1.7 }}>
            L ({t('avg in system', 'TB trong hệ')}) = <b>{res.L.toFixed(1)}</b><br />
            X · W = {res.X.toFixed(0)}/s × {res.W.toFixed(1)} ms = <b>{((res.X * res.W) / 1000).toFixed(1)}</b><br />
            {t('throughput', 'thông lượng')} X = {res.X.toFixed(0)}/s · goodput = {res.goodput.toFixed(0)}/s<br />
            p50 = {res.p50.toFixed(0)} ms · p99 = {res.p99.toFixed(0)} ms<br />
            {t('busy', 'bận')}: {cfg.virtual ? '' : `workers ${(res.util.workers * 100).toFixed(0)}% · `}{t('cores', 'lõi')} {(res.util.cores * 100).toFixed(0)}%{cfg.dbMs > 0 ? ` · DB ${(res.util.db * 100).toFixed(0)}%` : ''}
            {rho >= 1 && <><br /><span style={{ color: 'var(--ol-bad)' }}>{t('⚠ Overloaded: the queue never empties, so L and X·W drift apart — Little\'s law is about long-run averages of a STABLE system.', '⚠ Quá tải: hàng đợi không bao giờ vơi, nên L và X·W lệch nhau — định luật Little nói về trung bình dài hạn của một hệ ỔN ĐỊNH.')}</span></>}
            {mm && Number.isFinite(mm.W) && <><br />Erlang C (M/M/{cfg.workers}): W = {(mm.W * 1000).toFixed(1)} ms, P({t('wait', 'chờ')}) = {(mm.pWait * 100).toFixed(0)}%</>}
          </div>
          <div className={s.small} style={{ marginTop: 6 }}>{t('Little: average number inside = arrival rate × average time inside. It needs no assumptions — use it backwards: 300 req/s × 0.2 s = 60 requests in flight ⇒ you need ≥ 60 threads (or async).', 'Little: số trung bình bên trong = tốc độ đến × thời gian trung bình bên trong. Không cần giả định gì — dùng ngược lại: 300 req/s × 0,2 s = 60 request đang dở ⇒ cần ≥ 60 luồng (hoặc async).')}</div>
        </div>
        <div className={s.panel}>
          <div className={s.panelTitle}>{t('The curve: what happens as λ grows', 'Đường cong: chuyện gì xảy ra khi λ tăng')}</div>
          <LineChart height={110} title={t('throughput vs offered load (req/s)', 'thông lượng theo tải đưa vào (req/s)')} xCount={curve.length}
            series={[{ name: t('offered λ', 'λ đưa vào'), color: '#94a3b8', data: curve.map((c) => c.lambda), dash: '4 3' }, { name: t('answered', 'trả lời'), color: '#2563eb', data: curve.map((c) => c.X) }, { name: t('in time', 'kịp'), color: '#16a34a', data: curve.map((c) => c.goodput) }]}
            xLabels={[`λ ${Math.round(curve[0].lambda)}`, `λ ${Math.round(curve.at(-1)!.lambda)}`]} />
          <LineChart height={110} logY yMin={Math.max(0.5, Math.min(...curve.map((c) => c.p99).filter((x) => x > 0)) * 0.6)} title={t('p99 latency (ms, log scale) — the knee', 'độ trễ p99 (ms, thang log) — khúc gãy')} xCount={curve.length}
            series={[{ name: 'p99', color: '#dc2626', data: curve.map((c) => c.p99) }]} marks={[{ x: Math.max(0, curve.findIndex((c) => c.lambda >= cfg.lambda)), label: t('you', 'bạn') }]} />
          <div className={s.small}>{t(`Each point is a 20-second run; the x-axis goes up to 1.5 × capacity (${Math.round(cap.rps)} req/s). Past capacity "answered" goes flat, and with timeouts "in time" falls.`, `Mỗi điểm là một lần chạy 20 giây; trục ngang tới 1,5 × sức chứa (${Math.round(cap.rps)} req/s). Quá sức chứa thì "trả lời" đi ngang, có timeout thì "kịp" rơi xuống.`)}</div>
        </div>
      </div>
    </Frame>
  );
}
