'use client';
/**
 * DNSSEC (Chương 3.5): chữ ký, mã hoá, và kiểu hỏng thường gặp nhất.
 *   chain   — đi chuỗi tin cậy từ mỏ neo gốc tới bản ghi A: DS ở vùng cha = mã băm khoá của vùng con, RRSIG kiểm bằng DNSKEY
 *   expired — chữ ký hết hạn ⇒ SERVFAIL + EDE 7; +cd cho thấy dữ liệu vẫn còn; ký lại mà vẫn hỏng (cache "bogus"); flush_bogus
 *   private — cùng một câu hỏi qua DNS thường / DoT / DoH: người đứng giữa thấy gì (bắt gói thật ở router nhà)
 * Engine: engine/dns3.ts (validate, resolverStatus). Số liệu: engine/capture3.ts.
 */
import { useState } from 'react';
import { SEC_BOGUS, SEC_CHUOI, SEC_DELV_STATIC, SEC_HONG, SEC_REAL, SEC_SUA1, SEC_SUA2, SEC_WIRE } from './engine/capture3';
import { resolverStatus, validate } from './engine/dns3';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Src, Term } from './parts';
import n from './netlab.module.css';

type Preset = 'chain' | 'expired' | 'private';
const PRESETS: Preset[] = ['chain', 'expired', 'private'];
const L = (re: RegExp) => SEC_CHUOI.filter((l) => re.test(l));
const CHAIN: Array<{ box: string; en: string; vi: string; lines: string[] }> = [
  { box: 'anchor', en: 'Start: the ONE key the resolver trusts without proof — the root’s, configured as a trust anchor.', vi: 'Bắt đầu: khoá DUY NHẤT resolver tin không cần chứng minh — của vùng gốc, cấu hình làm mỏ neo tin cậy.', lines: L(/trust-anchors/) },
  { box: 'root', en: 'The root zone publishes (and signs) a DS for “test”: a hash of the TLD’s key-signing key.', vi: 'Vùng gốc công bố (và ký) một DS cho “test”: mã băm khoá ký khoá của TLD.', lines: L(/^test\./) },
  { box: 'tld', en: 'The TLD publishes (and signs) a DS for labflow.test.', vi: 'TLD công bố (và ký) một DS cho labflow.test.', lines: L(/^labflow\.test\.\t\t3600\tIN\tDS/) },
  { box: 'ds', en: 'Check: hash LabFlow’s published key-signing key ourselves — the same digest as the parent’s DS. The parent vouches for this key.', vi: 'Kiểm: tự băm khoá ký khoá mà LabFlow công bố — ra đúng mã băm như DS của vùng cha. Vùng cha bảo lãnh cho khoá này.', lines: L(/IN DS|\tIN\tDS/).filter((l) => l.startsWith('labflow')) },
  { box: 'key', en: 'LabFlow’s DNSKEY set: 257 = key-signing key (matched by the DS), 256 = zone-signing key (signs the records).', vi: 'Bộ DNSKEY của LabFlow: 257 = khoá ký khoá (khớp DS), 256 = khoá ký vùng (ký các bản ghi).', lines: L(/DNSKEY/) },
  { box: 'rrsig', en: 'The A record comes with an RRSIG made by the zone-signing key — verified with the 256 key. Every link checked.', vi: 'Bản ghi A đi kèm RRSIG do khoá ký vùng tạo — kiểm bằng khoá 256. Mọi mắt xích đã kiểm.', lines: L(/^labflow\.test\.\t\t300\tIN\t(A|RRSIG)/).slice(0, 2) },
  { box: 'ad', en: 'Result: the resolver sets ad; delv says “fully validated”. A zone with no DS at its parent (cdn.test) is “unsigned” — insecure, but allowed.', vi: 'Kết quả: resolver bật ad; delv nói “fully validated”. Vùng không có DS ở vùng cha (cdn.test) là “unsigned” — insecure, nhưng được chấp nhận.', lines: [...L(/flags|fully validated/), ...SEC_DELV_STATIC.filter((l) => l.startsWith(';'))] },
];
const BOXES: Array<[string, string, string]> = [['anchor', 'root anchor', 'mỏ neo gốc'], ['root', '“.” → DS test', '“.” → DS test'], ['tld', 'test → DS labflow', 'test → DS labflow'], ['ds', 'DS = hash(KSK)', 'DS = băm(KSK)'], ['key', 'DNSKEY 257/256', 'DNSKEY 257/256'], ['rrsig', 'A + RRSIG', 'A + RRSIG'], ['ad', 'ad ✓', 'ad ✓']];
type Mode = 'plain' | 'dot' | 'doh';

export default function DnssecSim({ lang = 'vi', preset = 'chain' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'chain');
  const p = usePlayer(pre === 'chain' ? CHAIN.length : 1, 2000);
  // expired: 0 = bình thường · 1 = chữ ký hết hạn · 2 = đã ký lại (cache bogus còn) · 3 = flush_bogus
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [cd, setCd] = useState(false);
  const [mode, setMode] = useState<Mode>('plain');
  const load = (k: Preset) => { setPre(k); p.reset(); setPhase(0); setCd(false); setMode('plain'); labSfx('tap'); };
  const status = validate({ hasDs: true, dsMatches: true, sigValid: phase === 0 || phase === 3 });
  const answer = phase === 2 ? (cd ? 'NOERROR' : 'SERVFAIL') : resolverStatus(status, cd);
  const wire = SEC_WIRE.filter((l) => l.includes(mode === 'plain' ? 'port 53 ' : mode === 'dot' ? 'port 853' : 'port 443'));
  useLabBridge('dnssec', {
    preset: pre, i: p.i, atEnd: p.atEnd, validated: pre === 'chain' && p.atEnd, phase, cd, answer, mode, nameVisible: mode === 'plain',
  }, {
    preset: (v) => load(String(v) as Preset),
    expire: () => { setPhase(1); labSfx('wrong'); },
    cd: (v) => { setCd(v !== false); labSfx('tap'); },
    resign: () => { setPhase((x) => (x === 1 ? 2 : x)); labSfx('tap'); },
    flush: () => { setPhase((x) => (x === 2 ? 3 : x)); labSfx('right'); },
    mode: (v) => { setMode(String(v) as Mode); labSfx('tap'); },
  });

  const chainView = pre === 'chain' && (() => {
    const st = CHAIN[p.i];
    return (
      <>
        <Controls p={p} lang={lang} />
        <Explain tone={p.atEnd ? 'ok' : undefined}>{t(st.en, st.vi)}</Explain>
        <div className={s.panel} data-tour="sec-chain">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {BOXES.map(([k, en, vi], j) => (
              <span key={k} className={cx(n.verdict, j <= p.i ? n.vOk : undefined)} style={{ opacity: j <= p.i ? 1 : 0.4, padding: '4px 8px' }}>{j <= p.i ? '✓ ' : ''}{t(en, vi)}{j < BOXES.length - 1 ? ' →' : ''}</span>
            ))}
          </div>
        </div>
        <div className={n.cols}>
          <Term lang={lang} tour="sec-chain-term" title={t('real lab output for this link', 'output thật của mắt xích này')} real wrap lines={st.lines.map((l) => ({ t: l, on: true }))} />
          <WhereBox focus="dnssec" lang={lang} height={170} />
        </div>
      </>
    );
  })();

  const expiredView = pre === 'expired' && (() => {
    const lines = phase === 0 ? [] : phase === 1 ? SEC_HONG : phase === 2 ? SEC_SUA1 : [...SEC_BOGUS, ...SEC_SUA2];
    return (
      <>
        <div className={s.bar} data-tour="sec-exp-btns">
          <button type="button" className={cx(s.btn, phase === 1 && s.on)} disabled={phase !== 0} onClick={() => { setPhase(1); labSfx('wrong'); }}>⏳ {t('the re-signing job died: signatures expire', 'tác vụ ký lại chết: chữ ký hết hạn')}</button>
          <button type="button" className={cx(s.btn, cd && s.on)} onClick={() => { setCd((v) => !v); labSfx('tap'); }}>🔍 {t('dig +cd (checking disabled)', 'dig +cd (tắt kiểm)')}</button>
          <button type="button" className={s.btn} disabled={phase !== 1} onClick={() => { setPhase(2); labSfx('tap'); }}>✍️ {t('re-sign the zone', 'ký lại vùng')}</button>
          <button type="button" className={cx(s.btn, s.primary)} disabled={phase !== 2} onClick={() => { setPhase(3); labSfx('right'); }}>🧹 unbound-control flush_bogus</button>
        </div>
        <Explain tone={answer === 'SERVFAIL' ? 'bad' : phase ? 'ok' : undefined}>{phase === 0 ? t('Everything is signed and valid: answers carry the ad flag.', 'Mọi thứ đã ký và còn hạn: câu trả lời có cờ ad.')
          : phase === 1 ? (cd ? t('With +cd the resolver skips validation and the address comes back — proof that this is a DNSSEC problem, not a server problem.', 'Với +cd resolver bỏ qua bước kiểm và địa chỉ quay về — bằng chứng đây là lỗi DNSSEC, không phải lỗi máy chủ.') : t('SERVFAIL for every user behind a validating resolver, with EDE 7 “Signature Expired”. The server, network and records are fine.', 'SERVFAIL với mọi người dùng sau resolver có kiểm, kèm EDE 7 “Signature Expired”. Máy chủ, mạng và bản ghi đều ổn.'))
            : phase === 2 ? t('The zone is fixed — but the resolver still answers SERVFAIL: it remembers bogus answers for val-bogus-ttl (60 s).', 'Vùng đã lành — nhưng resolver vẫn trả SERVFAIL: nó nhớ câu bogus trong val-bogus-ttl (60 s).')
              : t('Bogus entries cleared: NOERROR again. On public resolvers you wait; a wrong DS can stay cached for the DS TTL (Slack 2021: 24 h).', 'Đã xoá các mục bogus: lại NOERROR. Với resolver công cộng thì chờ; DS sai có thể nằm trong cache theo TTL của DS (Slack 2021: 24 giờ).')}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.bar} data-tour="sec-exp-kpi"><Kpi k={t('zone status', 'trạng thái vùng')} v={phase === 2 ? t('secure (fixed)', 'secure (đã sửa)') : status} tone={status === 'bogus' ? 'bad' : 'ok'} /><Kpi k={t('resolver answers', 'resolver trả lời')} v={answer} tone={answer === 'SERVFAIL' ? 'bad' : 'ok'} /></div>
            <Term lang={lang} tour="sec-exp-term" title={phase === 3 ? 'unbound-control … / dig labflow.test' : 'dig labflow.test …'} real wrap lines={lines.map((l) => ({ t: l, on: /SERVFAIL|EDE|NOERROR|valid from|removed/.test(l) }))} />
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <Term lang={lang} title={t('the real Internet', 'Internet thật')} real wrap lines={SEC_REAL.map((l) => ({ t: l, on: /EDE|flags/.test(l) }))} />
            <WhereBox focus="dnssec" lang={lang} height={140} />
          </div>
        </div>
      </>
    );
  })();

  const privateView = pre === 'private' && (
    <>
      <div className={s.bar} data-tour="sec-mode">
        <Seg label={t('Send the question as', 'Gửi câu hỏi bằng')} value={mode} onChange={(v) => { setMode(v); labSfx('tap'); }} options={[['plain', t('plain DNS (UDP 53)', 'DNS thường (UDP 53)')], ['dot', 'DoT (TCP 853)'], ['doh', 'DoH (TCP 443)']]} />
      </div>
      <Explain tone={mode === 'plain' ? 'bad' : 'ok'}>{mode === 'plain'
        ? t('Anyone on the path — the Wi-Fi, the ISP — reads the name you looked up.', 'Bất kỳ ai trên đường đi — Wi-Fi, nhà mạng — đều đọc được cái tên bạn tra.')
        : t('Only a TLS hello and encrypted bytes. The resolver still sees the question, and TLS does not prove the answer is genuine — that is DNSSEC’s job.', 'Chỉ còn lời chào TLS và byte đã mã hoá. Resolver vẫn thấy câu hỏi, và TLS không chứng minh câu trả lời là thật — đó là việc của DNSSEC.')}</Explain>
      <div className={n.cols}>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.bar} data-tour="sec-mode-kpi"><Kpi k={t('name visible on the path', 'tên thấy được trên đường')} v={mode === 'plain' ? t('yes: labflow.test', 'có: labflow.test') : t('no', 'không')} tone={mode === 'plain' ? 'bad' : 'ok'} /><Kpi k={t('captured at', 'bắt ở')} v="homegw wan0" /></div>
          <Term lang={lang} tour="sec-wire" title={t('what the home router saw', 'router nhà thấy gì')} real wrap lines={wire.map((l) => ({ t: l, on: true }))} />
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.small}><Src real lang={lang} en="tshark on the home router, three lookups of the same name" vi="tshark trên router nhà, ba lần tra cùng một tên" /></div>
          <WhereBox focus="dnssec" lang={lang} height={150} />
        </div>
      </div>
    </>
  );

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('DNSSEC and encrypted DNS', 'DNSSEC và DNS mã hoá')}
      sub={t('Real chain of trust, a real signature-expiry outage and a real capture from the course’s DNS lab', 'Chuỗi tin cậy thật, sự cố chữ ký hết hạn thật và bắt gói thật trong lab DNS của khoá')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="sec-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} onChange={load} options={[['chain', t('chain of trust', 'chuỗi tin cậy')], ['expired', t('signatures expired', 'chữ ký hết hạn')], ['private', 'DoT / DoH']]} />
        </div>
        {chainView}{expiredView}{privateView}
        <div className={n.note}>{t('DNSSEC = signatures that prove an answer comes from the zone’s owner (integrity). DoT/DoH = TLS between you and your resolver (privacy from the network). Neither does the other’s job.', 'DNSSEC = chữ ký chứng minh câu trả lời đến từ chủ vùng (toàn vẹn). DoT/DoH = TLS giữa bạn và resolver (riêng tư trước mạng). Không cái nào làm thay việc của cái kia.')}</div>
      </div>
    </Frame>
  );
}
