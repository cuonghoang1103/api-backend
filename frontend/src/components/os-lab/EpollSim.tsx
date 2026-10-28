'use client';
/**
 * epoll (Chương 10): danh sách quan tâm vs danh sách sẵn sàng, giá một lần thức (select/poll/epoll theo N), LT vs ET,
 * bốn luồng chung một epoll (EPOLLONESHOT), mỗi-kết-nối-một-luồng vs event loop khi tải tăng, và ba bức tường
 * (pids, bộ nhớ, ulimit -n). Engine: engine/epoll.ts (khớp lab/out/c103-epoll, c104-*).
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { C10K, C10K_N, FD_SETSIZE, ONESHOT, POLLBENCH, WALLS, readyScript, realMiB, trigger, type Load, type Share, type Trig, type Wall } from './engine/epoll';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab2.module.css';

const PRESETS = ['ready', 'scan', 'trigger', 'oneshot', 'c10k', 'walls'] as const;
type Pre = (typeof PRESETS)[number];
const WALL_ORDER: Wall[] = ['pids', 'memory', 'nofile'];
const READY = readyScript();

function Bar({ label, v, max, txt, on, log, color }: { label: string; v: number | null; max: number; txt: string; on?: boolean; log?: boolean; color?: string }) {
  const w = v === null ? 0 : log ? (100 * Math.log10(1 + v)) / Math.log10(1 + max) : (100 * v) / max;
  return (
    <div className={cx(c.lrow, on && c.lrowOn)}>
      <span>{label}</span>
      <span className={c.ltrack}><span className={c.lfill} style={{ display: 'block', width: `${Math.max(v === null ? 0 : 2, Math.min(100, w))}%`, background: color }} /></span>
      <span className={s.mono}>{txt}</span>
    </div>
  );
}

export default function EpollSim({ lang = 'vi', preset = 'ready' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Pre>((PRESETS as readonly string[]).includes(preset) ? (preset as Pre) : 'ready');
  const [trig, setTrig] = useState<Trig>('lt');
  const [share, setShare] = useState<Share>('lt');
  const [load, setLoad] = useState<Load>('busy');
  const trigSteps = useMemo(() => trigger(trig), [trig]);
  const total = pre === 'ready' ? READY.length : pre === 'scan' ? POLLBENCH.length : pre === 'trigger' ? trigSteps.length : pre === 'oneshot' ? ONESHOT[share].length + 1 : pre === 'c10k' ? C10K_N.length : WALL_ORDER.length;
  const p = usePlayer(total, 1500);
  const i = Math.min(p.i, total - 1);
  useOwnStepSound();
  const prevI = useRef(p.i);

  const R = READY[Math.min(i, READY.length - 1)];
  const T = trigSteps[Math.min(i, trigSteps.length - 1)];
  const PB = POLLBENCH[Math.min(i, POLLBENCH.length - 1)];
  const N = C10K_N[Math.min(i, C10K_N.length - 1)];
  const row = C10K[load][N];
  const W = WALL_ORDER[Math.min(i, 2)];
  const osEv = ONESHOT[share].slice(0, Math.max(0, i));
  useEffect(() => {
    if (p.i !== prevI.current) {
      if (pre === 'ready') labSfx(R.sfx ?? 'tick');
      else if (pre === 'trigger') labSfx(T.stuck ? 'oops' : T.done ? 'hit' : 'blip-exec');
      else if (pre === 'oneshot') { const e = osEv[osEv.length - 1]; labSfx(!e ? 'tick' : e.what === 'eagain' || e.what === 'dup' ? 'miss' : e.what === 'read' ? 'hit' : 'pop'); }
      else labSfx('tick');
    }
    prevI.current = p.i;
  }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps

  const load0 = (k: Pre) => { setPre(k); p.reset(); labSfx('tap'); };
  useLabBridge('ep', {
    preset: pre, i: p.i, atEnd: p.atEnd, ready: R.ready.length, returned: R.returned.length, interest: R.interest.length, sleeping: R.sleeping,
    trig, wakes: T.wake, unread: T.buffered, stuck: T.stuck, done: T.done, share, n: N, load, p99t: row.thread.p99, p99e: row.epoll.p99, wall: W,
  }, {
    preset: (v) => load0(v as Pre), trig: (v) => { setTrig(v as Trig); p.reset(); labSfx('tap'); }, share: (v) => { setShare(v as Share); p.reset(); labSfx('tap'); },
    load: (v) => { setLoad(v as Load); labSfx('tap'); },
  });

  const explain = (): { node: ReactNode; tone?: 'ok' | 'bad' | 'warn' } => {
    if (pre === 'ready') return { node: <><b className={s.mono}>{R.call}</b> — {t(R.en, R.vi)}</> };
    if (pre === 'scan') return { node: t(`${PB.n.toLocaleString('en-US')} connections, ONE of them active. select/poll hand all ${PB.n.toLocaleString('en-US')} fds to the kernel and get them back on every wake-up: ${PB.poll} µs. epoll returns just the ready one: ${PB.epoll} µs.${PB.select === null ? ` select() cannot even try: fd ${PB.n + 2} ≥ FD_SETSIZE (${FD_SETSIZE}); FD_SET(1102) aborts the program (exit 134).` : ''}`, `${PB.n.toLocaleString('vi-VN')} kết nối, chỉ MỘT cái có hoạt động. select/poll trao cả ${PB.n.toLocaleString('vi-VN')} fd cho nhân rồi nhận lại sau mỗi lần thức: ${PB.poll} µs. epoll chỉ trả đúng cái sẵn sàng: ${PB.epoll} µs.${PB.select === null ? ` select() thậm chí không thử được: fd ${PB.n + 2} ≥ FD_SETSIZE (${FD_SETSIZE}); FD_SET(1102) làm chương trình abort (thoát 134).` : ''}`), tone: PB.select === null ? 'bad' : PB.n >= 1000 ? 'warn' : undefined };
    if (pre === 'trigger') return { node: <><b className={s.mono}>{T.line.trim()}</b> — {t(T.en, T.vi)}</>, tone: T.stuck ? 'bad' : T.done ? 'ok' : undefined };
    if (pre === 'oneshot') {
      const e = osEv[osEv.length - 1];
      const txt = share === 'lt' ? t('Level-triggered and 4 threads in epoll_wait on the same epoll: ONE new connection wakes ALL FOUR (thundering herd). One reads the 28 bytes; three get EAGAIN for nothing.', 'Theo mức và 4 luồng cùng chờ trên một epoll: MỘT kết nối mới đánh thức CẢ BỐN (bầy đàn ùa vào). Một luồng đọc được 28 byte; ba luồng nhận EAGAIN vô ích.')
        : share === 'et' ? t('Edge-triggered helps, but not enough: a second thread is woken at 56 ms for the same connection while thread 4 is still working on it — two threads, one socket.', 'Theo cạnh đỡ hơn, nhưng chưa đủ: luồng thứ hai bị đánh thức lúc 56 ms cho cùng kết nối trong khi luồng 4 vẫn đang xử lý nó — hai luồng, một socket.')
          : t('EPOLLONESHOT: after the fd fires once it is disarmed until the owner re-arms it with EPOLL_CTL_MOD. Exactly one thread wakes, one thread reads.', 'EPOLLONESHOT: fd báo một lần xong là bị tháo dây cót cho tới khi chủ của nó lên dây lại bằng EPOLL_CTL_MOD. Đúng một luồng thức, một luồng đọc.');
      return { node: <>{e && <b className={s.mono}>{String(e.ms).padStart(3)} ms thread {e.th}: {e.what === 'woke' ? 'woke' : e.what === 'dup' ? 'woke — ALREADY handled by another thread' : e.what === 'read' ? 'read 28 bytes' : 'read nothing: EAGAIN'} — </b>}{txt}</>, tone: share === 'oneshot' ? 'ok' : 'warn' };
    }
    if (pre === 'c10k') return { node: t(`${N.toLocaleString('en-US')} connections, ${load === 'busy' ? '10 messages/s each' : '1 message/s each'}. Thread-per-connection: ${row.thread.threads.toLocaleString('en-US')} threads, ${row.thread.rss} MiB RSS + ${row.thread.kstack} MiB kernel stacks RSS does not show, ${row.thread.ctx.toLocaleString('en-US')} context switches, p99 ${row.thread.p99} ms. One thread + epoll: ${row.epoll.rss} MiB, p99 ${row.epoll.p99} ms.`, `${N.toLocaleString('vi-VN')} kết nối, ${load === 'busy' ? 'mỗi cái 10 tin/giây' : 'mỗi cái 1 tin/giây'}. Mỗi kết nối một luồng: ${row.thread.threads.toLocaleString('vi-VN')} luồng, ${row.thread.rss} MiB RSS + ${row.thread.kstack} MiB stack nhân mà RSS không hiện, ${row.thread.ctx.toLocaleString('vi-VN')} lần đổi ngữ cảnh, p99 ${row.thread.p99} ms. Một luồng + epoll: ${row.epoll.rss} MiB, p99 ${row.epoll.p99} ms.`), tone: row.thread.p99 > 10 ? 'bad' : undefined };
    return { node: <><b className={s.mono}>{WALLS[W].limit}</b> — {t(WALLS[W].en, WALLS[W].vi)}</>, tone: 'warn' };
  };
  const ex = explain();

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('epoll: one thread, thousands of connections', 'epoll: một luồng, hàng nghìn kết nối')}
      sub={t('The interest list, the ready list, edge vs level, and what thread-per-connection really costs', 'Danh sách quan tâm, danh sách sẵn sàng, cạnh vs mức, và cái giá thật của mỗi-kết-nối-một-luồng')}>
      <div className={s.bar} data-tour="ep-preset">
        <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['ready', t('ready list', 'danh sách sẵn sàng')], ['scan', t('cost per wake', 'giá mỗi lần thức')], ['trigger', 'LT / ET'], ['oneshot', t('4 threads', '4 luồng')], ['c10k', 'C10K'], ['walls', t('the walls', 'các bức tường')]]} onChange={load0} />
      </div>
      {(pre === 'trigger' || pre === 'oneshot' || pre === 'c10k') && (
        <div className={s.bar} data-tour="ep-opts">
          {pre === 'trigger' && <Seg label={t('mode', 'chế độ')} value={trig} options={[['lt', t('level (LT)', 'theo mức (LT)')], ['et', t('edge (ET)', 'theo cạnh (ET)')], ['drain', t('ET + read until EAGAIN', 'ET + đọc tới EAGAIN')]]} onChange={(v) => { setTrig(v); p.reset(); labSfx('tap'); }} />}
          {pre === 'oneshot' && <Seg label="epoll" value={share} options={[['lt', 'LT'], ['et', 'EPOLLET'], ['oneshot', 'EPOLLONESHOT']]} onChange={(v) => { setShare(v); p.reset(); labSfx('tap'); }} />}
          {pre === 'c10k' && <Seg label={t('load', 'tải')} value={load} options={[['busy', t('busy: 10 msg/s', 'bận: 10 tin/s')], ['light', t('light: 1 msg/s (chat)', 'nhẹ: 1 tin/s (chat)')]]} onChange={(v) => { setLoad(v); labSfx('tap'); }} />}
        </div>
      )}
      <Controls p={p} lang={lang} label={pre === 'scan' ? `N = ${PB.n.toLocaleString('en-US')}` : pre === 'c10k' ? `${N.toLocaleString('en-US')} ${t('connections', 'kết nối')}` : undefined} />
      <Explain tone={ex.tone}>{ex.node}</Explain>

      <div className={c.split} style={{ marginTop: 10 }}>
        <div className={s.stack} style={{ gap: 8 }}>
          {pre === 'ready' && <>
            <div className={s.panel} data-tour="ep-socks">
              <div className={s.panelTitle}>{t('Sockets (fd numbers)', 'Các socket (số fd)')}</div>
              <div className={c.socks}>
                {[3, 5, 6, 7, 8, 9, 10, 11, 12].map((fd) => {
                  const live = R.interest.includes(fd);
                  return <div key={fd} className={cx(c.sock, R.ready.includes(fd) && c.sockReady, R.serving === fd && c.sockServe)} style={{ opacity: live || R.serving === fd ? 1 : 0.3 }}>{fd === 3 ? '3 👂' : fd}</div>;
                })}
              </div>
              <div className={s.small} style={{ marginTop: 4 }}>{t('green = data waiting (on the ready list) · blue = being served · faded = not registered', 'xanh lá = có dữ liệu chờ (trong danh sách sẵn sàng) · xanh dương = đang phục vụ · mờ = chưa đăng ký')}</div>
            </div>
            <div className={s.grid2} style={{ gap: 8 }} data-tour="ep-lists">
              <div className={c.card}><b>{t('interest list', 'danh sách quan tâm')}</b><span className={c.link}>{t('edited by epoll_ctl, once per fd', 'sửa bằng epoll_ctl, mỗi fd một lần')}</span>
                <div className={s.chips} style={{ minHeight: 26 }}>{R.interest.length ? R.interest.map((fd) => <span key={fd} className={s.chip} style={{ background: '#475569', height: 22, minWidth: 26, fontSize: 11 }}>{fd}</span>) : <span className={s.empty}>—</span>}</div></div>
              <div className={c.card}><b>{t('ready list', 'danh sách sẵn sàng')}</b><span className={c.link}>{t('filled by the kernel when packets arrive', 'nhân điền vào khi gói tin tới')}</span>
                <div className={s.chips} style={{ minHeight: 26 }}>{R.ready.length ? R.ready.map((fd) => <span key={fd} className={s.chip} style={{ background: '#059669', height: 22, minWidth: 26, fontSize: 11 }}>{fd}</span>) : <span className={s.empty}>—</span>}</div></div>
            </div>
            <div className={s.kpis} data-tour="ep-cost">
              <Kpi k={t('thread', 'luồng')} v={R.sleeping ? t('💤 sleeping', '💤 đang ngủ') : t('⚙️ running', '⚙️ đang chạy')} tone={R.sleeping ? 'ok' : undefined} />
              <Kpi k={t('epoll touches', 'epoll đụng tới')} v={`${R.epollWork} fd`} tone="ok" />
              <Kpi k={t('poll would scan', 'poll sẽ quét')} v={`${R.pollWork} fd`} tone={R.pollWork > R.epollWork ? 'warn' : undefined} />
            </div>
          </>}
          {pre === 'scan' && (
            <div className={s.panel} data-tour="ep-cost">
              <div className={s.panelTitle}>{t('µs per wake-up, one active connection out of N (pollbench, log scale)', 'µs mỗi lần thức, một kết nối hoạt động trong N (pollbench, thang log)')}</div>
              {POLLBENCH.map((r) => (
                <div key={r.n} style={{ marginBottom: 6, opacity: r.n === PB.n ? 1 : 0.5 }}>
                  <div className={s.small} style={{ fontWeight: 800 }}>N = {r.n.toLocaleString('en-US')}</div>
                  <div className={c.ladder}>
                    <Bar label="select" v={r.select} max={676} log txt={r.select === null ? t('impossible', 'không thể') : `${r.select} µs`} color={r.select === null ? 'var(--ol-bad)' : '#d97706'} on={r.n === PB.n} />
                    <Bar label="poll" v={r.poll} max={676} log txt={`${r.poll} µs`} color="#d97706" on={r.n === PB.n} />
                    <Bar label="epoll" v={r.epoll} max={676} log txt={`${r.epoll} µs`} color="#059669" on={r.n === PB.n} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {pre === 'trigger' && (
            <div className={s.panel} data-tour="ep-bytes">
              <div className={s.panelTitle}>{t('The socket\'s receive buffer (10 bytes arrived at once)', 'Bộ đệm nhận của socket (10 byte tới cùng lúc)')}</div>
              <div className={c.byteRow}>{Array.from({ length: 10 }, (_, k) => <span key={k} className={cx(c.byte, k < T.read ? c.byteRead : k < T.read + T.buffered ? c.byteIn : undefined)}>{k + 1}</span>)}</div>
              <div className={s.kpis} style={{ marginTop: 8 }}>
                <Kpi k={t('wake-ups', 'lần thức')} v={T.wake} />
                <Kpi k={t('read', 'đã đọc')} v={`${T.read} B`} tone={T.done ? 'ok' : undefined} />
                <Kpi k={t('still unread', 'còn chưa đọc')} v={`${T.buffered} B`} tone={T.stuck ? 'bad' : undefined} />
              </div>
              <div className={s.term} style={{ marginTop: 8, minHeight: 0 }}>[{trig === 'drain' ? 'et-drain' : trig}]{'\n'}{trigSteps.slice(1, i + 1).map((x) => x.line).join('\n')}</div>
            </div>
          )}
          {pre === 'oneshot' && (
            <div className={s.panel} data-tour="ep-lanes">
              <div className={s.panelTitle}>{t('4 threads in epoll_wait on the same epoll, one new connection', '4 luồng cùng epoll_wait trên một epoll, một kết nối mới')}</div>
              {[4, 3, 2, 1].map((th) => {
                const evs = osEv.filter((e) => e.th === th);
                return (
                  <div key={th} style={{ display: 'grid', gridTemplateColumns: '70px minmax(0,1fr)', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <span className={s.mono} style={{ fontWeight: 800 }}>thread {th}</span>
                    <div className={s.chips} style={{ minHeight: 26 }}>
                      {evs.length ? evs.map((e, k) => <span key={k} className={cx(c.tag, e.what === 'read' ? c.tagOk : e.what === 'woke' ? c.tagAcc : c.tagBad)}>{e.ms} ms · {e.what === 'woke' ? t('woke', 'thức') : e.what === 'dup' ? t('woke (duplicate!)', 'thức (trùng!)') : e.what === 'read' ? t('read 28 B', 'đọc 28 B') : 'EAGAIN'}</span>) : <span className={s.empty}>💤</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {pre === 'c10k' && (
            <div className={s.panel} data-tour="ep-c10k">
              <div className={s.grid2} style={{ gap: 8 }}>
                {(['thread', 'epoll'] as const).map((m) => {
                  const r = row[m];
                  return (
                    <div key={m} className={c.card}>
                      <b>{m === 'thread' ? t('thread per connection', 'mỗi kết nối một luồng') : t('one thread + epoll', 'một luồng + epoll')}</b>
                      <div className={c.ladder} style={{ marginTop: 4 }}>
                        <Bar label={t('threads', 'luồng')} v={r.threads} max={10001} txt={r.threads.toLocaleString('en-US')} />
                        <Bar label={t('memory', 'bộ nhớ')} v={realMiB(r)} max={280} txt={`${realMiB(r).toFixed(1)} MiB`} color={m === 'thread' ? '#d97706' : '#059669'} />
                        <Bar label={t('ctx switches', 'đổi ngữ cảnh')} v={r.ctx} max={206518} log txt={r.ctx.toLocaleString('en-US')} />
                        <Bar label="p99" v={r.p99} max={322} log txt={`${r.p99} ms`} color={r.p99 > 10 ? 'var(--ol-bad)' : '#059669'} />
                        <Bar label={t('late sends', 'gửi trễ')} v={r.late} max={61800} log txt={r.late.toLocaleString('en-US')} />
                      </div>
                      <span className={c.link}>RSS {r.rss} MiB{r.kstack ? ` + ${r.kstack} MiB ${t('kernel stacks (not in RSS)', 'stack nhân (không có trong RSS)')}` : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {pre === 'walls' && (
            <div className={s.panel} data-tour="ep-walls">
              <div className={s.panelTitle}>{WALLS[W].limit}</div>
              <div className={s.grid2} style={{ gap: 8 }}>
                {(['thread', 'epoll'] as const).map((m) => {
                  const w = WALLS[W][m];
                  return (
                    <div key={m} className={cx(c.card, w.failAt !== null && c.cardBad)}>
                      <b>{m === 'thread' ? t('thread per connection', 'mỗi kết nối một luồng') : t('one thread + epoll', 'một luồng + epoll')}</b>
                      <span className={c.link}>{w.failAt !== null ? t(`breaks at ~${w.failAt.toLocaleString('en-US')} connections`, `gãy ở ~${w.failAt.toLocaleString('vi-VN')} kết nối`) : t('fine', 'ổn')}</span>
                      <code className={s.mono} style={{ display: 'block', whiteSpace: 'pre-wrap', fontSize: 11 }}>{w.out.join('\n')}</code>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          {pre === 'ready' && <div className={s.term} data-tour="ep-term" style={{ minHeight: 90 }}>{READY.slice(Math.max(0, i - 6), i + 1).map((x, k) => <div key={k} className={k === Math.min(i, 6) ? undefined : s.dim}>{x.call}</div>)}</div>}
          {pre !== 'ready' && <div className={s.small} data-tour="ep-term">{pre === 'c10k' ? t('A context switch costs microseconds and wipes the CPU caches; 10 000 sleeping threads each need a kernel stack and a scheduler entry. Little\'s law: at 1 msg/s and ~0.1 ms per message only ~1 message is in flight — one thread is plenty.', 'Một lần đổi ngữ cảnh tốn vài micro giây và làm nguội cache CPU; 10 000 luồng đang ngủ mỗi luồng cần một stack nhân và một chỗ trong bộ lập lịch. Định luật Little: 1 tin/giây × ~0,1 ms mỗi tin ⇒ chỉ ~1 tin đang xử lý — một luồng là thừa đủ.') : pre === 'scan' ? t('The "C10K problem" (1999) was exactly this: poll() cost grows with the number of connections, not with the number of busy ones.', '"Bài toán C10K" (1999) chính là chuyện này: giá của poll() tăng theo số kết nối, không theo số kết nối đang bận.') : t('Node (libuv), nginx, Redis, Go\'s netpoller and Java NIO are all built on this loop.', 'Node (libuv), nginx, Redis, netpoller của Go và Java NIO đều dựng trên vòng lặp này.')}</div>}
          <WhereBox focus={pre === 'c10k' || pre === 'walls' ? 'thread' : R.where === 'packet' && pre === 'ready' ? 'packet' : 'epoll'} lang={lang} height={210} />
        </div>
      </div>
    </Frame>
  );
}
