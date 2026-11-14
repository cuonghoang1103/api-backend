'use client';
/**
 * Mạng trường chặn gì (Chương 14.2): một request đi qua năm trạm — MAC · DNS · SNI · IP/cổng/UDP · TTL — bật/tắt từng luật của trường.
 *   web     — lọc DNS + lọc SNI (phim.test NXDOMAIN, social.test bị reset, news.test cùng IP vẫn qua)
 *   hotspot — điện thoại sau điểm phát của laptop: TTL 63; bật luật TTL ⇒ điện thoại chết, laptop sống
 *   game    — danh sách đen IP VPN, chỉ mở TCP 80/443/587/993, bỏ UDP (game, SSH 22 chết; SSH 993 sống)
 * Engine: engine/block.ts · số liệu thật: engine/capture14.ts.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { blockEval, PRESET_RULES, REQS, RULES, STAGES, stagesOf, type ReqId, type RuleId } from './engine/block';
import { Controls, Explain, Frame, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Src, Term } from './parts';
import n from './netlab.module.css';

type Preset = 'web' | 'hotspot' | 'game';
const PRESETS: Preset[] = ['web', 'hotspot', 'game'];
const FEEL: Record<string, [string, string]> = {
  ok: ['passes', 'đi qua'], nxdomain: ['"site can\'t be reached" — NXDOMAIN', '"không truy cập được" — NXDOMAIN'], reset: ['instant reset (ERR_CONNECTION_RESET)', 'bị reset ngay (ERR_CONNECTION_RESET)'],
  timeout: ['hangs, then times out', 'treo rồi hết giờ'], silence: ['silence — no answer, no error', 'im lặng — không trả lời, không báo lỗi'],
};
const WHERE: Record<string, string> = { mac: 'arp-cache', dns: 'dns-resolver', sni: 'tls', port: 'conntrack', ttl: 'packet' };

export default function BlockSim({ lang = 'vi', preset = 'web' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const p0 = PRESETS.includes(preset as Preset) ? (preset as Preset) : 'web';
  const [pre, setPre] = useState<Preset>(p0);
  const [rules, setRules] = useState<Record<RuleId, boolean>>(() => Object.fromEntries(RULES.map((r) => [r.id, PRESET_RULES[p0].rules.includes(r.id)])) as Record<RuleId, boolean>);
  const [req, setReq] = useState<ReqId>(PRESET_RULES[p0].req);
  const v = useMemo(() => blockEval(req, rules), [req, rules]);
  const path = stagesOf(v);
  const p = usePlayer(path.length + 1, 1500);
  useOwnStepSound();
  const atResult = p.i >= path.length;
  const prev = useRef(p.i);
  useEffect(() => { if (p.i > prev.current) labSfx(atResult ? (v.ok ? 'right' : 'wrong') : 'tick'); prev.current = p.i; }, [p.i, atResult, v.ok]);
  const R = Object.entries(rules).filter(([, on]) => on).map(([k]) => k).sort().join(',');
  useEffect(() => { p.reset(); }, [req, R]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = (k: Preset) => { setPre(k); setRules(Object.fromEntries(RULES.map((r) => [r.id, PRESET_RULES[k].rules.includes(r.id)])) as Record<RuleId, boolean>); setReq(PRESET_RULES[k].req); labSfx('tap'); };
  const flip = (id: RuleId, on?: boolean) => { setRules((x) => ({ ...x, [id]: on ?? !x[id] })); labSfx((on ?? !rules[id]) ? 'on' : 'off'); };
  const pick = (id: ReqId) => { setReq(id); labSfx('tap'); };

  useLabBridge('block', { preset: pre, i: p.i, atEnd: p.atEnd, req, rules: R, ok: v.ok, stop: v.stop ?? '', ttl: v.ttl }, {
    preset: (x) => load(String(x) as Preset), req: (x) => pick(String(x) as ReqId), on: (x) => flip(String(x) as RuleId, true), off: (x) => flip(String(x) as RuleId, false),
  });

  const R0 = REQS.find((x) => x.id === req)!;
  const cur = atResult ? (v.stop ?? 'net') : path[p.i];
  // ── đường ống năm trạm (SVG 600 × 170) ──
  const X0 = 40, GAP = 100;
  const xs = STAGES.map((_, i) => 140 + i * GAP);
  const xOf = (st: string) => (st === 'net' ? 610 : xs[STAGES.findIndex((x) => x.id === st)]);
  const kc = atResult ? (v.ok ? '#16a34a' : '#dc2626') : '#2563eb';
  const pipe = (
    <svg className={n.topo} viewBox="0 0 640 170" role="img" aria-label={t('five checkpoints', 'năm trạm kiểm soát')} style={{ '--k': kc } as CSSProperties}>
      <line x1={X0} y1={85} x2={600} y2={85} className={n.tLink} />
      <rect x={4} y={58} width={64} height={54} rx={10} className={cx(n.tBox, n.tBoxOn)} />
      <text x={36} y={82} textAnchor="middle" fontSize="20">{R0.from === 'phone' ? '📱' : '💻'}</text>
      <text x={36} y={102} textAnchor="middle" className={n.tSub}>TTL {v.ttl}</text>
      {STAGES.map((st, i) => {
        const passed = path.indexOf(st.id) > -1 && (path.indexOf(st.id) < p.i || (atResult && st.id !== v.stop));
        const dead = atResult && st.id === v.stop;
        return (
          <g key={st.id}>
            <rect x={xs[i] - 42} y={46} width={84} height={78} rx={10} className={cx(n.tBox, cur === st.id && n.tBoxOn)} style={dead ? { stroke: 'var(--ol-bad)', strokeWidth: 3 } : undefined} />
            <text x={xs[i]} y={72} textAnchor="middle" fontSize="18">{st.icon}</text>
            <text x={xs[i]} y={94} textAnchor="middle" className={n.tName} style={{ fontSize: 12 }}>{st.id === 'port' ? t('IP/port/UDP', 'IP/cổng/UDP') : st.id.toUpperCase()}</text>
            <text x={xs[i]} y={114} textAnchor="middle" fontSize="15" fontWeight={800} fill={dead ? 'var(--ol-bad)' : 'var(--ol-ok)'}>{dead ? '✕' : passed ? '✓' : ''}</text>
          </g>
        );
      })}
      <text x={614} y={92} textAnchor="middle" fontSize="22">🌐</text>
      <circle cx={xOf(cur)} cy={30} r={9} fill={kc} />
      <text x={xOf(cur)} y={20} textAnchor="middle" className={n.tSub}>{R0.proto.toUpperCase()} :{R0.port}</text>
      <text x={320} y={160} textAnchor="middle" className={n.tSub}>{R0.cmd}</text>
    </svg>
  );

  const stageNow = !atResult ? STAGES.find((x) => x.id === path[p.i])! : null;
  const explain = atResult
    ? <><b>{t(FEEL[v.feel][0], FEEL[v.feel][1])}</b> — {t(v.en, v.vi)}</>
    : <>{t(`Checkpoint ${p.i + 1}: ${stageNow!.en}`, `Trạm ${p.i + 1}: ${stageNow!.vi}`)} — {t(path[p.i] === v.stop ? 'a rule is about to match…' : 'no rule matches here, the packet moves on.', path[p.i] === v.stop ? 'sắp có luật khớp…' : 'không luật nào khớp ở đây, gói đi tiếp.')}</>;

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('What the school network blocks', 'Mạng trường chặn những gì')}
      sub={t('Switch the school\'s rules on and off — watch where each request dies, and what error it gives', 'Bật/tắt từng luật của trường — xem mỗi request chết ở đâu, và báo lỗi gì')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="blk-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['web', t('blocked sites', 'trang bị chặn')], ['hotspot', t('hotspot', 'điểm phát')], ['game', t('games & ports', 'game & cổng')]]} onChange={load} />
        </div>
        <div className={s.panel} data-tour="blk-rules">
          <div className={s.panelTitle}>{t('The school\'s rules (on the controller)', 'Luật của trường (trên bộ điều khiển)')}</div>
          <div className={n.picks}>
            {RULES.map((r) => <button type="button" key={r.id} className={cx(s.btn, rules[r.id] && s.on)} onClick={() => flip(r.id)} title={r.cmd}>{rules[r.id] ? '🔒' : '○'} {t(r.en, r.vi)}</button>)}
          </div>
        </div>
        <div className={s.panel} data-tour="blk-req">
          <div className={s.panelTitle}>{t('Try a request', 'Thử một request')}</div>
          <div className={n.picks}>{REQS.map((r) => <button type="button" key={r.id} className={cx(s.btn, req === r.id && s.on)} onClick={() => pick(r.id)}>{r.from === 'phone' ? '📱 ' : ''}{t(r.en, r.vi)}</button>)}</div>
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={atResult ? (v.ok ? 'ok' : 'bad') : undefined}>{explain}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} style={{ padding: 6 }} data-tour="blk-pipe">{pipe}</div>
            <Term lang={lang} tour="blk-term" title="terminal" wrap badge={atResult ? <Src real={v.real} lang={lang} en={v.real ? 'real lab output' : 'computed (not measured)'} vi={v.real ? 'output lab thật' : 'tính ra (chưa đo)'} /> : undefined}
              lines={[{ t: `$ ${R0.cmd}`, dim: true }, ...(atResult ? [{ t: v.line, on: true, calc: !v.real }] : [])]} />
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} data-tour="blk-hit">
              <div className={s.panelTitle}>{t('Rule that matched', 'Luật đã khớp')}</div>
              {atResult && v.rule ? <code className={s.small} style={{ whiteSpace: 'pre-wrap' }}>{RULES.find((r) => r.id === v.rule)!.cmd}</code> : <span className={s.empty}>{atResult ? t('(none — the request got through)', '(không — request đã qua)') : '…'}</span>}
            </div>
            {pre === 'hotspot' && (
              <div className={s.panel} data-tour="blk-ttl">
                <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>{t('What the controller sees', 'Bộ điều khiển thấy gì')} <Src real lang={lang} en="tshark on the controller" vi="tshark trên bộ điều khiển" /></div>
                <table className={n.rt}><thead><tr><th>MAC</th><th>IP</th><th>TTL</th></tr></thead>
                  <tbody><tr><td><code>8c:8d:28:4e:7a:12</code></td><td><code>10.20.2.159</code></td><td>64 💻</td></tr><tr className={n.rtBad}><td><code>8c:8d:28:4e:7a:12</code></td><td><code>10.20.2.159</code></td><td>63 📱</td></tr></tbody></table>
                <div className={s.small}>{t('Same MAC, same IP — the phone hides behind the laptop\'s NAT, but the laptop lowered its TTL by one.', 'Cùng MAC, cùng IP — điện thoại núp sau NAT của laptop, nhưng laptop đã trừ TTL của nó đi một.')}</div>
              </div>
            )}
            <WhereBox focus={WHERE[atResult ? (v.stop ?? 'port') : path[p.i]] ?? 'packet'} lang={lang} height={150} />
          </div>
        </div>
        <div className={n.note}>{t('Like everyday life: DNS filter = a phone book with names crossed out; SNI = a postman reading the name on the envelope (the letter stays sealed); ports = a building that only opens a few doors; TTL = the guard noticing one card brings in a group.', 'Như đời thường: lọc DNS = danh bạ bị gạch tên; SNI = người đưa thư đọc tên ngoài phong bì (thư bên trong vẫn dán kín); cổng = toà nhà chỉ mở vài cửa; TTL = bác bảo vệ để ý một thẻ dẫn cả nhóm vào.')}</div>
      </div>
    </Frame>
  );
}
