'use client';
/**
 * DNS (Chương 3.1): một lần tra tên đi đâu.
 *   trace — phát lại từng gói resolver nhà mạng gửi/nhận (capture thật dnsgoi.sh): mồi gốc, QNAME minimisation, lời giới thiệu,
 *           câu trả lời aa, khoá DNSSEC, rồi lần hỏi thứ hai trúng cache
 *   cache — tự hỏi www.labflow.test, chờ, hỏi lại, xoá cache: trúng / trượt, TTL còn lại (tính ra), thời gian thật 13 ms / 0 ms
 *   stub  — chương trình của bạn không chạy dig: /etc/hosts đi trước DNS (getaddrinfo), search + ndots sinh câu hỏi thừa
 * Engine: engine/dns3.ts. Số liệu: engine/capture3.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { DNS_COLD, DNS_NDOTS, DNS_RESOLVED, DNS_STUB, DNS_TRACE, DNS_WARM } from './engine/capture3';
import { isAuthoritative, isReferral, parseGoi, remainingTtl, role, stubTries, upstreamQueries, type Goi, type Role } from './engine/dns3';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Src, Term, Topo, type TLine } from './parts';
import n from './netlab.module.css';

type Preset = 'trace' | 'cache' | 'stub';
const PRESETS: Preset[] = ['trace', 'cache', 'stub'];
const GOI: Goi[] = DNS_TRACE.slice(1).map((l) => parseGoi(l)!).filter(Boolean);
const NAME: Record<Role, [string, string]> = {
  laptop: ['laptop', 'laptop'], resolver: ['resolver', 'resolver'], root: ['root server', 'máy chủ gốc'], tld: ['TLD .test', 'TLD .test'],
  ns1: ['ns1 (LabFlow)', 'ns1 (LabFlow)'], ns2: ['ns2 (LabFlow)', 'ns2 (LabFlow)'], other: ['?', '?'],
};

function explainGoi(g: Goi, k: number, lang: Lang): { text: string; tone?: 'ok' | 'warn' | 'bad' } {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const a = role(g.from), b = role(g.to);
  const who = (r: Role) => t(NAME[r][0], NAME[r][1]);
  if (g.msg === 'query' && a === 'laptop') return k === 0
    ? { text: t('The laptop’s stub asks its resolver one question: “A record of www.labflow.test?” — and waits. It never walks the tree itself.', 'Stub trên laptop hỏi resolver đúng một câu: “bản ghi A của www.labflow.test?” — rồi chờ. Nó không bao giờ tự đi dọc cây.') }
    : { text: t('One second later the laptop asks the same name again…', 'Một giây sau laptop hỏi lại đúng tên đó…') };
  if (g.msg === 'answer' && b === 'laptop') return k > 10
    ? { text: t('…answered in 0.1 ms from the resolver’s cache — and NOTHING was sent to the Internet this time.', '…được trả lời trong 0,1 ms từ cache của resolver — và lần này KHÔNG có gì được gửi ra Internet.'), tone: 'ok' }
    : { text: t(`The answer goes back to the laptop at ${g.t.toFixed(4)} s: one question from the laptop cost 9 questions upstream.`, `Câu trả lời quay về laptop lúc ${g.t.toFixed(4)} s: một câu của laptop tốn 9 câu hỏi ra ngoài.`), tone: 'ok' };
  if (g.msg === 'query') {
    if (g.name === '.' && g.type === 'NS') return { text: t('Priming: a fresh resolver first asks the root for the current list of root servers (its root-hints file may be old).', 'Mồi (priming): resolver mới khởi động hỏi máy chủ gốc danh sách máy chủ gốc hiện tại (tệp root hints có thể đã cũ).') };
    if (g.type === 'DNSKEY') return { text: t(`DNSSEC: the resolver fetches the public keys of “${g.name}” to check the signatures (lesson 3.5).`, `DNSSEC: resolver lấy khoá công khai của “${g.name}” để kiểm chữ ký (bài 3.5).`) };
    if (g.name.startsWith('_ta-')) return { text: t('Trust-anchor signal (RFC 8145): the resolver tells the root which root key it trusts. Statistics only.', 'Tín hiệu mỏ neo (RFC 8145): resolver báo cho máy chủ gốc biết nó tin khoá gốc nào. Chỉ để thống kê.') };
    return { text: t(`The resolver asks ${who(b)} for “${g.name}” — only the part of the name this server needs (QNAME minimisation).`, `Resolver hỏi ${who(b)} về “${g.name}” — chỉ phần tên mà máy này cần (QNAME minimisation).`) };
  }
  if (isReferral(g)) return { text: t(`${who(a)} does not know the answer: it gives a REFERRAL (“ask these servers”), with their addresses (glue).`, `${who(a)} không biết câu trả lời: nó đưa LỜI GIỚI THIỆU (“hãy hỏi những máy này”), kèm địa chỉ của chúng (glue).`), tone: 'warn' };
  if (isAuthoritative(g)) return { text: t(`${who(a)} answers with the flag aa — the owner’s own answer (${g.result}).`, `${who(a)} trả lời kèm cờ aa — câu trả lời của chính chủ (${g.result}).`), tone: 'ok' };
  return { text: `${who(a)}: ${g.result}` };
}

export default function DnsSim({ lang = 'vi', preset = 'trace' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'trace');
  const p = usePlayer(pre === 'trace' ? GOI.length : 1, 1500);
  useOwnStepSound();
  const prevI = useRef(p.i);
  useEffect(() => {
    if (pre === 'trace' && p.i > prevI.current) labSfx(GOI[p.i]?.msg === 'answer' ? 'pop' : 'tick');
    prevI.current = p.i;
  }, [p.i, pre]);

  // ── cache: đồng hồ ảo + một mục cache ──
  const [clock, setClock] = useState(0);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [log, setLog] = useState<Array<{ at: number; hit: boolean }>>([]);
  const ttlLeft = fetchedAt === null ? 0 : remainingTtl(300, fetchedAt, clock);
  const ask = () => {
    const hit = fetchedAt !== null && ttlLeft > 0;
    if (!hit) setFetchedAt(clock);
    setLog((l) => [...l, { at: clock, hit }]);
    labSfx(hit ? 'hit' : 'miss');
  };
  const wait = (sec: number) => { setClock((c) => c + sec); labSfx('tap'); };
  const flush = () => { setFetchedAt(null); labSfx('off'); };

  // ── stub ──
  const [hosts, setHosts] = useState(true);
  const [ndots, setNdots] = useState(true);

  const load = (k: Preset) => { setPre(k); p.reset(); setClock(0); setFetchedAt(null); setLog([]); labSfx('tap'); };
  const seen = GOI.slice(0, p.i + 1);
  const second = GOI.findIndex((x, k) => k > 0 && role(x.from) === 'laptop');
  const upstream = upstreamQueries(seen.slice(0, second < 0 ? undefined : second));
  const cacheHit = pre === 'trace' && p.atEnd;
  const lastHit = log.at(-1)?.hit ?? false;
  const exists = (nm: string) => nm === 'api.labflow.test' || nm === 'labflow.cdn.test';
  const search = ndots ? ['labflow.test'] : [];
  // không có search: người viết phải gõ đủ tên (api.labflow.test) — mỗi tên hỏi đúng một lần
  const tries = ndots ? [...stubTries('api', search, 5, exists), ...stubTries('labflow.cdn.test', search, 5, exists)] : [...stubTries('api.labflow.test', [], 1, exists), ...stubTries('labflow.cdn.test', [], 1, exists)];
  const wasted = tries.filter((x) => !exists(x)).length;
  useLabBridge('dns', {
    preset: pre, i: p.i, atEnd: p.atEnd, upstream, cacheHit,
    asks: log.length, hits: log.filter((x) => x.hit).length, lastHit, ttlLeft,
    hosts, ndots, appSees: hosts ? '203.0.113.11' : '203.0.113.10', digSees: '203.0.113.10', wasted,
  }, {
    preset: (v) => load(String(v) as Preset),
    ask: () => ask(), wait: (v) => wait(Number(v) || 60), flush: () => flush(),
    hosts: (v) => { setHosts(v !== false); labSfx('tap'); }, ndots: (v) => { setNdots(v !== false); labSfx('tap'); },
  });

  const traceView = pre === 'trace' && (() => {
    const g = GOI[p.i];
    const ex = explainGoi(g, p.i, lang);
    const a = role(g.from), b = role(g.to);
    const pair = (x: Role, y: Role) => (a === x && b === y) || (a === y && b === x);
    const on = (id: Role) => a === id || b === id;
    const topo = (
      <Topo label={t('laptop, resolver and the three levels of name servers', 'laptop, resolver và ba cấp máy chủ tên')} w={560} h={226}
        pill={`${g.msg === 'query' ? '?' : '✓'} ${g.name} ${g.type}`} k={g.msg === 'answer' ? (isReferral(g) ? '#d97706' : '#16a34a') : '#2563eb'}
        nodes={[
          { id: 'laptop', x: 58, y: 118, icon: '💻', name: 'laptop', sub: '192.168.50.10', on: on('laptop'), w: 100 },
          { id: 'resolver', x: 200, y: 118, icon: '🗂️', name: 'resolver', sub: '198.51.100.1', sub2: t('cache', 'cache'), on: on('resolver'), w: 112 },
          { id: 'root', x: 410, y: 48, icon: '🌐', name: t('root', 'gốc'), sub: '192.0.2.10', on: on('root'), w: 104 },
          { id: 'tld', x: 410, y: 118, icon: '🏛️', name: 'TLD .test', sub: '192.0.2.20', on: on('tld'), w: 104 },
          { id: 'ns1', x: 350, y: 194, icon: '📗', name: 'ns1', sub: '203.0.113.53', on: on('ns1'), w: 100 },
          { id: 'ns2', x: 488, y: 194, icon: '📗', name: 'ns2', sub: '203.0.113.54', on: on('ns2'), w: 100 },
        ]}
        links={[
          { a: 'laptop', b: 'resolver', on: pair('laptop', 'resolver'), back: g.msg === 'answer' },
          { a: 'resolver', b: 'root', on: pair('resolver', 'root'), back: g.msg === 'answer' },
          { a: 'resolver', b: 'tld', on: pair('resolver', 'tld'), back: g.msg === 'answer' },
          { a: 'resolver', b: 'ns1', on: pair('resolver', 'ns1'), back: g.msg === 'answer' },
          { a: 'resolver', b: 'ns2', on: pair('resolver', 'ns2'), back: g.msg === 'answer' },
        ]} />
    );
    const lines: TLine[] = [DNS_TRACE[0], ...DNS_TRACE.slice(1, p.i + 2).map((l, k) => ({ t: l, on: k === p.i }))];
    return (
      <>
        <Controls p={p} lang={lang} />
        <Explain tone={ex.tone}>{ex.text}</Explain>
        <div className={s.panel} style={{ padding: 6 }} data-tour="dns-topo">{topo}</div>
        <div className={s.bar} data-tour="dns-kpi">
          <Kpi k={t('time', 'thời gian')} v={`${g.t.toFixed(4)} s`} />
          <Kpi k={t('questions sent upstream', 'câu hỏi gửi ra ngoài')} v={upstream} tone={upstream ? 'warn' : undefined} />
          <Kpi k={t('second lookup', 'lần tra thứ hai')} v={cacheHit ? t('cache hit — 0 upstream', 'trúng cache — 0 câu ra ngoài') : '…'} tone={cacheHit ? 'ok' : undefined} />
        </div>
        <div className={n.cols}>
          <Term lang={lang} tour="dns-capture" title={t('capture on the ISP machine (dnsgoi.sh)', 'bắt gói trên máy nhà mạng (dnsgoi.sh)')} real wrap lines={lines} />
          <WhereBox focus="dns-resolver" lang={lang} height={170} />
        </div>
      </>
    );
  })();

  const cacheView = pre === 'cache' && (
    <>
      <div className={s.bar} data-tour="dns-ask">
        <button type="button" className={cx(s.btn, s.primary)} onClick={ask}>🔎 {t('dig www.labflow.test', 'dig www.labflow.test')}</button>
        <button type="button" className={s.btn} onClick={() => wait(60)}>⏱ {t('wait 60 s', 'chờ 60 s')}</button>
        <button type="button" className={s.btn} onClick={() => wait(300)}>⏱ {t('wait 5 min', 'chờ 5 phút')}</button>
        <button type="button" className={s.btn} onClick={flush}>🧹 {t('flush the resolver', 'xoá cache resolver')}</button>
      </div>
      <Explain tone={log.length ? (lastHit ? 'ok' : 'warn') : undefined}>
        {!log.length ? t('Ask the name. The first question has to walk root → TLD → LabFlow; the resolver then keeps the answer for its TTL (300 s).', 'Hãy hỏi tên. Câu đầu phải đi gốc → TLD → LabFlow; rồi resolver giữ câu trả lời trong TTL của nó (300 s).')
          : lastHit ? t(`Cache hit: answered from memory, TTL ${ttlLeft} s left. Nobody upstream was asked.`, `Trúng cache: trả lời từ bộ nhớ, TTL còn ${ttlLeft} s. Không hỏi ai ở trên.`)
            : t('Cache miss: the resolver walked the tree again (13 ms in the lab) and stored the answer for 300 s.', 'Trượt cache: resolver lại đi dọc cây (13 ms trong lab) và lưu câu trả lời 300 s.')}
      </Explain>
      <div className={n.cols}>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.bar} data-tour="dns-cache-kpi">
            <Kpi k={t('virtual clock', 'đồng hồ ảo')} v={`${clock} s`} />
            <Kpi k={t('TTL left in cache', 'TTL còn trong cache')} v={fetchedAt === null ? '—' : `${ttlLeft} s`} tone={ttlLeft ? 'ok' : 'warn'} />
            <Kpi k={t('hits / asks', 'trúng / số lần hỏi')} v={`${log.filter((x) => x.hit).length} / ${log.length}`} />
          </div>
          <div className={s.small}><Src real={false} lang={lang} /> {t('clock and TTL countdown are simulated; the dig outputs below are real.', 'đồng hồ và TTL đếm ngược là mô phỏng; output dig bên dưới là thật.')}</div>
          <table className={n.rt}>
            <thead><tr><th>{t('at', 'lúc')}</th><th>{t('result', 'kết quả')}</th></tr></thead>
            <tbody>{log.map((x, k) => <tr key={k} className={cx(x.hit ? n.rtWin : n.rtBad, k === log.length - 1 && n.rtNew)}><td>{x.at} s</td><td>{x.hit ? t('hit — from cache', 'trúng — từ cache') : t('miss — walked the tree', 'trượt — đi dọc cây')}</td></tr>)}</tbody>
          </table>
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <Term lang={lang} title="dig www.labflow.test" real wrap lines={log.length ? (lastHit ? [...DNS_COLD.slice(2, 4), ...DNS_WARM.map((l) => ({ t: l, on: true }))] : DNS_COLD.map((l) => ({ t: l, on: /Query time/.test(l) }))) : []} />
          <WhereBox focus="dns-resolver" lang={lang} height={150} />
        </div>
      </div>
    </>
  );

  const stubView = pre === 'stub' && (() => {
    const [nss, getent, dig, curl] = DNS_STUB;
    // hai dòng của Node in theo thứ tự callback về trước — tìm theo chữ, không theo vị trí
    const lookup = DNS_STUB.find((l) => l.startsWith('dns.lookup'))!, resolve = DNS_STUB.find((l) => l.startsWith('dns.resolve4'))!;
    const rows: Array<[string, string, string, boolean]> = [
      ['getent ahosts', 'getaddrinfo → /etc/hosts → DNS', hosts ? getent : t('203.0.113.10 (from DNS)', '203.0.113.10 (từ DNS)'), hosts],
      ['curl', 'getaddrinfo', hosts ? curl : 'LabFlow edge Hanoi (server 203.0.113.10)', hosts],
      ['Node dns.lookup', 'getaddrinfo', hosts ? lookup : 'dns.lookup   203.0.113.10', hosts],
      ['dig', t('DNS only', 'chỉ DNS'), dig, false],
      ['Node dns.resolve4', t('DNS only', 'chỉ DNS'), resolve, false],
    ];
    return (
      <>
        <div className={s.bar} data-tour="dns-stub-opts">
          <button type="button" className={cx(s.btn, hosts && s.on)} onClick={() => { setHosts((v) => !v); labSfx('tap'); }}>📄 {t('/etc/hosts: 203.0.113.11 labflow.test', '/etc/hosts: 203.0.113.11 labflow.test')}</button>
          <button type="button" className={cx(s.btn, ndots && s.on)} onClick={() => { setNdots((v) => !v); labSfx('tap'); }}>🔁 {t('search labflow.test + ndots:5', 'search labflow.test + ndots:5')}</button>
        </div>
        <Explain tone={hosts ? 'warn' : 'ok'}>{hosts
          ? t('Two answers for one name: programs that use getaddrinfo read /etc/hosts first (nsswitch “files dns”) and reach the Singapore edge; dig speaks DNS directly and says .10. Debug with getent, not only dig.', 'Hai câu trả lời cho một tên: chương trình dùng getaddrinfo đọc /etc/hosts trước (nsswitch “files dns”) nên tới máy biên Singapore; dig nói DNS trực tiếp nên nói .10. Gỡ lỗi bằng getent, đừng chỉ dùng dig.')
          : t('Without the hosts line every tool agrees on 203.0.113.10.', 'Không có dòng hosts thì mọi công cụ đều ra 203.0.113.10.')}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} data-tour="dns-stub-table">
              <div className={s.panelTitle}>{t('Who gets which address', 'Ai nhận địa chỉ nào')} <Src real={hosts} lang={lang} en={hosts ? 'real lab output' : 'computed'} vi={hosts ? 'output thật trong lab' : 'tính ra'} /></div>
              <table className={n.rt}>
                <thead><tr><th>{t('tool', 'công cụ')}</th><th>{t('path', 'đường')}</th><th>{t('answer', 'câu trả lời')}</th></tr></thead>
                <tbody>{rows.map(([a, b, c, bad]) => <tr key={a} className={cx(bad && n.rtBad)}><td><code>{a}</code></td><td>{b}</td><td><code>{c}</code></td></tr>)}</tbody>
              </table>
              <div className={s.small} style={{ marginTop: 4 }}><code>{nss}</code> · {DNS_RESOLVED[0]} ({t('Ubuntu: a local cache, systemd-resolved', 'Ubuntu: một bộ đệm cục bộ, systemd-resolved')})</div>
            </div>
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <Term lang={lang} tour="dns-ndots" title={t('names the stub asks for: api, labflow.cdn.test', 'các tên stub đi hỏi: api, labflow.cdn.test')} real={ndots} wrap
              lines={ndots ? DNS_NDOTS.map((l) => ({ t: l, on: l.startsWith('NXDOMAIN') })) : tries.map((x) => ({ t: `${exists(x) ? 'NOERROR ' : 'NXDOMAIN'} ${x}`, calc: true }))} />
            <div className={cx(n.verdict, wasted ? n.vBad : n.vOk)}>{wasted ? t(`${wasted} wasted lookup(s): names with fewer than 5 dots try the search domain first — a final dot (labflow.cdn.test.) skips it.`, `${wasted} lần tra thừa: tên ít hơn 5 dấu chấm thử tên miền search trước — dấu chấm cuối (labflow.cdn.test.) bỏ qua nó.`) : t('No search domain: each name is asked once.', 'Không có tên miền search: mỗi tên hỏi một lần.')}</div>
            <WhereBox focus="dns-resolver" lang={lang} height={140} />
          </div>
        </div>
      </>
    );
  })();

  const presetOptions = useMemo(() => [['trace', t('follow one lookup', 'theo một lần tra')], ['cache', t('the cache', 'cache')], ['stub', t('your program', 'chương trình của bạn')]] as Array<[Preset, string]>, [lang]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('DNS: who answers a name?', 'DNS: ai trả lời một cái tên?')}
      sub={t('Real packets from the resolver of the course’s DNS lab: root, TLD, LabFlow’s name servers', 'Gói thật từ resolver trong lab DNS của khoá: máy chủ gốc, TLD, máy chủ tên của LabFlow')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="dns-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={presetOptions} onChange={load} />
        </div>
        {traceView}{cacheView}{stubView}
        <div className={n.note}>{t('Stub = the DNS client in your program (getaddrinfo). Resolver = walks root → TLD → the domain’s servers for you and caches. Authoritative = the owner’s server; its answers carry the aa flag.', 'Stub = phần DNS trong chương trình của bạn (getaddrinfo). Resolver = đi gốc → TLD → máy chủ của tên miền thay bạn và cache. Authoritative = máy chủ của chính chủ; câu trả lời của nó có cờ aa.')}</div>
      </div>
    </Frame>
  );
}
