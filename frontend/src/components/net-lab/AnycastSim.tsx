'use client';
/**
 * Anycast (Chương 3.4): một IP ở hai nơi, câu trả lời tuỳ ai hỏi, hai IP cho một tên.
 *   anycast    — pop1 (Hà Nội) và pop2 (Singapore) cùng quảng bá 198.19.1.0/24: nhà tới pop1, DC tới pop2; rút pop1 ⇒ nhà chuyển sang pop2
 *   geodns     — DNS của CDN chọn máy biên theo địa chỉ RESOLVER: Việt Nam ⇒ .10, Singapore ⇒ .11 (kể cả khi người dùng ở Việt Nam)
 *   roundrobin — app.labflow.test có .10 và .12 (đã chết): curl / Python / Node mất bao lâu khi .12 đứng đầu (đo thật)
 * Engine: engine/dns3.ts. Số liệu: engine/capture3.ts.
 */
import { useState } from 'react';
import { ANY_BGP, ANY_CF, ANY_DC, ANY_GEO, ANY_GEO_DC, ANY_GEO_SAI, ANY_HOME, ANY_RR_CURL, ANY_RR_DIG, ANY_RR_PY, ANY_RR_THU, ANY_RUT, ANY_THEO } from './engine/capture3';
import { EDGE, RESOLVER_SOURCE, anycastSite, geoView } from './engine/dns3';
import { Explain, Frame, Kpi, Seg, css as s, cx, tx, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Src, Term, Topo } from './parts';
import n from './netlab.module.css';

type Preset = 'anycast' | 'geodns' | 'roundrobin';
const PRESETS: Preset[] = ['anycast', 'geodns', 'roundrobin'];
type Via = 'isp' | 'pop1' | 'pop2' | 'pop2vn';
type Client = 'curl' | 'python' | 'node';
const num = (l: string) => Number((l.match(/([\d.]+) ?(s|ms)?$/) ?? [])[1]);
/** thời gian kết nối đo thật khi .12 đứng đầu / đứng sau (ms) */
const COST: Record<Client, { first: number; second: number; src: string }> = {
  curl: { first: Math.round(num(ANY_RR_CURL[1].split('connect ')[1]) * 1000), second: Math.round(num(ANY_RR_CURL[0].split('connect ')[1]) * 1000 * 10) / 10, src: 'c34-rr' },
  python: { first: Math.round(num(ANY_RR_PY[0].split('after ')[1]) * 1000), second: Math.round(num(ANY_RR_PY[1].split('after ')[1]) * 1000), src: 'c34-rr' },
  node: { first: Number(ANY_RR_THU.at(-1)!.match(/after (\d+) ms/)![1]), second: 0, src: 'c34-rr-thu' },
};

export default function AnycastSim({ lang = 'vi', preset = 'anycast' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'anycast');
  const [pop1Up, setPop1Up] = useState(true);
  const [via, setVia] = useState<Via>('isp');
  const [client, setClient] = useState<Client>('curl');
  const [deadFirst, setDeadFirst] = useState(true);
  const load = (k: Preset) => { setPre(k); setPop1Up(true); setVia('isp'); setClient('curl'); setDeadFirst(true); labSfx('tap'); };
  const home = anycastSite('home', { pop1: pop1Up, pop2: true });
  const dc = anycastSite('dc', { pop1: pop1Up, pop2: true });
  const src = via === 'isp' ? RESOLVER_SOURCE.isp : via === 'pop1' ? RESOLVER_SOURCE.pop1 : RESOLVER_SOURCE.pop2;
  const view = geoView(src);
  const edge = EDGE[view];
  const ms = deadFirst ? COST[client].first : COST[client].second;
  useLabBridge('anycast', {
    preset: pre, pop1Up, home, dc, via, view, edge, userInVietnam: via !== 'pop2', client, deadFirst, ms,
  }, {
    preset: (v) => load(String(v) as Preset),
    pop: (v) => { setPop1Up(v !== false); labSfx(v === false ? 'off' : 'on'); },
    via: (v) => { setVia(String(v) as Via); labSfx('tap'); },
    client: (v) => { setClient(String(v) as Client); labSfx('tap'); },
    deadFirst: (v) => { setDeadFirst(v !== false); labSfx('tap'); },
  });

  const anycastView = pre === 'anycast' && (() => {
    const topo = (
      <Topo label={t('two sites announce 198.19.1.0/24', 'hai điểm quảng bá 198.19.1.0/24')} w={560} h={210}
        pill={pop1Up ? '198.19.1.1 = pop1 (home) · pop2 (DC)' : t('pop1 withdrawn ⇒ everyone → pop2', 'pop1 đã rút ⇒ mọi người → pop2')} k={pop1Up ? '#2563eb' : '#dc2626'}
        nodes={[
          { id: 'laptop', x: 60, y: 60, icon: '💻', name: 'laptop', sub: t('home', 'ở nhà'), on: true, w: 96 },
          { id: 'srv', x: 60, y: 160, icon: '🖥️', name: 'server', sub: 'DC', on: true, w: 96 },
          { id: 'isp', x: 220, y: 60, icon: '🏢', name: 'isp', sub: 'AS64500', w: 96 },
          { id: 'dc', x: 220, y: 160, icon: '🏭', name: 'dc', sub: 'AS64510', w: 96 },
          { id: 'pop1', x: 440, y: 60, icon: '📍', name: 'pop1 Hanoi', sub: '198.19.1.1', gone: !pop1Up, on: home === 'pop1', w: 130 },
          { id: 'pop2', x: 440, y: 160, icon: '📍', name: 'pop2 Singapore', sub: '198.19.1.1', on: home === 'pop2' || dc === 'pop2', w: 140 },
        ]}
        links={[
          { a: 'laptop', b: 'isp', on: true }, { a: 'srv', b: 'dc', on: true },
          { a: 'isp', b: 'pop1', on: home === 'pop1', dashed: !pop1Up }, { a: 'isp', b: 'dc', on: home === 'pop2', label: 'IX' },
          { a: 'dc', b: 'pop2', on: true },
        ]} />
    );
    return (
      <>
        <div className={s.bar} data-tour="any-btn">
          <button type="button" className={cx(s.btn, !pop1Up && s.on)} onClick={() => { setPop1Up((v) => !v); labSfx(pop1Up ? 'off' : 'on'); }}>{pop1Up ? `🔻 ${t('pop1 stops announcing (maintenance)', 'pop1 ngừng quảng bá (bảo trì)')}` : `🔺 ${t('pop1 announces again', 'pop1 quảng bá lại')}`}</button>
        </div>
        <Explain tone={pop1Up ? undefined : 'warn'}>{pop1Up
          ? t('Same address, two machines. The ISP router picks the shorter AS path (64530 via pop1); the DC router picks pop2 (its direct neighbour). DNS plays no part.', 'Cùng một địa chỉ, hai cái máy. Router ISP chọn đường AS ngắn hơn (64530 qua pop1); router DC chọn pop2 (láng giềng trực tiếp). DNS không tham gia.')
          : t('The ISP router lost one route and uses the other: the laptop reached pop2 the very next second — no new IP, no config, no TTL.', 'Router ISP mất một tuyến và dùng tuyến kia: laptop tới pop2 ngay giây sau — không IP mới, không cấu hình, không TTL.')}</Explain>
        <div className={s.panel} style={{ padding: 6 }} data-tour="any-topo">{topo}</div>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <Term lang={lang} tour="any-who" title={pop1Up ? t('“which copy are you?” — home, then DC', '“anh là bản nào?” — ở nhà, rồi DC') : t('laptop, every second (pop1 withdrawn at 16:22:56)', 'laptop, mỗi giây (pop1 rút lúc 16:22:56)')} real wrap
              lines={pop1Up ? [...ANY_HOME.map((l) => ({ t: `home  ${l}`, on: /pop1/.test(l) })), ...ANY_DC.map((l) => ({ t: `dc    ${l}`, on: /pop2/.test(l) }))] : [{ t: `# pop1: ${ANY_RUT[0]}`, dim: true }, ...ANY_THEO.map((l) => ({ t: l, on: /pop2/.test(l) }))]} />
            <div className={s.bar}><Kpi k={t('home reaches', 'nhà tới')} v={home ?? '—'} tone={home === 'pop1' ? 'ok' : 'warn'} /><Kpi k={t('DC reaches', 'DC tới')} v={dc ?? '—'} /></div>
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <Term lang={lang} title="vtysh -c 'show ip bgp 198.19.1.0/24'  # isp" real={pop1Up} wrap lines={pop1Up ? ANY_BGP.map((l) => ({ t: l, on: /best/.test(l) })) : [{ t: '64510 64530  via 192.0.2.3 — best (only path left)', calc: true }]} />
            <WhereBox focus="anycast" lang={lang} height={140} />
          </div>
        </div>
      </>
    );
  })();

  const geoView_ = pre === 'geodns' && (() => {
    const lines = via === 'isp' ? ANY_GEO.slice(0, 2) : via === 'pop1' ? ANY_GEO.slice(2, 4) : via === 'pop2' ? ANY_GEO_DC : ANY_GEO_SAI;
    return (
      <>
        <div className={s.bar} data-tour="geo-via">
          <Seg label={t('Who asks the CDN’s DNS?', 'Ai hỏi DNS của CDN?')} value={via} onChange={(v) => { setVia(v); labSfx('tap'); }}
            options={[['isp', t('laptop via ISP resolver', 'laptop qua resolver nhà mạng')], ['pop1', t('laptop via public DNS (pop1)', 'laptop qua DNS công cộng (pop1)')], ['pop2', t('DC machine via pop2', 'máy DC qua pop2')], ['pop2vn', t('laptop, pop1 down ⇒ pop2', 'laptop, pop1 sập ⇒ pop2')]]} />
        </div>
        <Explain tone={via === 'pop2vn' ? 'bad' : view === 'vn' ? 'ok' : undefined}>{via === 'pop2vn'
          ? t('The user is in Vietnam, but the CDN’s name server only sees the resolver (pop2, Singapore) and hands out the Singapore edge. ECS could pass part of the user’s address — 1.1.1.1 deliberately does not.', 'Người dùng ở Việt Nam, nhưng máy chủ tên của CDN chỉ thấy resolver (pop2, Singapore) và đưa máy biên Singapore. ECS có thể gửi một phần địa chỉ người dùng — 1.1.1.1 cố ý không gửi.')
          : t(`The question reaches ns1.cdn.test from ${src} ⇒ view “${view}” ⇒ edge ${edge}.`, `Câu hỏi tới ns1.cdn.test từ ${src} ⇒ view “${view}” ⇒ máy biên ${edge}.`)}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.bar} data-tour="geo-kpi"><Kpi k={t('source seen by the CDN DNS', 'nguồn DNS của CDN thấy')} v={src} /><Kpi k="view" v={view} /><Kpi k={t('edge', 'máy biên')} v={edge} tone={via === 'pop2vn' ? 'bad' : 'ok'} /></div>
            <Term lang={lang} tour="geo-term" title="static.labflow.test" real wrap lines={lines.map((l) => ({ t: l, on: /203\.0\.113\.1[01]|edge/.test(l) }))} />
          </div>
          <WhereBox focus="anycast" lang={lang} height={160} />
        </div>
      </>
    );
  })();

  const rrView = pre === 'roundrobin' && (
    <>
      <div className={s.bar} data-tour="rr-opts">
        <Seg label={t('Client', 'Client')} value={client} onChange={(v) => { setClient(v); labSfx('tap'); }} options={[['curl', 'curl'], ['python', 'Python'], ['node', 'Node']]} />
        <Seg label={t('Dead .12 comes', '.12 (chết) đứng')} value={deadFirst ? 'first' : 'second'} onChange={(v) => { setDeadFirst(v === 'first'); labSfx('tap'); }} options={[['first', t('first', 'đầu')], ['second', t('second', 'sau')]]} />
      </div>
      <Explain tone={deadFirst && ms > 1000 ? 'bad' : deadFirst ? 'warn' : 'ok'}>{!deadFirst
        ? t('The live address came first: connected at once.', 'Địa chỉ còn sống đứng đầu: kết nối ngay.')
        : client === 'curl' ? t('curl starts the next address after its Happy Eyeballs delay (200 ms) instead of waiting for .12 to fail.', 'curl bắt đầu địa chỉ kế tiếp sau khoảng trễ Happy Eyeballs (200 ms) thay vì chờ .12 thất bại.')
          : client === 'python' ? t('Python waits for .12 to fail (“No route to host” after ~3 s) before trying .10. Behind a silent firewall it would wait the whole connect timeout.', 'Python chờ .12 thất bại (“No route to host” sau ~3 s) rồi mới thử .10. Sau một tường lửa im lặng nó sẽ chờ trọn connect timeout.')
            : t('Node (autoSelectFamily) gives each address up to 250 ms.', 'Node (autoSelectFamily) cho mỗi địa chỉ tối đa 250 ms.')}</Explain>
      <div className={n.cols}>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.bar} data-tour="rr-kpi"><Kpi k={t('time to connect', 'thời gian kết nối')} v={client === 'node' && !deadFirst ? t('— (not measured)', '— (không đo)') : `${ms} ms`} tone={ms > 1000 ? 'bad' : ms > 100 ? 'warn' : 'ok'} /><Kpi k={t('source', 'nguồn')} v={<Src real lang={lang} en={COST[client].src} vi={COST[client].src} />} /></div>
          <Term lang={lang} title={t('the resolver rotates the two A records', 'resolver xoay vòng hai bản ghi A')} real wrap lines={ANY_RR_DIG.map((l) => ({ t: l, on: l.startsWith('203.0.113.12') }))} />
        </div>
        <Term lang={lang} tour="rr-term" title={client} real wrap lines={(client === 'curl' ? [...ANY_RR_CURL, ...ANY_RR_THU.slice(0, 3)] : client === 'python' ? ANY_RR_PY : ANY_RR_THU.slice(-2)).map((l) => ({ t: l, on: /0\.20|2\.8|3\.0|after \d{3} ms|Trying 203\.0\.113\.10/.test(l) }))} />
      </div>
      <div className={cx(n.verdict, n.vBad)}>{t('Round-robin DNS has no health check: the dead .12 stays in every answer until removed (and then one more TTL). Use health-checked DNS or a load balancer.', 'DNS round-robin không kiểm tra sức khoẻ: .12 đã chết nằm trong mọi câu trả lời tới khi gỡ (rồi thêm một TTL). Hãy dùng DNS có kiểm tra sức khoẻ hoặc bộ cân bằng tải.')}</div>
      <div className={s.small}>{t('Real world: ', 'Ngoài đời: ')}<code>{ANY_CF.at(-1)}</code> = {t('the 1.1.1.1 site that answered the course lab (Hong Kong).', 'điểm 1.1.1.1 đã trả lời lab của khoá (Hồng Kông).')}</div>
    </>
  );

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('Anycast, GeoDNS and round-robin DNS', 'Anycast, GeoDNS và DNS round-robin')}
      sub={t('Real BGP, dig and connect timings from the course’s DNS lab', 'BGP, dig và thời gian kết nối đo thật trong lab DNS của khoá')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="any-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} onChange={load} options={[['anycast', 'anycast'], ['geodns', 'GeoDNS'], ['roundrobin', 'round robin']]} />
        </div>
        {anycastView}{geoView_}{rrView}
        <div className={n.note}>{t('Anycast = one prefix announced from several places; routing sends each network to its nearest copy. GeoDNS = the authoritative server answers by the asking resolver’s address. Round robin = several A records for one name.', 'Anycast = một dải được quảng bá từ nhiều nơi; định tuyến đưa mỗi mạng tới bản gần nhất. GeoDNS = máy chủ authoritative trả lời theo địa chỉ resolver đi hỏi. Round robin = nhiều bản ghi A cho một tên.')}</div>
      </div>
    </Frame>
  );
}
