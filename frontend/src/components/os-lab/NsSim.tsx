'use client';
/**
 * "Một tiến trình, hai góc nhìn" (Chương 12): cùng một sleep 600 nhìn từ máy chủ và từ trong container; bật từng
 * namespace (pid, mnt, net, uts, ipc, user, cgroup, time) và xem đúng thứ bên trong thấy thay đổi. Kèm bẫy của unshare,
 * user namespace (uid_map) và pod (pause + app + sidecar dùng chung namespace). Engine: engine/ns.ts (khớp c121, c127).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { KINDS, NS_SCRIPTS, POD_DEFAULT, host, inodeRows, inside, podView, type NsKind, type NsOn, type PodShare, type UserMode, type View } from './engine/ns';
import { Controls, Explain, Frame, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab2.module.css';

const PRESETS = ['docker', 'unshare', 'userns', 'pod'] as const;
type Pre = (typeof PRESETS)[number];
const KIND_HINT: Record<NsKind, [string, string]> = {
  pid: ['process numbers', 'số hiệu tiến trình'], mnt: ['mount table', 'bảng mount'], net: ['network stack', 'chồng mạng'], uts: ['hostname', 'hostname'],
  ipc: ['SysV IPC', 'IPC System V'], user: ['uid/gid map', 'bảng uid/gid'], cgroup: ['cgroup view', 'góc nhìn cgroup'], time: ['boot/monotonic clock', 'đồng hồ boot/monotonic'],
};

function Fields({ v, prev, lang, me }: { v: View; prev?: View; lang: Lang; me: boolean }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const row = (k: keyof View, label: string, val: string) => (
    <><dt>{label}</dt><dd className={cx(prev && JSON.stringify(prev[k]) !== JSON.stringify(v[k]) && c.changed)}>{val}</dd></>
  );
  const hl = (l: string) => (/sleep 600/.test(l) && me ? <span className={c.me}>{l}</span> : l);
  return (
    <dl className={c.kv}>
      {row('hostname', '$ hostname', v.hostname)}
      {row('pid', t('PID of sleep', 'PID của sleep'), String(v.pid))}
      {row('nspid', 'status', v.nspid)}
      <dt>$ ps -ef</dt><dd className={cx(prev && prev.ps.join() !== v.ps.join() && c.changed)}>{v.ps.map((l, k) => <div key={k}>{hl(l)}</div>)}</dd>
      {row('ifaces', '$ ip -br addr', v.ifaces.join('\n'))}
      {row('mounts', '$ findmnt', v.mounts.join('\n'))}
      {row('ipcs', '$ ipcs -q', v.ipcs)}
      {row('uidMap', 'uid_map', v.uidMap)}
      {row('touchEtc', 'touch /etc/hacked', v.touchEtc)}
      {row('cgroup', '/proc/self/cgroup', v.cgroup)}
      {row('uptime', '$ uptime', v.uptime)}
    </dl>
  );
}

export default function NsSim({ lang = 'vi', preset = 'docker' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Pre>((PRESETS as readonly string[]).includes(preset) ? (preset as Pre) : 'docker');
  const script = NS_SCRIPTS[pre];
  const p = usePlayer(script.length, 1600);
  const [custom, setCustom] = useState<{ on: NsOn; user: UserMode; hot?: NsKind; tone?: "ok" | "bad" | "warn" } | null>(null);
  const [pod, setPod] = useState<PodShare>({ ...POD_DEFAULT });
  const stepState = script[Math.min(p.i, script.length - 1)];
  const cur = custom ?? stepState;
  const prevState = custom ? stepState : p.i > 0 ? script[p.i - 1] : undefined;
  const vIn = useMemo(() => inside(cur.on, cur.user), [cur]);
  const vPrev = useMemo(() => (prevState ? inside(prevState.on, prevState.user) : undefined), [prevState]);
  const vHost = useMemo(() => host(cur.on), [cur]);
  const rows = inodeRows(cur.on);
  const pv = podView(pod);
  useOwnStepSound();
  const prevI = useRef(p.i);
  useEffect(() => {
    if (p.i !== prevI.current) { setCustom(null); const pd = script[p.i]?.pod; if (pd) setPod({ ...pd }); labSfx(script[p.i]?.tone === 'bad' ? 'oops' : script[p.i]?.hot ? 'on' : 'tick'); }
    prevI.current = p.i;
  }, [p.i, script]);

  const load = (k: Pre) => { setPre(k); setCustom(null); setPod({ ...POD_DEFAULT }); p.reset(); labSfx('tap'); };
  const toggle = (k: NsKind) => { const on = { ...cur.on, [k]: !cur.on[k] }; setCustom({ on, user: cur.user }); labSfx(on[k] ? 'on' : 'off'); };
  const setUser = (u: UserMode) => { setCustom({ on: { ...cur.on, user: true }, user: u }); labSfx('tap'); };
  const podToggle = (k: keyof PodShare) => { setPod((x) => ({ ...x, [k]: !x[k] })); labSfx(pod[k] ? 'off' : 'on'); };

  useLabBridge('ns', {
    preset: pre, i: p.i, atEnd: p.atEnd, ...Object.fromEntries(KINDS.map((k) => [k, cur.on[k]])), userMode: cur.user,
    insidePid: vIn.pid, hostname: vIn.hostname, differ: rows.filter((r) => !r.same).length,
    podNet: pod.net, podPid: pod.pid, podUts: pod.uts, curlOk: pv.curl.ok,
  }, {
    preset: (v) => load(v as Pre), toggle: (v) => toggle(v as NsKind), user: (v) => setUser(v as UserMode), pod: (v) => podToggle(v as keyof PodShare),
  });

  const sim = pre !== 'pod';
  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('One process, two points of view', 'Một tiến trình, hai góc nhìn')}
      sub={t('A container is a normal process wearing namespaces — switch them on one by one', 'Container là một tiến trình bình thường đeo các namespace — bật từng cái một')}>
      <div className={s.bar} data-tour="ns-preset">
        <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['docker', t('build a container', 'dựng container')], ['unshare', t('unshare traps', 'bẫy unshare')], ['userns', t('user namespace', 'user namespace')], ['pod', t('Kubernetes pod', 'pod Kubernetes')]]} onChange={load} />
      </div>
      {sim && (
        <div className={s.stack} style={{ gap: 6 }} data-tour="ns-toggles">
          <div className={c.nsToggles} role="group" aria-label="namespaces">
            {KINDS.map((k) => (
              <button type="button" key={k} className={cx(c.nsBtn, cur.hot === k && !custom && c.nsBtnHot)} aria-pressed={cur.on[k]} onClick={() => toggle(k)} title={t(KIND_HINT[k][0], KIND_HINT[k][1])}>
                {cur.on[k] ? '🟣' : '⚪'} {k}<span className={s.small} style={{ fontWeight: 600 }}>{t(KIND_HINT[k][0], KIND_HINT[k][1])}</span>
              </button>
            ))}
          </div>
          {cur.on.user && <Seg label="uid_map" value={cur.user} options={[['rootless', 'rootless: 0 → 1001'], ['remap', 'remap: 0 → 100000']]} onChange={setUser} />}
        </div>
      )}
      <Controls p={p} lang={lang} label={custom ? t('your own mix', 'tổ hợp của bạn') : `${t('step', 'bước')} ${p.i + 1}/${p.total}`} />
      <Explain tone={custom ? undefined : cur.tone}>{custom ? t('You changed the namespaces yourself — compare the two views. Press Step or ↺ to go back to the guided path.', 'Bạn đã tự đổi namespace — so hai góc nhìn. Bấm Bước hoặc ↺ để quay lại đường hướng dẫn.') : t(stepState.en, stepState.vi)}</Explain>

      {sim ? (
        <>
          {stepState.term && !custom && (
            <div className={s.term} data-tour="ns-term" style={{ marginTop: 8 }}>
              {stepState.term.map((l, k) => <div key={k} className={l.startsWith('$') ? undefined : /Cannot fork|fatal|exit 6|denied/.test(l) ? s.er : s.dim}>{l}</div>)}
            </div>
          )}
          <div className={s.grid2} style={{ marginTop: 10, alignItems: 'start' }}>
            <div className={c.view} data-tour="ns-host">
              <div className={c.viewHead}>🖥️ {t('From the host (Docker VM)', 'Từ máy chủ (máy ảo Docker)')} <span className={c.tag}>{t('sees the truth', 'thấy sự thật')}</span></div>
              <Fields v={vHost} lang={lang} me />
            </div>
            <div className={cx(c.view, c.viewIn)} data-tour="ns-inside">
              <div className={c.viewHead}>📦 {t('Inside the container', 'Trong container')} <span className={cx(c.tag, c.tagAcc)}>{KINDS.filter((k) => cur.on[k]).length} namespace</span></div>
              <Fields v={vIn} prev={vPrev} lang={lang} me />
            </div>
          </div>
          <div className={c.split} style={{ marginTop: 10 }}>
            <div className={s.panel} data-tour="ns-inodes">
              <div className={s.panelTitle}>{t('readlink /proc/<pid>/ns/* — container vs PID 1 of the VM', 'readlink /proc/<pid>/ns/* — container so với PID 1 của máy ảo')}</div>
              <div className={s.scrollX}>
                <table className={cx(s.tbl, s.compact)}>
                  <thead><tr><th>ns</th><th>{t('container', 'container')}</th><th>VM</th><th></th></tr></thead>
                  <tbody>{rows.map((r) => (
                    <tr key={r.kind} className={cx(cur.hot === r.kind && s.hl)}>
                      <td className={s.mono}>{r.kind}</td><td className={s.mono}>{r.same ? r.inside : r.kind === 'user' ? t('(new)', '(mới)') : r.inside}</td><td className={s.mono}>{r.vm}</td>
                      <td>{r.same ? <span className={cx(c.tag, r.kind === 'user' && c.tagWarn)}>{t('same', 'giống')}</span> : <span className={cx(c.tag, c.tagAcc)}>{t('own', 'riêng')}</span>}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className={s.small} style={{ marginTop: 4 }}>{t('Same number = same namespace = shared with the host. Nothing here is a virtual machine: one kernel, the same CPU cores.', 'Cùng số = cùng namespace = dùng chung với máy chủ. Không có gì ở đây là máy ảo: một nhân, cùng các lõi CPU.')}</div>
            </div>
            <WhereBox focus="namespace" lang={lang} height={210} />
          </div>
        </>
      ) : (
        <div className={c.split} style={{ marginTop: 10 }}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} data-tour="ns-pod">
              <div className={s.panelTitle}>{t('What the containers of the pod share (pause holds them)', 'Các container trong pod dùng chung gì (pause giữ chúng)')}</div>
              <div className={c.nsToggles}>
                {(['net', 'ipc', 'uts', 'pid'] as const).map((k) => (
                  <button type="button" key={k} className={c.nsBtn} aria-pressed={pod[k]} onClick={() => podToggle(k)}>{pod[k] ? '🔗' : '✂️'} {k}<span className={s.small} style={{ fontWeight: 600 }}>{pod[k] ? t('shared', 'dùng chung') : t('separate', 'riêng')}</span></button>
                ))}
              </div>
              <div className={s.grid3} style={{ marginTop: 8, gap: 6 }}>
                {[['pause', '/pause', t('owns the namespaces, does nothing else', 'giữ namespace, không làm gì khác')], ['app', 'python3 -m http.server 8000', t('listens on :8000', 'nghe ở :8000')], ['sidecar', 'envoy / wget', t('calls 127.0.0.1:8000', 'gọi 127.0.0.1:8000')]].map(([n, cmd, what]) => (
                  <div key={n} className={c.card}><b>{n}</b><code className={s.mono} style={{ display: 'block', fontSize: 11 }}>{cmd}</code><span className={c.link}>{what}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>{(['net', 'ipc', 'uts', 'pid', 'mnt'] as const).map((k) => <span key={k} className={cx(c.tag, (k === 'mnt' ? false : pod[k as keyof PodShare]) && c.tagAcc)}>{k}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={s.panel} data-tour="ns-podres">
              <div className={s.panelTitle}>{t('What happens', 'Kết quả')}</div>
              <dl className={c.kv}>
                <dt>sidecar → :8000</dt><dd className={pv.curl.ok ? undefined : c.changed}>{pv.curl.out}</dd>
                <dt>$ ps (app)</dt><dd>{pv.ps.join('\n')}</dd>
                <dt>hostname</dt><dd>{pv.hostname}</dd>
                <dt>IPC</dt><dd>{pv.ipc}</dd>
                <dt>{t('both bind :8000', 'cả hai nghe :8000')}</dt><dd>{pv.bothListen.out}</dd>
                <dt>{t('app restarts', 'app khởi động lại')}</dt><dd>{pv.ipAfterRestart}</dd>
              </dl>
            </div>
          </div>
          <WhereBox focus="namespace" lang={lang} height={210} />
        </div>
      )}
    </Frame>
  );
}
