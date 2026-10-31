'use client';
/**
 * "Gõ URL rồi bấm Enter" thành biểu đồ thác thời gian, từ số `curl -w` THẬT tới cuongthai.com:
 *   cold — lần đầu (3 lần chạy thật), warm — URL thứ hai trên kết nối dùng lại, far — example.com ở xa (qua Cloudflare)
 * Bẫy hay gặp: số curl -w CỘNG DỒN từ lúc bắt đầu — hiện cả "curl nói" lẫn "chặng này dài bao lâu".
 * Thanh RTT là mô hình TÍNH RA (TCP ≈ 1 RTT, TLS 1.3 ≈ 1 RTT, request → byte đầu ≈ 1 RTT + máy chủ…).
 * Engine: engine/waterfall.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { CURL, type CurlW } from './engine/capture';
import { CURL_VAR, PHASES, PHASE_COLOR, distanceShare, model, phasesFromCurl, total, type Phase, type PhaseId } from './engine/waterfall';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import n from './netlab.module.css';

type Preset = 'cold' | 'warm' | 'far';
const WHERE: Record<PhaseId, string> = { dns: 'dns-cache', tcp: 'tcp-stack', tls: 'tls', wait: 'server-work', download: 'nic-frame' };
const NAME: Record<PhaseId, [string, string, string, string]> = {
  dns: ['DNS lookup', 'Tra DNS', 'name → IP', 'tên → IP'],
  tcp: ['TCP connect', 'Kết nối TCP', '3-way handshake', 'bắt tay 3 bước'],
  tls: ['TLS handshake', 'Bắt tay TLS', 'keys + certificate', 'khoá + chứng chỉ'],
  wait: ['Waiting (TTFB)', 'Chờ byte đầu', 'request + server work', 'request + máy chủ làm'],
  download: ['Download', 'Tải về', 'the rest of the bytes', 'phần byte còn lại'],
};
const fmt = (x: number) => (x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2));

function text(id: PhaseId, P: Phase[], pre: Preset): [string, string] {
  const d = P.find((x) => x.id === id)!.dur;
  const ms = `${fmt(d)} ms`;
  switch (id) {
    case 'dns': return pre === 'warm'
      ? [`DNS ${ms}: curl already knows the IP for this name — nothing is asked.`, `DNS ${ms}: curl đã biết IP của tên này — không hỏi gì cả.`]
      : pre === 'far' ? [`DNS ${ms}: five times slower than for cuongthai.com — this name was most likely not cached yet, so the question went out to a resolver and back.`, `DNS ${ms}: chậm gấp năm lần so với cuongthai.com — nhiều khả năng tên này chưa có trong cache, nên câu hỏi phải ra tới resolver rồi quay về.`]
        : [`DNS ${ms}: the OS resolver (macOS keeps a cache) answered with the IP. For comparison, dig asking the home router directly took ${CURL.digMs} ms.`, `DNS ${ms}: bộ phân giải của HĐH (macOS có cache) trả về IP. Để so: dig hỏi thẳng router nhà mất ${CURL.digMs} ms.`];
    case 'tcp': return pre === 'warm'
      ? ['TCP 0 ms: the connection from the first URL is reused — no handshake at all. curl reports connect = 0.', 'TCP 0 ms: kết nối của URL đầu được dùng lại — không bắt tay gì cả. curl báo connect = 0.']
      : [`TCP ${ms}: SYN → SYN-ACK → ACK. The kernels of both machines do this; it costs about one round trip (RTT) — the time for a packet to go there and back.`, `TCP ${ms}: SYN → SYN-ACK → ACK. Nhân của hai máy làm việc này; tốn khoảng một vòng đi-về (RTT) — thời gian một gói đi tới đó và quay lại.`];
    case 'tls': return pre === 'warm'
      ? ['TLS 0 ms: the encrypted session is already set up. curl reports appconnect = 0.', 'TLS 0 ms: phiên mã hoá đã có sẵn. curl báo appconnect = 0.']
      : [`TLS ${ms}: client and server agree on keys and the server proves who it is with its certificate. With TLS 1.3 (modern servers) that is one round trip; the maths runs in the TLS library inside curl, on the CPU.`, `TLS ${ms}: client và máy chủ thống nhất khoá và máy chủ chứng minh nó là ai bằng chứng chỉ. Với TLS 1.3 (máy chủ hiện đại) là một vòng đi-về; phép toán chạy trong thư viện TLS bên trong curl, trên CPU.`];
    case 'wait': return [`Waiting ${ms}: the request travels there (½ RTT), the SERVER works — nginx → API → database — and the first byte travels back (½ RTT). This is the only phase the backend developer controls directly.`, `Chờ ${ms}: request đi tới (½ RTT), MÁY CHỦ làm việc — nginx → API → CSDL — và byte đầu tiên đi về (½ RTT). Đây là chặng duy nhất lập trình viên backend điều khiển trực tiếp.`];
    default: if (d < 1) return [`Download ${ms}: this page is tiny — it arrived together with the first byte, nothing was left to fetch.`, `Tải về ${ms}: trang này rất nhỏ — nó tới cùng byte đầu tiên, không còn gì để tải thêm.`];
      return [`Download ${ms}: the remaining bytes arrive. TCP starts slowly (about 10 segments per round trip, then doubling), so bigger pages need more round trips.`, `Tải về ${ms}: phần byte còn lại tới. TCP khởi động chậm (khoảng 10 đoạn mỗi vòng đi-về, rồi gấp đôi), nên trang lớn cần nhiều vòng hơn.`];
  }
}

export default function WaterfallSim({ lang = 'vi', preset = 'cold' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(['cold', 'warm', 'far'].includes(preset) ? (preset as Preset) : 'cold');
  const [run, setRun] = useState(0);
  const [cum, setCum] = useState(false);
  const [rtt, setRtt] = useState(6);
  const [reuse, setReuse] = useState(false);
  const [tls12, setTls12] = useState(false);
  const [dnsCached, setDnsCached] = useState(false);
  const w: CurlW = pre === 'cold' ? CURL.cold[run] : pre === 'warm' ? CURL.warm : CURL.far;
  const P = useMemo(() => phasesFromCurl(w), [w]);
  const T = total(P);
  const p = usePlayer(PHASES.length + 1, 1900);
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => { if (p.i > prev.current) labSfx(p.atEnd ? 'done' : P[p.i - 1]?.dur === 0 ? 'pop' : 'blip-exec'); prev.current = p.i; }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps
  const load = (k: Preset) => { setPre(k); setRun(0); p.reset(); labSfx('tap'); };

  const cfg = { rtt, resolverRtt: CURL.digMs, dnsCached, reuse, tls12, serverMs: 15, pageKB: 60 };
  const M = useMemo(() => model(cfg), [rtt, dnsCached, reuse, tls12]); // eslint-disable-line react-hooks/exhaustive-deps
  const MT = total(M);

  useLabBridge('wf', { preset: pre, run, i: p.i, atEnd: p.atEnd, cum, rtt, reuse, tls12, dnsCached, total: T, modelTotal: MT, tlsMs: P[2].dur }, {
    preset: (v) => load(String(v) as Preset),
    run: (v) => { setRun(Math.max(0, Math.min(2, Number(v)))); p.reset(); labSfx('tap'); },
    cum: (v) => { setCum(!!v); labSfx(v ? 'on' : 'off'); },
    rtt: (v) => setRtt(Number(v)),
    reuse: (v) => { setReuse(!!v); labSfx('tap'); },
    tls12: (v) => setTls12(!!v),
    dnsCached: (v) => setDnsCached(!!v),
  });

  const cur = p.i >= 1 ? P[p.i - 1] : null;
  const chart = (rows: Phase[], tot: number, upTo: number, showCum: boolean, curlCol: boolean, hl = true) => (
    <div className={n.wf}>
      {rows.map((x, k) => (
        <div key={x.id} className={cx(n.wfRow, hl && k === upTo - 1 && n.wfRowOn, k >= upTo && n.wfRowFuture)}>
          <span className={n.wfName}>{t(NAME[x.id][0], NAME[x.id][1])}<small>{t(NAME[x.id][2], NAME[x.id][3])}</small></span>
          <span className={n.wfTrack}>
            {showCum && k < upTo && <span className={n.wfCum} style={{ width: `${(100 * x.end) / tot}%` }} />}
            <span className={n.wfBar} style={{ left: `${(100 * x.start) / tot}%`, width: `${Math.max(x.dur > 0 ? 0.8 : 0, (100 * x.dur) / tot)}%`, background: PHASE_COLOR[x.id] }} />
          </span>
          <span className={n.wfNums}>
            {k < upTo ? <><b style={{ color: showCum ? undefined : PHASE_COLOR[x.id] }}>{showCum ? x.curlSays.toFixed(6) : `${fmt(x.dur)} ms`}</b>
              {curlCol && <i>{showCum ? `= ${fmt(x.end)} ms ${t('from start', 'từ đầu')}` : `curl: ${x.curlSays.toFixed(6)}`}</i>}</> : <i>—</i>}
          </span>
        </div>
      ))}
      <div className={n.wfAxis}><span /><div><span>0</span><span>{fmt(tot / 2)}</span><span>{fmt(tot)} ms</span></div><span /></div>
    </div>
  );

  const ex = cur ? text(cur.id, P, pre) : null;
  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('Type a URL, press Enter: where the time goes', 'Gõ URL, bấm Enter: thời gian đi đâu')}
      sub={t('Real curl -w timings from a laptop in Hanoi to https://cuongthai.com (31/10/2026)', 'Số curl -w thật từ một laptop ở Hà Nội tới https://cuongthai.com (31/10/2026)')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="wf-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['cold', t('first visit', 'lần đầu')], ['warm', t('reused connection', 'dùng lại kết nối')], ['far', t('far away (example.com)', 'ở xa (example.com)')]]} onChange={load} />
          {pre === 'cold' && <Seg label={t('run', 'lần chạy')} value={run} options={[[0, '1'], [1, '2'], [2, '3']]} onChange={(v) => { setRun(v); p.reset(); labSfx('tap'); }} />}
        </div>
        <Controls p={p} lang={lang} label={cur ? t(NAME[cur.id][0], NAME[cur.id][1]) : t('press Enter…', 'bấm Enter…')} />
        <Explain tone={p.atEnd ? 'ok' : undefined}>
          {ex ? <><b className={s.mono}>{CURL_VAR[cur!.id]} = {cur!.curlSays.toFixed(6)}</b> — {t(ex[0], ex[1])}</>
            : <><b className={s.mono}>curl -w &apos;dns=%&#123;time_namelookup&#125; connect=%&#123;time_connect&#125; tls=%&#123;time_appconnect&#125; ttfb=%&#123;time_starttransfer&#125; total=%&#123;time_total&#125;&apos;</b> — {t('You press Enter. Five things happen one after another before the page is complete. Press Step to reveal them.', 'Bạn bấm Enter. Năm việc lần lượt xảy ra trước khi trang về đủ. Bấm Bước để mở từng việc.')}</>}
          {p.atEnd && <> {t(`Total ${fmt(T)} ms.`, `Tổng ${fmt(T)} ms.`)}</>}
        </Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} data-tour="wf-chart">
              <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ flex: 1 }}>{t('Measured waterfall', 'Biểu đồ thác đo thật')} <span className={cx(n.src, n.srcReal)}>{t('measured', 'đo thật')}</span></span>
                <span data-tour="wf-cum"><Seg value={cum ? 'cum' : 'dur'} options={[['dur', t('this phase', 'chặng này')], ['cum', t('what curl says', 'curl nói')]]} onChange={(v) => { setCum(v === 'cum'); labSfx('tap'); }} /></span>
              </div>
              {chart(P, T, p.i, cum, true)}
              <div className={n.note} style={{ marginTop: 6 }}>{cum
                ? t('curl -w prints CUMULATIVE times: time_appconnect = 0.056536 means “TLS finished 56.5 ms after the start”, not “TLS took 56.5 ms”. Subtract the previous mark to get one phase.', 'curl -w in thời gian CỘNG DỒN: time_appconnect = 0.056536 nghĩa là “TLS xong lúc 56,5 ms tính từ đầu”, không phải “TLS mất 56,5 ms”. Trừ mốc trước để ra một chặng.')
                : t('One run is noisy: the same TCP connect took 36.2, 5.5 and 6.6 ms in the three cold runs. Measure several times and look at the typical value.', 'Một lần đo thì nhiễu: cùng bước kết nối TCP mất 36,2, 5,5 và 6,6 ms trong ba lần chạy. Đo nhiều lần và nhìn giá trị điển hình.')}</div>
            </div>
            <WhereBox focus={cur ? WHERE[cur.id] : 'app-buffer'} lang={lang} height={200} />
            <div className={n.note}>{cur ? t(`Where: ${cur.id === 'dns' ? 'the stub resolver and its cache in RAM, then a UDP question over the network' : cur.id === 'tcp' ? 'kernel TCP on both machines + one trip over the network' : cur.id === 'tls' ? 'the TLS library inside curl, doing public-key maths on a CPU core' : cur.id === 'wait' ? 'the server: nginx → API → database, on the OTHER machine' : 'the network chip → kernel → socket buffer → curl'}.`, `Ở đâu: ${cur.id === 'dns' ? 'bộ phân giải và cache của nó trong RAM, rồi một câu hỏi UDP qua mạng' : cur.id === 'tcp' ? 'TCP của nhân trên hai máy + một vòng qua mạng' : cur.id === 'tls' ? 'thư viện TLS bên trong curl, làm toán khoá công khai trên một lõi CPU' : cur.id === 'wait' ? 'máy chủ: nginx → API → CSDL, trên máy BÊN KIA' : 'chip mạng → nhân → bộ đệm socket → curl'}.`) : t('Where: curl, an ordinary program in user space.', 'Ở đâu: curl, một chương trình bình thường ở không gian người dùng.')}</div>
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.kpis}>
              <Kpi k={t('total (measured)', 'tổng (đo)')} v={`${fmt(T)} ms`} />
              <Kpi k={t('before the request even leaves', 'trước khi request kịp đi')} v={`${fmt(P[2].end)} ms`} tone={P[2].end > 50 ? 'warn' : undefined} />
            </div>
            <div className={s.panel} data-tour="wf-model">
              <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>{t('What if the server were farther away?', 'Nếu máy chủ ở xa hơn thì sao?')} <span className={cx(n.src, n.srcCalc)}>{t('computed model', 'mô hình tính ra')}</span></div>
              <div className={n.slider} data-tour="wf-rtt">RTT <input type="range" min={1} max={300} value={rtt} onChange={(e) => setRtt(Number(e.target.value))} aria-label="RTT (ms)" /> <b>{rtt} ms</b></div>
              <div className={s.bar}>
                <Seg value={reuse ? 'y' : 'n'} options={[['n', t('new connection', 'kết nối mới')], ['y', t('reused', 'dùng lại')]]} onChange={(v) => { setReuse(v === 'y'); labSfx('tap'); }} />
                <Seg value={tls12 ? '12' : '13'} options={[['13', 'TLS 1.3'], ['12', 'TLS 1.2']]} onChange={(v) => setTls12(v === '12')} />
                <Seg value={dnsCached ? 'y' : 'n'} options={[['n', t('DNS not cached', 'DNS chưa cache')], ['y', t('DNS cached', 'DNS đã cache')]]} onChange={(v) => setDnsCached(v === 'y')} />
              </div>
              {chart(M, Math.max(MT, 1), PHASES.length, false, false, false)}
              <div className={s.kpis} style={{ marginTop: 6 }}>
                <Kpi k={t('total', 'tổng')} v={`${MT} ms`} tone={MT > 500 ? 'bad' : MT > 200 ? 'warn' : 'ok'} />
                <Kpi k={t('spent on distance', 'tốn cho khoảng cách')} v={`${distanceShare(M, cfg.serverMs)}%`} />
              </div>
              <div className={n.note}>{t('Model: DNS = 1 round trip to the resolver (16 ms, like dig) unless cached · TCP = 1 RTT · TLS 1.3 = 1 RTT (1.2 = 2) · waiting = 1 RTT + 15 ms of server work · download of a 60 KB page = 2 more RTT (slow start from 10 segments). Bandwidth ignored.', 'Mô hình: DNS = 1 vòng tới resolver (16 ms, như dig) trừ khi đã cache · TCP = 1 RTT · TLS 1.3 = 1 RTT (1.2 = 2) · chờ = 1 RTT + 15 ms máy chủ làm · tải trang 60 KB = thêm 2 RTT (slow start từ 10 đoạn). Bỏ qua băng thông.')}</div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
