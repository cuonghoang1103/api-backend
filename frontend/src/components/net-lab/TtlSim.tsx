'use client';
/**
 * TTL (Chương 3.3): vì sao đổi DNS lại chậm.
 *   countdown — kéo thời gian: resolver đếm ngược TTL (tính ra), máy chủ tên luôn nói nguyên 120 (thật)
 *   change    — chuyển api sang máy mới: hạ TTL rồi đổi NGAY (sai) hay chờ hết TTL cũ (đúng): IP cũ còn sống bao lâu
 *   negative  — hỏi một tên trước khi tạo: NXDOMAIN bị cache 300 s; xoá một tên chưa đủ (aggressive NSEC), xoá cả vùng thì lành
 * Engine: engine/dns3.ts. Số liệu: engine/capture3.ts (dòng thời gian thật c33-theo-doc, cache âm c33-am*).
 */
import { useState } from 'react';
import { TTL_DEM, TTL_NEG1, TTL_NEG2, TTL_NEG_FLUSH1, TTL_NEG_FLUSH2, TTL_NEG_OK, TTL_NEG_STILL, TTL_NS_DOI, TTL_NS_DOI2, TTL_NS_HA, TTL_THEO } from './engine/capture3';
import { negativeTtl, remainingTtl, staleAfterChange, worstCaseDelay } from './engine/dns3';
import { Controls, Explain, Frame, Kpi, Seg, css as s, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Src, Term, type TLine } from './parts';
import n from './netlab.module.css';

type Preset = 'countdown' | 'change' | 'negative';
const PRESETS: Preset[] = ['countdown', 'change', 'negative'];
type Order = 'wrong' | 'right';

const NEG_STEPS: Array<{ en: string; vi: string; tone?: 'ok' | 'warn' | 'bad'; lines: readonly string[]; title: string }> = [
  { en: 'A probe asks new.labflow.test BEFORE it exists: NXDOMAIN, with the zone’s SOA attached. The resolver will remember “does not exist” for min(3600, 300) = 300 s.', vi: 'Một đầu dò hỏi new.labflow.test TRƯỚC khi nó tồn tại: NXDOMAIN, kèm SOA của vùng. Resolver sẽ nhớ “không tồn tại” trong min(3600, 300) = 300 s.', tone: 'warn', lines: TTL_NEG1, title: '$ dig new.labflow.test  # laptop' },
  { en: 'Now the record is created on ns1 — ns1 answers it at once. But the resolver still says NXDOMAIN, with 298 s left on its negative cache.', vi: 'Giờ bản ghi được tạo trên ns1 — ns1 trả lời ngay. Nhưng resolver vẫn nói NXDOMAIN, còn 298 s trong cache âm.', tone: 'bad', lines: TTL_NEG2, title: '$ dig @203.0.113.53 / dig  # laptop' },
  { en: 'On a resolver you run, you can flush. Flush just that name…', vi: 'Trên resolver của mình thì xoá được. Xoá đúng tên đó…', lines: TTL_NEG_FLUSH1, title: '$ unbound-control flush new.labflow.test  # isp' },
  { en: '…still NXDOMAIN! The zone is DNSSEC-signed: the resolver kept the signed NSEC record (“after mail comes ns1”) and proves non-existence from it — aggressive NSEC, RFC 8198.', vi: '…vẫn NXDOMAIN! Vùng có ký DNSSEC: resolver giữ bản ghi NSEC có chữ ký (“sau mail là ns1”) và tự chứng minh “không có” từ nó — aggressive NSEC, RFC 8198.', tone: 'bad', lines: TTL_NEG_STILL, title: '$ dig new.labflow.test  # laptop' },
  { en: 'Flush the whole zone: the NSEC proof goes with it.', vi: 'Xoá cả vùng: bằng chứng NSEC đi theo.', lines: TTL_NEG_FLUSH2, title: '$ unbound-control … flush_zone labflow.test  # isp' },
  { en: 'The new name resolves. On public resolvers you cannot flush — create records BEFORE anybody asks for them (cuongthai.com: negative TTL 1800 s).', vi: 'Tên mới phân giải được. Resolver công cộng thì không xoá được — hãy tạo bản ghi TRƯỚC khi có ai hỏi (cuongthai.com: TTL âm 1800 s).', tone: 'ok', lines: TTL_NEG_OK, title: '$ dig +short new.labflow.test  # laptop' },
];

export default function TtlSim({ lang = 'vi', preset = 'countdown' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'countdown');
  const [order, setOrder] = useState<Order>('wrong');
  const [oldTtl, setOldTtl] = useState(120);
  const p = usePlayer(pre === 'negative' ? NEG_STEPS.length : pre === 'countdown' ? 11 : 1, pre === 'countdown' ? 1200 : 2200);
  const now = pre === 'countdown' ? p.i * 15 : 0;   // đếm ngược: mỗi bước 15 s (Chạy = xem TTL giảm)
  const setNow = (v: number) => p.setI(Math.round(v / 15));
  const load = (k: Preset) => { setPre(k); p.reset(); setOrder('wrong'); setOldTtl(120); labSfx('tap'); };

  const rem = remainingTtl(120, 0, now);
  const lowerAt = 5, newTtl = 10;
  const changeAt = order === 'wrong' ? 16 : lowerAt + oldTtl + 5;
  const thisRun = staleAfterChange(0, oldTtl, changeAt);
  const worst = worstCaseDelay(oldTtl, lowerAt, changeAt, newTtl);
  const negStep = NEG_STEPS[Math.min(p.i, NEG_STEPS.length - 1)];
  useLabBridge('ttl', {
    preset: pre, now, rem, order, oldTtl, stale: thisRun, worst, i: p.i, atEnd: p.atEnd, resolved: pre === 'negative' && p.atEnd,
  }, {
    preset: (v) => load(String(v) as Preset),
    now: (v) => setNow(Math.max(0, Math.min(150, Number(v)))),
    order: (v) => { setOrder(String(v) as Order); labSfx(v === 'right' ? 'right' : 'wrong'); },
    oldTtl: (v) => setOldTtl(Number(v)),
  });

  const countdownView = pre === 'countdown' && (
    <>
      <Controls p={p} lang={lang} label={t(`${now} s since the resolver fetched api.labflow.test`, `${now} s kể từ lúc resolver lấy api.labflow.test`)} />
      <Explain tone={rem ? undefined : 'warn'}>{rem
        ? t(`The resolver reports ${rem} s left; the authoritative server always says 120. Until 0 the resolver will not ask again — whatever you change on the server.`, `Resolver báo còn ${rem} s; máy chủ tên luôn nói 120. Chưa về 0 thì resolver không hỏi lại — dù bạn đổi gì trên máy chủ.`)
        : t('0 s left: the record is thrown away; the next question goes back up the tree and fetches a fresh copy (TTL 120 again).', 'Còn 0 s: bản ghi bị vứt; câu hỏi tiếp theo lại đi lên cây và lấy bản mới (lại TTL 120).')}</Explain>
      <div className={n.cols}>
        <div className={s.stack} style={{ gap: 8 }}>
          <Term lang={lang} tour="ttl-real" title={t('real: through the resolver at 0 s and 5 s, then ns1', 'thật: qua resolver lúc 0 s và 5 s, rồi ns1')} real wrap lines={TTL_DEM.map((l) => ({ t: l }))} />
          <Term lang={lang} title={t(`resolver at ${now} s`, `resolver lúc ${now} s`)} lines={[{ t: `api.labflow.test.\t${rem || 120}\tIN\tA\t203.0.113.10`, calc: true }]} badge={<Src real={false} lang={lang} />} />
        </div>
        <WhereBox focus="dns-ttl" lang={lang} height={180} />
      </div>
    </>
  );

  const changeView = pre === 'change' && (() => {
    const W = 520, X = (sec: number) => 20 + (sec / (oldTtl + 40)) * (W - 40);
    const sees = order === 'wrong' && oldTtl === 120;
    return (
      <>
        <div className={s.bar} data-tour="ttl-order">
          <Seg label={t('Order', 'Thứ tự')} value={order} onChange={(v) => { setOrder(v); labSfx(v === 'right' ? 'right' : 'wrong'); }}
            options={[['wrong', t('lower TTL, change IP 11 s later', 'hạ TTL, 11 s sau đổi IP')], ['right', t('lower TTL, wait the old TTL, then change', 'hạ TTL, chờ hết TTL cũ, rồi đổi')]]} />
          <Seg label={t('old TTL', 'TTL cũ')} value={oldTtl} onChange={(v) => setOldTtl(v)} options={[[120, '120 s'], [300, '300 s'], [3600, '3600 s']]} />
        </div>
        <Explain tone={order === 'wrong' ? 'bad' : 'ok'}>{order === 'wrong'
          ? t(`A cache that fetched the record just before the change keeps the OLD address for the rest of the OLD TTL: ${thisRun} s after the change in this run, up to ${worst} s in the worst case.`, `Một cache vừa lấy bản ghi ngay trước lúc đổi giữ địa chỉ CŨ trong phần còn lại của TTL CŨ: ${thisRun} s sau khi đổi ở lần chạy này, tới ${worst} s trong trường hợp xấu nhất.`)
          : t(`Every cache now holds the short TTL (10 s) when the IP changes: at most ${worst} s of old answers.`, `Lúc đổi IP mọi cache đã giữ TTL ngắn (10 s): câu trả lời cũ tối đa ${worst} s.`)}</Explain>
        <div className={s.panel} data-tour="ttl-timeline">
          <div className={s.panelTitle}>{t('timeline (computed)', 'dòng thời gian (tính ra)')} <Src real={false} lang={lang} /></div>
          <svg viewBox={`0 0 ${W} 110`} style={{ width: '100%' }} role="img" aria-label="timeline">
            <rect x={X(0)} y={18} width={Math.max(2, X(Math.min(oldTtl, changeAt + thisRun)) - X(0))} height={26} rx={6} fill="#dbeafe" stroke="#2563eb" />
            <text x={X(2)} y={36} fontSize={12} fill="#1e3a8a">{t('cache keeps .10', 'cache giữ .10')}</text>
            <rect x={X(changeAt + thisRun)} y={18} width={Math.max(2, X(oldTtl + 40) - X(changeAt + thisRun))} height={26} rx={6} fill="#dcfce7" stroke="#16a34a" />
            <text x={X(changeAt + thisRun) + 4} y={36} fontSize={12} fill="#14532d">.11</text>
            {[[lowerAt, t('TTL → 10', 'TTL → 10'), '#dc2626'], [changeAt, t('IP → .11', 'IP → .11'), '#dc2626']].map(([x, l, c], k) => (
              <g key={k}><line x1={X(Number(x))} y1={10} x2={X(Number(x))} y2={k ? 98 : 70} stroke={String(c)} strokeDasharray="4 3" strokeWidth={2} /><text x={X(Number(x)) + 3} y={k ? 96 : 68} fontSize={11} fill={String(c)} fontWeight={700}>{String(l)}</text></g>
            ))}
          </svg>
          <div className={s.bar}><Kpi k={t('old IP after the change (this cache)', 'IP cũ sau khi đổi (cache này)')} v={`${thisRun} s`} tone={thisRun > 15 ? 'bad' : 'ok'} /><Kpi k={t('worst case', 'xấu nhất')} v={`${worst} s`} tone={worst > 15 ? 'bad' : 'ok'} /></div>
        </div>
        <div className={n.cols}>
          <Term lang={lang} tour="ttl-theo" title={sees ? t('real run: laptop asks every 15 s (lowered 16:10:51, changed 16:11:02)', 'lần chạy thật: laptop hỏi mỗi 15 s (hạ 16:10:51, đổi 16:11:02)') : t('real run exists for “wrong order, 120 s” — switch to see it', 'lần chạy thật có ở “sai thứ tự, 120 s” — chuyển sang để xem')} real={sees} wrap
            lines={sees ? [...[...TTL_NS_HA, ...TTL_NS_DOI, ...TTL_NS_DOI2].map((l): TLine => ({ t: `# ns1 edit at ${l}`, dim: true })), ...TTL_THEO.map((l): TLine => ({ t: l, on: l.endsWith('.11') }))] : []} />
          <WhereBox focus="dns-ttl" lang={lang} height={170} />
        </div>
      </>
    );
  })();

  const negView = pre === 'negative' && (
    <>
      <Controls p={p} lang={lang} />
      <Explain tone={negStep.tone}>{t(negStep.en, negStep.vi)}</Explain>
      <div className={n.cols}>
        <div className={s.stack} style={{ gap: 8 }}>
          <Term lang={lang} tour="ttl-neg-term" title={negStep.title} real wrap lines={negStep.lines.map((l) => ({ t: l, on: /NXDOMAIN|SOA|203\.0\.113\.10|removed|yes/.test(l) }))} />
          <div className={s.bar} data-tour="ttl-neg-kpi">
            <Kpi k={t('negative TTL', 'TTL âm')} v={`min(3600, 300) = ${negativeTtl(3600, 300)} s`} />
            <Kpi k={t('resolver answer', 'resolver trả lời')} v={p.i === 5 ? '203.0.113.10' : p.i === 2 || p.i === 4 ? '…' : 'NXDOMAIN'} tone={p.i === 5 ? 'ok' : 'bad'} />
          </div>
        </div>
        <WhereBox focus="dns-ttl" lang={lang} height={170} />
      </div>
    </>
  );

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('TTL: why DNS changes are slow', 'TTL: vì sao đổi DNS lại chậm')}
      sub={t('Real timeline and negative-cache runs from the course’s DNS lab', 'Dòng thời gian và cache âm đo thật trong lab DNS của khoá')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="ttl-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} onChange={load} options={[['countdown', t('countdown', 'đếm ngược')], ['change', t('moving a server', 'chuyển máy chủ')], ['negative', t('“does not exist”', '“không tồn tại”')]]} />
        </div>
        {countdownView}{changeView}{negView}
        <div className={n.note}>{t('TTL = how long any cache may keep a record. Caches count it down and never ask again before 0; lowering it on the server does not reach copies already fetched.', 'TTL = mọi cache được giữ một bản ghi bao lâu. Cache đếm ngược và không hỏi lại trước khi về 0; hạ nó trên máy chủ không chạm tới những bản đã được lấy.')}</div>
      </div>
    </Frame>
  );
}
