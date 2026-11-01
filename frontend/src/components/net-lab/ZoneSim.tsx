'use client';
/**
 * Zone (Chương 3.2): bản ghi, luật của tệp vùng, máy chính/máy phụ.
 *   records — chọn một loại bản ghi: câu trả lời dig thật + nó dùng để làm gì + quy tắc của nó
 *   apex    — bốn lỗi kinh điển qua named-checkzone (thật): CNAME ở đỉnh, CNAME đứng chung, MX trỏ IP, quên dấu chấm cuối
 *   serial  — sửa bản ghi trên ns1 mà quên tăng serial ⇒ ns1/ns2 trả lời khác nhau; tăng serial ⇒ NOTIFY + chép vùng
 * Engine: engine/dns3.ts (checkZone, fqdn, secondaryTransfers). Số liệu: engine/capture3.ts.
 */
import { useState } from 'react';
import {
  ZONE_A, ZONE_AAAA, ZONE_APEX, ZONE_CAA, ZONE_CDN, ZONE_CHUNG, ZONE_CNAME, ZONE_DOT, ZONE_HTTPS, ZONE_MX, ZONE_MXIP, ZONE_NS, ZONE_NS2LOG,
  ZONE_OK, ZONE_SERIAL_BAD, ZONE_SERIAL_OK, ZONE_SOA, ZONE_SRV, ZONE_TXT,
} from './engine/capture3';
import { checkZone, secondaryTransfers, type Rec } from './engine/dns3';
import { Explain, Frame, Seg, css as s, cx, tx, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Picks, Src, Term, Topo } from './parts';
import n from './netlab.module.css';

type Preset = 'records' | 'apex' | 'serial';
const PRESETS: Preset[] = ['records', 'apex', 'serial'];
type RType = 'A' | 'AAAA' | 'CNAME' | 'CDN' | 'MX' | 'TXT' | 'CAA' | 'SRV' | 'HTTPS' | 'NS' | 'SOA';
const ANSWERS: Record<RType, readonly string[]> = { A: ZONE_A, AAAA: ZONE_AAAA, CNAME: ZONE_CNAME, CDN: ZONE_CDN, MX: ZONE_MX, TXT: ZONE_TXT, CAA: ZONE_CAA, SRV: ZONE_SRV, HTTPS: ZONE_HTTPS, NS: ZONE_NS, SOA: ZONE_SOA };
const WHAT: Record<RType, [string, string, string, string]> = {
  A: ['An IPv4 address for the name.', 'Một địa chỉ IPv4 cho tên.', 'A name may have several A records (round robin, lesson 3.4).', 'Một tên có thể có nhiều bản ghi A (round robin, bài 3.4).'],
  AAAA: ['An IPv6 address for the name.', 'Một địa chỉ IPv6 cho tên.', 'Clients try IPv6 and IPv4 with Happy Eyeballs (lesson 2.4).', 'Client thử IPv6 và IPv4 bằng Happy Eyeballs (bài 2.4).'],
  CNAME: ['An alias inside the zone: www → labflow.test. The resolver follows it.', 'Một bí danh trong vùng: www → labflow.test. Resolver đi theo nó.', 'A CNAME cannot coexist with any other record at the same name — never at the apex.', 'CNAME không đứng chung với bản ghi nào ở cùng tên — không bao giờ ở đỉnh.'],
  CDN: ['An alias to ANOTHER company’s name: static → labflow.cdn.test (the CDN can change its IPs freely).', 'Bí danh sang tên của công ty KHÁC: static → labflow.cdn.test (CDN tự do đổi IP).', 'Notice the CDN’s own, much shorter TTL on the second line.', 'Để ý TTL riêng, ngắn hơn nhiều, của CDN ở dòng thứ hai.'],
  MX: ['Which server receives mail for @labflow.test (lower number = tried first).', 'Máy nhận thư cho @labflow.test (số nhỏ hơn = thử trước).', 'MX must point to a NAME with A/AAAA — never an IP, never a CNAME.', 'MX phải trỏ tới một TÊN có A/AAAA — không trỏ IP, không trỏ CNAME.'],
  TXT: ['Free text: SPF (who may send mail as us) and a domain-verification token.', 'Chữ tự do: SPF (ai được gửi thư dưới tên ta) và một mã xác minh tên miền.', 'Several TXT records on one name are normal; their order is not fixed.', 'Nhiều TXT trên một tên là bình thường; thứ tự không cố định.'],
  CAA: ['Which certificate authorities may issue HTTPS certificates for the name.', 'Những CA nào được cấp chứng chỉ HTTPS cho tên.', 'No CAA = any CA may issue (cuongthai.com today).', 'Không có CAA = CA nào cũng cấp được (cuongthai.com hiện nay).'],
  SRV: ['Host + port of a service — what mongodb+srv://db.labflow.test looks up.', 'Máy + cổng của một dịch vụ — thứ mongodb+srv://db.labflow.test đi tra.', 'Clients choose by priority, then weight — not by order in the answer.', 'Client chọn theo độ ưu tiên rồi trọng số — không theo thứ tự trong câu trả lời.'],
  HTTPS: ['Connection hints before connecting: ALPN (h2), address hints (RFC 9460).', 'Gợi ý kết nối trước khi kết nối: ALPN (h2), gợi ý địa chỉ (RFC 9460).', 'With h3 in the ALPN list, a browser can go straight to HTTP/3.', 'Có h3 trong danh sách ALPN thì trình duyệt đi thẳng HTTP/3 được.'],
  NS: ['The zone’s own list of its name servers.', 'Danh sách máy chủ tên của chính vùng.', 'It should match the delegation at the TLD (Lab 3, incident A).', 'Nó phải khớp với phần ủy quyền ở TLD (Lab 3, sự cố A).'],
  SOA: ['Primary server, contact, serial, refresh, retry, expire, minimum.', 'Máy chính, liên hệ, serial, refresh, retry, expire, minimum.', 'Secondaries copy the zone only when the serial grows; minimum = negative TTL.', 'Máy phụ chỉ chép vùng khi serial tăng; minimum = TTL âm.'],
};
type Mistake = 'ok' | 'apex' | 'chung' | 'mxip' | 'dot';
const BASE: Rec[] = [
  { name: '@', type: 'SOA', data: '…' }, { name: '@', type: 'NS', data: 'ns1' }, { name: '@', type: 'A', data: '203.0.113.10' },
  { name: 'api', type: 'A', data: '203.0.113.10' }, { name: '@', type: 'MX', data: '10 mail' }, { name: 'mail', type: 'A', data: '203.0.113.25' },
];
const MISTAKE: Record<Mistake, { recs: Rec[]; out: readonly string[]; line: string; en: string; vi: string }> = {
  ok: { recs: BASE, out: ZONE_OK, line: '@   IN MX   10 mail', en: 'The real zone file: loads, no warnings.', vi: 'Tệp vùng thật: nạp được, không cảnh báo.' },
  apex: { recs: [...BASE.filter((r) => !(r.name === '@' && r.type === 'A')), { name: '@', type: 'CNAME', data: 'labflow.cdn.test.' }], out: ZONE_APEX, line: '@   IN CNAME labflow.cdn.test.', en: 'The apex always has SOA, NS, MX… — a CNAME means “no data of my own”, so the WHOLE zone is refused. Providers offer CNAME flattening / ALIAS instead.', vi: 'Đỉnh luôn có SOA, NS, MX… — CNAME nghĩa là “không có dữ liệu riêng”, nên CẢ vùng bị từ chối. Nhà cung cấp có CNAME flattening / ALIAS để thay.' },
  chung: { recs: [...BASE, { name: 'api', type: 'CNAME', data: 'labflow.test.' }], out: ZONE_CHUNG, line: 'api IN CNAME labflow.test.', en: 'api already has an A record: a CNAME next to it breaks the whole zone, not only api.', vi: 'api đã có bản ghi A: thêm CNAME cạnh nó làm hỏng cả vùng, không chỉ riêng api.' },
  mxip: { recs: [...BASE.filter((r) => r.type !== 'MX'), { name: '@', type: 'MX', data: '10 203.0.113.25.' }], out: ZONE_MXIP, line: '@   IN MX   10 203.0.113.25.', en: 'Only a warning, and the zone loads “OK” — but MX must name a host.', vi: 'Chỉ là cảnh báo, vùng vẫn nạp “OK” — nhưng MX phải là tên một máy.' },
  dot: { recs: [...BASE.filter((r) => r.type !== 'MX'), { name: '@', type: 'MX', data: '10 mail.labflow.test' }], out: ZONE_DOT, line: '@   IN MX   10 mail.labflow.test', en: 'No final dot ⇒ relative ⇒ mail.labflow.test.labflow.test. Loads “OK”, the site works — and every email bounces.', vi: 'Thiếu dấu chấm cuối ⇒ tương đối ⇒ mail.labflow.test.labflow.test. Nạp “OK”, trang chạy — và mọi email bị trả lại.' },
};

export default function ZoneSim({ lang = 'vi', preset = 'records' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'records');
  const [pick, setPick] = useState<RType>('A');
  const [picked, setPicked] = useState<RType[]>(['A']);
  const [mistake, setMistake] = useState<Mistake>('ok');
  // serial: 0 = cả hai .10 · 1 = ns1 sửa, quên serial · 2 = đã tăng serial, ns2 đã chép
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const load = (k: Preset) => { setPre(k); setPhase(0); setMistake('ok'); labSfx('tap'); };
  const choose = (r: RType) => { setPick(r); setPicked((x) => (x.includes(r) ? x : [...x, r])); labSfx('tap'); };
  const serial1 = phase === 2 ? 2026110102 : 2026110101, serial2 = phase === 2 ? 2026110102 : 2026110101;
  const ns1 = phase === 0 ? '203.0.113.10' : '203.0.113.11', ns2 = phase === 2 ? '203.0.113.11' : '203.0.113.10';
  const chk = checkZone(MISTAKE[mistake].recs, 'labflow.test');
  useLabBridge('zone', {
    preset: pre, pick, picked: picked.join(','), mistake, loads: chk.errors.length === 0, warnings: chk.warnings.length,
    phase, ns1, ns2, serial1, serial2, synced: ns1 === ns2,
  }, {
    preset: (v) => load(String(v) as Preset),
    pick: (v) => choose(String(v) as RType),
    mistake: (v) => { setMistake(String(v) as Mistake); labSfx('tap'); },
    edit: () => { setPhase(1); labSfx('tap'); },
    bump: () => { if (phase === 1) { setPhase(2); labSfx('right'); } },
    reset: () => { setPhase(0); labSfx('off'); },
  });

  const recordsView = pre === 'records' && (
    <>
      <Picks<RType> value={pick} tour="zone-types" label={t('Record type', 'Loại bản ghi')} onChange={choose}
        options={(Object.keys(ANSWERS) as RType[]).map((k) => [k, k === 'CDN' ? 'CNAME→CDN' : k])} />
      <Explain>{t(WHAT[pick][0], WHAT[pick][1])} <b>{t('Rule:', 'Quy tắc:')}</b> {t(WHAT[pick][2], WHAT[pick][3])}</Explain>
      <div className={n.cols}>
        <Term lang={lang} tour="zone-answer" title={`dig +noall +answer — ${pick === 'CDN' ? 'static.labflow.test' : pick}`} real wrap lines={ANSWERS[pick].map((l) => ({ t: l, on: true }))} />
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={cx(n.verdict, n.vOk)}>{t(`Explored ${picked.length} of 11 record types`, `Đã xem ${picked.length} trên 11 loại bản ghi`)}</div>
          <WhereBox focus="zone-db" lang={lang} height={150} />
        </div>
      </div>
    </>
  );

  const apexView = pre === 'apex' && (
    <>
      <div className={s.bar} data-tour="zone-mistakes">
        <Seg label={t('Change in the zone file', 'Thay đổi trong tệp vùng')} value={mistake} onChange={(v) => { setMistake(v); labSfx(v === 'ok' ? 'right' : 'wrong'); }}
          options={[['ok', t('none', 'không')], ['apex', t('CNAME at the apex', 'CNAME ở đỉnh')], ['chung', t('CNAME + A', 'CNAME + A')], ['mxip', t('MX → IP', 'MX → IP')], ['dot', t('no final dot', 'quên dấu chấm')]]} />
      </div>
      <Explain tone={chk.errors.length ? 'bad' : chk.warnings.length ? 'warn' : 'ok'}>{t(MISTAKE[mistake].en, MISTAKE[mistake].vi)}</Explain>
      <div className={n.cols}>
        <div className={s.stack} style={{ gap: 8 }}>
          <Term lang={lang} title={t('the changed line', 'dòng bị đổi')} lines={[{ t: MISTAKE[mistake].line, on: mistake !== 'ok' }]} />
          <Term lang={lang} tour="zone-check" title="$ named-checkzone labflow.test …" real wrap lines={MISTAKE[mistake].out.map((l) => ({ t: l, on: /CNAME and other|warning|has no address|failed/.test(l) }))} />
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={cx(n.verdict, chk.errors.length ? n.vBad : n.vOk)} data-tour="zone-verdict">
            {chk.errors.length ? t('Zone NOT loaded — every name of the domain stops resolving.', 'Vùng KHÔNG được nạp — mọi tên của tên miền ngừng phân giải.') : chk.warnings.length ? t('Loads “OK” — read the warning: something is silently broken.', 'Nạp “OK” — đọc cảnh báo: có thứ đang hỏng lặng lẽ.') : t('Loads, no warnings.', 'Nạp được, không cảnh báo.')}
            {' '}<Src real={false} lang={lang} en="engine verdict" vi="engine phán" />
          </div>
          <WhereBox focus="zone-db" lang={lang} height={150} />
        </div>
      </div>
    </>
  );

  const serialView = pre === 'serial' && (() => {
    const topo = (
      <Topo label={t('primary ns1, secondary ns2', 'máy chính ns1, máy phụ ns2')} w={520} h={170}
        pill={phase === 2 ? 'NOTIFY → AXFR (serial 2026110102)' : phase === 1 ? t('same serial ⇒ no transfer', 'cùng serial ⇒ không chép') : undefined}
        k={phase === 2 ? '#16a34a' : '#dc2626'}
        nodes={[
          { id: 'ns1', x: 100, y: 90, icon: '📗', name: 'ns1 (primary)', sub: `api → ${ns1.split('.').pop() === '11' ? '.11' : '.10'}`, sub2: `serial ${serial1}`, on: phase > 0, w: 150 },
          { id: 'ns2', x: 420, y: 90, icon: '📘', name: 'ns2 (secondary)', sub: `api → ${ns2.split('.').pop() === '11' ? '.11' : '.10'}`, sub2: `serial ${serial2}`, bad: phase === 1, on: phase === 2, w: 160 },
        ]}
        links={[{ a: 'ns1', b: 'ns2', on: phase === 2, bad: phase === 1, label: 'NOTIFY / AXFR (TCP 53)' }]} />
    );
    return (
      <>
        <div className={s.bar} data-tour="zone-serial-btns">
          <button type="button" className={cx(s.btn, phase === 1 && s.on)} disabled={phase !== 0} onClick={() => { setPhase(1); labSfx('tap'); }}>✏️ {t('ns1: api → .11 (forget the serial)', 'ns1: api → .11 (quên serial)')}</button>
          <button type="button" className={cx(s.btn, s.primary)} disabled={phase !== 1} onClick={() => { setPhase(2); labSfx('right'); }}>⬆️ {t('bump the serial + reload', 'tăng serial + nạp lại')}</button>
          <button type="button" className={s.btn} onClick={() => { setPhase(0); labSfx('off'); }}>↺</button>
        </div>
        <Explain tone={phase === 1 ? 'bad' : phase === 2 ? 'ok' : undefined}>{phase === 0
          ? t('Both servers serve api = 203.0.113.10 with serial 2026110101.', 'Cả hai máy phục vụ api = 203.0.113.10 với serial 2026110101.')
          : phase === 1 ? t('ns1 says .11, ns2 still says .10 — with the SAME serial, so ns2 has no reason to copy. Each resolver gets one or the other: “works for me, not for my colleague”.', 'ns1 nói .11, ns2 vẫn nói .10 — với CÙNG serial, nên ns2 chẳng có lý do gì để chép. Mỗi resolver nhận câu này hoặc câu kia: “máy tôi chạy, máy đồng nghiệp thì không”.')
            : t('Larger serial ⇒ ns1 sends NOTIFY ⇒ ns2 compares, transfers the zone (2 ms) ⇒ both agree.', 'Serial lớn hơn ⇒ ns1 gửi NOTIFY ⇒ ns2 so sánh, chép vùng (2 ms) ⇒ hai máy thống nhất.')}</Explain>
        <div className={s.panel} style={{ padding: 6 }} data-tour="zone-servers">{topo}</div>
        <div className={n.cols}>
          <Term lang={lang} tour="zone-serial-term" title={t('from the laptop, asking each server directly', 'từ laptop, hỏi thẳng từng máy')} real wrap
            lines={phase === 0 ? [] : (phase === 1 ? ZONE_SERIAL_BAD : [...ZONE_SERIAL_OK, ...ZONE_NS2LOG]).map((l) => ({ t: l, on: /203\.0\.113\.1[01]$|Transfer completed/.test(l) }))} />
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={cx(n.verdict, ns1 === ns2 ? n.vOk : n.vBad)}>{ns1 === ns2 ? t('ns1 = ns2', 'ns1 = ns2') : t('ns1 ≠ ns2 — secondary transfers? ', 'ns1 ≠ ns2 — máy phụ có chép không? ') + (secondaryTransfers(serial1, serial2) ? t('yes', 'có') : t('no (serial not larger)', 'không (serial không lớn hơn)'))}</div>
            <WhereBox focus="zone-db" lang={lang} height={150} />
          </div>
        </div>
      </>
    );
  })();

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('Zone files: records, rules, secondaries', 'Tệp vùng: bản ghi, quy tắc, máy phụ')}
      sub={t('Real dig and named-checkzone output from LabFlow’s name servers in the course’s DNS lab', 'Output dig và named-checkzone thật từ máy chủ tên của LabFlow trong lab DNS của khoá')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="zone-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} onChange={load} options={[['records', t('record types', 'loại bản ghi')], ['apex', t('classic mistakes', 'lỗi kinh điển')], ['serial', t('primary / secondary', 'máy chính / máy phụ')]]} />
        </div>
        {recordsView}{apexView}{serialView}
        <div className={n.note}>{t('Zone = the part of the name tree one organisation manages. In a zone file, a name without a final dot is relative (the zone name is appended); @ is the zone itself.', 'Vùng = phần cây tên do một tổ chức quản lý. Trong tệp vùng, tên không có dấu chấm cuối là tương đối (tên vùng được ghép vào); @ là chính vùng.')}</div>
      </div>
    </Frame>
  );
}
