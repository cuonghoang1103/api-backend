'use client';
/**
 * Chồng lớp OverlayFS (Chương 12): lowerdir chỉ-đọc, upperdir ghi được, merged là góc nhìn ghép; copy-up chép nguyên
 * tệp, whiteout che tệp đã xoá, thư mục opaque; ảnh Docker = 13 lớp + 1 lớp init; bộ nhớ đệm build: đổi một tệp thì
 * lớp nào phải dựng lại. Engine: engine/overlay.ts (khớp lab/out/c123-overlay, c123-host).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { DOCKER_DIFF, IMAGE_LAYERS, OS_LAB_LAYERS, OV_SCRIPTS, buildPlan, lowerdirCount, merged, resolve, runOv, upperMB, type Change, type OvOp, type OvState } from './engine/overlay';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab2.module.css';

const PRESETS = ['layers', 'copyup', 'whiteout', 'opaque', 'image', 'cache'] as const;
type Pre = (typeof PRESETS)[number];
const FILES = ['etc/app.conf', 'etc/legacy.conf', 'os-release', 'server.js', 'big.db'];
const LAYER_COL: Record<string, string> = { upper: '#059669', app: '#2563eb', base: '#7c3aed' };

const IMAGE_STEPS: Array<[string, string]> = [
  ['The os-lab image is 13 layers with content — one per Dockerfile instruction that changed files (docker history; ENV/CMD lines add 0 B metadata).', 'Image os-lab gồm 13 lớp có nội dung — mỗi lệnh Dockerfile đổi tệp là một lớp (docker history; dòng ENV/CMD chỉ thêm siêu dữ liệu 0 B).'],
  ['docker run adds one small "init" layer (/etc/hosts, /etc/resolv.conf…) on top: 13 + 1 = 14 lowerdirs in /proc/self/mountinfo. alpine has 1 layer, so 1 + 1 = 2.', 'docker run thêm một lớp "init" nhỏ (/etc/hosts, /etc/resolv.conf…) ở trên: 13 + 1 = 14 lowerdir trong /proc/self/mountinfo. alpine có 1 lớp, nên 1 + 1 = 2.'],
  ['…and one empty upperdir for this container only. Ten containers from the same image share the 14 lower layers on disk and each gets its own upper.', '…và một upperdir trống chỉ của container này. Mười container từ cùng image dùng chung 14 lớp dưới trên đĩa, mỗi cái có upper riêng.'],
  ['The container writes /tmp/note, rm\'s /etc/legal and appends to /etc/hosts.allow. docker diff simply lists its upper: A added, C changed, D deleted (a whiteout).', 'Container ghi /tmp/note, xoá /etc/legal và nối vào /etc/hosts.allow. docker diff chỉ đơn giản liệt kê upper của nó: A thêm, C đổi, D xoá (một whiteout).'],
];
const CACHE_STEPS: Array<{ change: Change; first?: boolean; en: string; vi: string }> = [
  { change: 'none', first: true, en: 'First build: every step runs; RUN npm ci takes 3 s. Each step\'s result is saved as a layer, keyed by the instruction AND the files it copied.', vi: 'Lần build đầu: mọi bước đều chạy; RUN npm ci mất 3 s. Kết quả mỗi bước được lưu thành một lớp, khoá theo câu lệnh VÀ các tệp nó chép vào.' },
  { change: 'none', en: 'Build again with no change: every step is CACHED — the build is instant.', vi: 'Build lại không đổi gì: mọi bước đều CACHED — build xong tức thì.' },
  { change: 'server', en: 'Edit server.js: steps 1–4 are still CACHED; only step 5 (COPY server.js) runs — DONE 0.1 s. npm ci is skipped because package.json did not change.', vi: 'Sửa server.js: bước 1–4 vẫn CACHED; chỉ bước 5 (COPY server.js) chạy — DONE 0,1 s. npm ci được bỏ qua vì package.json không đổi.' },
  { change: 'package', en: 'Edit package.json: step 3 changes, so step 3 AND every step after it rebuild — npm ci runs again (DONE 3.1 s). A layer depends on everything below it.', vi: 'Sửa package.json: bước 3 đổi, nên bước 3 VÀ mọi bước sau nó dựng lại — npm ci chạy lại (DONE 3,1 s). Một lớp phụ thuộc mọi thứ bên dưới nó.' },
];

export default function OverlaySim({ lang = 'vi', preset = 'layers' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Pre>((PRESETS as readonly string[]).includes(preset) ? (preset as Pre) : 'layers');
  const fsMode = pre !== 'image' && pre !== 'cache';
  const [ops, setOps] = useState<OvOp[]>(() => OV_SCRIPTS[fsMode ? pre : 'layers']);
  const states = useMemo(() => runOv(ops), [ops]);
  const total = pre === 'image' ? IMAGE_STEPS.length : pre === 'cache' ? CACHE_STEPS.length : states.length;
  const p = usePlayer(total, 1500);
  const S: OvState = states[Math.min(p.i, states.length - 1)];
  const [order, setOrder] = useState<'good' | 'bad'>('good');
  const [changeOverride, setChange] = useState<Change | null>(null);
  const [file, setFile] = useState('etc/app.conf');
  const seekEnd = useRef(false);
  useOwnStepSound();
  const prevI = useRef(p.i);
  useEffect(() => {
    if (p.i !== prevI.current) {
      setChange(null);
      if (fsMode && p.i > 0) labSfx(S.last.tone === 'bad' ? 'oops' : S.last.copied && S.last.copied > 50 ? 'whoosh' : S.last.tone === 'warn' ? 'pop' : 'blip-exec');
      else labSfx('tick');
    }
    prevI.current = p.i;
  }, [p.i, S, fsMode]);
  useEffect(() => { if (seekEnd.current) { seekEnd.current = false; p.setI(states.length - 1); } }, [states]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = (k: Pre) => { setPre(k); if (k !== 'image' && k !== 'cache') setOps(OV_SCRIPTS[k]); setChange(null); setOrder('good'); p.reset(); labSfx('tap'); };
  const doOp = (op: OvOp) => { setOps([...ops.slice(0, p.i), ...(S.mounted || op.op === 'mount' ? [] : [{ op: 'mount' } as OvOp]), op]); seekEnd.current = true; labSfx('tap'); };
  const cs = CACHE_STEPS[Math.min(p.i, CACHE_STEPS.length - 1)];
  const change = changeOverride ?? cs.change;
  const plan = buildPlan(order, change, changeOverride === null && !!cs.first);
  const view = merged(S);
  const wh = Object.values(S.upper.files).filter((e) => e.kind === 'whiteout').length;

  useLabBridge('ov', {
    preset: pre, i: p.i, atEnd: p.atEnd, mounted: S.mounted, upperMB: upperMB(S), sec: S.last.sec ?? 0, copied: S.last.copied ?? 0, whiteouts: wh,
    opaque: !!S.upper.files.etc?.opaque, appConf: resolve(S, 'etc/app.conf')?.e.data ?? '', order, change, rebuilt: plan.steps.filter((x) => !x.cached).length, buildSec: plan.total,
  }, {
    preset: (v) => load(v as Pre), order: (v) => { setOrder(v as 'good' | 'bad'); labSfx('tap'); }, change: (v) => { setChange(v as Change); labSfx('tap'); },
    append: (v) => doOp({ op: 'append', path: String(v ?? file), data: 'x\n' }), rm: (v) => doOp({ op: 'rm', path: String(v ?? file) }), read: (v) => doOp({ op: 'read', path: String(v ?? file) }),
  });

  const layerRow = (name: string, files: Record<string, { kind: string; mb: number; opaque?: boolean }>, role: string) => (
    <div className={c.layer} style={{ borderLeft: `5px solid ${LAYER_COL[name] ?? '#64748b'}` }} key={name}>
      <div className={c.layerHead}><span style={{ color: LAYER_COL[name] }}>{name}/</span><span className={c.tag}>{role}</span>{name === 'upper' && <span className={cx(c.tag, c.tagOk)}>du -sm: {upperMB(S)} MB</span>}</div>
      <div className={c.files}>
        {Object.entries(files).filter(([, e]) => e.kind !== 'dir' || e.opaque).sort().map(([p0, e]) => {
          const vis = resolve(S, p0);
          const hidden = e.kind === 'file' && (!vis || vis.from !== name);
          return (
            <span key={p0} className={cx(c.file, e.kind === 'whiteout' && c.fileWh, hidden && c.fileHide, S.last.hot.layer === name && S.last.hot.path === p0 && c.fileHot, name === 'upper' && e.kind === 'file' && c.fileNew)}>
              {e.kind === 'whiteout' ? '⊘ ' : e.opaque ? '▣ ' : ''}{p0}{e.opaque ? '/ (opaque)' : ''}{e.mb ? ` · ${e.mb} MB` : ''}
            </span>
          );
        })}
        {!Object.keys(files).length && <span className={s.empty}>{t('(empty)', '(trống)')}</span>}
      </div>
    </div>
  );

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('OverlayFS: how image layers stack', 'OverlayFS: các lớp image chồng lên nhau ra sao')}
      sub={t('Read-only layers, one writable layer, one merged view — copy-up, whiteouts and the build cache', 'Các lớp chỉ-đọc, một lớp ghi được, một góc nhìn ghép — copy-up, whiteout và bộ nhớ đệm build')}>
      <div className={s.bar} data-tour="ov-preset">
        <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={PRESETS.map((k) => [k, k])} onChange={load} />
      </div>
      {fsMode && (
        <div className={s.bar} data-tour="ov-ops">
          <span className={s.lbl}>{t('Do it yourself:', 'Tự làm:')}</span>
          <label className={s.lbl}>{t('file', 'tệp')} <select value={file} onChange={(e) => setFile(e.target.value)}>{FILES.map((x) => <option key={x}>{x}</option>)}</select></label>
          <button type="button" className={s.btn} onClick={() => doOp({ op: 'read', path: file })}>cat</button>
          <button type="button" className={s.btn} onClick={() => doOp({ op: 'append', path: file, data: 'x\n' })}>echo x &gt;&gt;</button>
          <button type="button" className={s.btn} onClick={() => doOp({ op: 'rm', path: file })}>rm</button>
          <button type="button" className={s.btn} onClick={() => doOp({ op: 'rmdir', path: 'etc' })}>rm -rf etc &amp;&amp; mkdir etc</button>
        </div>
      )}
      {pre === 'cache' && (
        <div className={s.bar} data-tour="ov-ops">
          <Seg label="Dockerfile" value={order} options={[['good', t('COPY package.json first', 'COPY package.json trước')], ['bad', 'COPY . . ' + t('first', 'trước')]]} onChange={(v) => { setOrder(v); labSfx('tap'); }} />
          <Seg label={t('you edit', 'bạn sửa')} value={change} options={[['none', t('nothing', 'không gì')], ['server', 'server.js'], ['package', 'package.json']]} onChange={(v) => { setChange(v); labSfx('tap'); }} />
        </div>
      )}
      <Controls p={p} lang={lang} />
      <Explain tone={fsMode ? S.last.tone : pre === 'cache' && plan.total >= 3 ? 'warn' : undefined}>
        {fsMode ? <>{S.last.cmd && <><b className={s.mono}>$ {S.last.cmd}</b> — </>}{t(S.last.en, S.last.vi)}</>
          : pre === 'image' ? t(IMAGE_STEPS[p.i][0], IMAGE_STEPS[p.i][1])
            : changeOverride ? t(`Your edit: ${change === 'none' ? 'nothing' : change === 'server' ? 'server.js' : 'package.json'} with ${order === 'good' ? 'the good order' : '"COPY . ." first'} ⇒ ${plan.steps.filter((x) => !x.cached).length} step(s) rebuild, ${plan.total} s.`, `Bạn sửa: ${change === 'none' ? 'không gì' : change === 'server' ? 'server.js' : 'package.json'} với ${order === 'good' ? 'thứ tự tốt' : '"COPY . ." trước'} ⇒ ${plan.steps.filter((x) => !x.cached).length} bước dựng lại, ${plan.total} s.`) : t(cs.en, cs.vi)}
      </Explain>

      {fsMode && (
        <div className={c.split} style={{ marginTop: 10 }}>
          <div className={c.layers} data-tour="ov-stack">
            <div className={c.layer} style={{ borderLeft: '5px solid var(--ol-accent)', background: 'var(--ol-accent-bg)', opacity: S.mounted ? 1 : 0.45 }} data-tour="ov-merged">
              <div className={c.layerHead}>merged/ <span className={cx(c.tag, c.tagAcc)}>{t('what the container sees', 'thứ container thấy')}</span>{!S.mounted && <span className={c.tag}>{t('not mounted', 'chưa mount')}</span>}</div>
              <div className={c.files}>
                {S.mounted ? view.filter((m) => m.e.kind === 'file').map((m) => <span key={m.path} className={cx(c.file, S.last.hot.path === m.path && c.fileHot)} style={{ borderColor: LAYER_COL[m.from] }}>{m.path} <span style={{ color: LAYER_COL[m.from], fontWeight: 800 }}>← {m.from}</span></span>) : <span className={s.empty}>—</span>}
              </div>
            </div>
            <div className={s.small} style={{ textAlign: 'center' }}>▲ {t('the kernel looks from the top down; the first match wins', 'nhân tìm từ trên xuống; gặp trước thì thắng')} ▲</div>
            {layerRow('upper', S.upper.files, t('upperdir · writable', 'upperdir · ghi được'))}
            {S.lowers.map((L, k) => layerRow(L.name, L.files, `lowerdir ${k + 1} · ${t('read-only', 'chỉ đọc')}`))}
            <div className={s.small}>workdir/ — {t('scratch space the kernel needs to make copy-up atomic', 'chỗ nháp nhân cần để copy-up diễn ra nguyên tử')}</div>
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            {S.last.copied ? (
              <div className={s.panel} data-tour="ov-copyup">
                <div className={s.panelTitle}>{t('copy-up', 'copy-up')}: {S.last.copied} MB → upper</div>
                <div className={c.progressBar}><div style={{ width: '100%' }} /></div>
                <div className={s.kpis} style={{ marginTop: 6 }}><Kpi k={t('time', 'thời gian')} v={`${S.last.sec} s`} tone="warn" /><Kpi k="du -sm upper" v={`${upperMB(S)} MB`} /></div>
              </div>
            ) : (
              <div className={s.kpis} data-tour="ov-copyup"><Kpi k="du -sm upper" v={`${upperMB(S)} MB`} /><Kpi k={t('last write', 'lần ghi cuối')} v={S.last.sec ? `${S.last.sec * 1000} ms` : '—'} /><Kpi k="whiteouts" v={wh} tone={wh ? 'warn' : undefined} /></div>
            )}
            <div className={s.term} data-tour="ov-term" style={{ minHeight: 70 }}>
              {S.term.length ? S.term.slice(-8).map((l, k) => <div key={k} className={/No such/.test(l) ? s.er : l.startsWith('$') ? undefined : /^[ACD] \//.test(l) ? s.pr : s.dim}>{l}</div>) : <span className={s.dim}>{t('(no output yet)', '(chưa có output)')}</span>}
            </div>
            <WhereBox focus="overlay" lang={lang} height={200} />
          </div>
        </div>
      )}

      {pre === 'image' && (
        <div className={c.split} style={{ marginTop: 10 }}>
          <div className={c.layers} data-tour="ov-stack">
            {p.i >= 2 && <div className={c.layer} style={{ borderLeft: '5px solid #059669' }}><div className={c.layerHead}>upper/ <span className={cx(c.tag, c.tagOk)}>{t('this container only', 'riêng container này')}</span></div>
              {p.i >= 3 ? <div className={c.files}>{DOCKER_DIFF.map((d) => <span key={d} className={cx(c.file, d.startsWith('D') ? c.fileWh : d.startsWith('A') ? c.fileNew : undefined)}>{d}</span>)}</div> : <span className={s.empty}>{t('(empty)', '(trống)')}</span>}</div>}
            {p.i >= 1 && <div className={c.layer} style={{ borderLeft: '5px solid #d97706' }}><div className={c.layerHead}>{t('init layer', 'lớp init')} <span className={c.tag}>/etc/hosts · /etc/hostname · /etc/resolv.conf</span></div></div>}
            {[...IMAGE_LAYERS].reverse().map((L, k) => (
              <div key={k} className={c.bstep} style={{ opacity: L.size === '0B' ? 0.55 : 1 }}>
                <span className={s.mono}>{L.size === '0B' ? '·' : '▤'}</span><code>{L.by}</code><span className={s.mono}>{L.size}</span>
              </div>
            ))}
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.kpis} data-tour="ov-copyup">
              <Kpi k={t('image layers with content', 'lớp image có nội dung')} v={OS_LAB_LAYERS} />
              <Kpi k="lowerdir" v={p.i >= 1 ? lowerdirCount(OS_LAB_LAYERS) : '—'} />
              <Kpi k={t('alpine', 'alpine')} v={`1 + 1 = ${lowerdirCount(1)}`} />
            </div>
            <div className={s.term} data-tour="ov-term">
              <span className={s.pr}>$ </span>docker image inspect os-lab -f '{'{{len .RootFS.Layers}}'} layers'{'\n'}13 layers{'\n'}
              {p.i >= 1 && <><span className={s.pr}>$ </span>grep -oE 'lowerdir=[^,]*' /proc/self/mountinfo | tr ':' '\n' | wc -l{'\n'}14{'\n'}</>}
              {p.i >= 3 && <><span className={s.pr}>$ </span>docker diff os-c123-diff{'\n'}{DOCKER_DIFF.join('\n')}</>}
            </div>
            <WhereBox focus="overlay" lang={lang} height={200} />
          </div>
        </div>
      )}

      {pre === 'cache' && (
        <div className={c.split} style={{ marginTop: 10 }}>
          <div className={s.panel} data-tour="ov-stack">
            <div className={s.panelTitle}>docker build --progress=plain cache-demo</div>
            <div className={c.steps}>
              {plan.steps.map((x) => (
                <div key={x.n} className={cx(c.bstep, x.cached ? c.bCached : c.bRun)}>
                  <span className={s.mono}>[{x.n}/{plan.steps.length}]</span><code>{x.cmd}</code>
                  <span className={cx(c.tag, x.cached ? c.tagOk : c.tagWarn)}>{x.n === 1 ? 'FROM' : x.cached ? 'CACHED' : `DONE ${x.sec.toFixed(1)}s`}</span>
                </div>
              ))}
            </div>
            <div className={s.kpis} style={{ marginTop: 8 }} data-tour="ov-copyup">
              <Kpi k={t('steps rebuilt', 'bước dựng lại')} v={plan.steps.filter((x) => !x.cached).length} tone={plan.total >= 3 ? 'warn' : 'ok'} />
              <Kpi k={t('build time', 'thời gian build')} v={`${plan.total} s`} tone={plan.total >= 3 ? 'warn' : 'ok'} />
            </div>
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.small}>{t('Rule: put what changes RARELY (dependencies) above what changes OFTEN (your code). "COPY . ." before "RUN npm ci" makes every code edit reinstall all dependencies.', 'Luật: đặt thứ ÍT đổi (thư viện) phía trên thứ HAY đổi (mã của bạn). "COPY . ." trước "RUN npm ci" khiến mỗi lần sửa code là cài lại toàn bộ thư viện.')}</div>
            <WhereBox focus="overlay" lang={lang} height={200} />
          </div>
        </div>
      )}
    </Frame>
  );
}
