'use client';
/**
 * Phòng quyền "user X làm được Y không?" (Chương 9): chọn người, việc, tệp; nhân kiểm TỪNG LUẬT một (đi qua thư mục →
 * chủ → ACL → nhóm → other → capability → sticky/setgid/umask) và tô sáng luật quyết định. Sửa bit, chủ, nhóm ngay trên
 * cây để thử lại. Engine: engine/perm.ts (khớp lab/out/c96-quyen, c97-cap).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { PERM_PRESETS, R, S_ISGID, S_ISUID, S_ISVTX, USERS, W, X, ask, baseWorld, gname, modeStr, nodeAt, octal, permStr, uname, withMode, type Ask, type Op, type World } from './engine/perm';
import { Controls, Explain, Frame, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab2.module.css';

const PRESETS = Object.keys(PERM_PRESETS);
const OPS: Array<[Op, string, string]> = [['read', 'read', 'đọc'], ['write', 'write', 'ghi'], ['exec', 'run', 'chạy'], ['list', 'ls dir', 'ls thư mục'], ['delete', 'delete', 'xoá'], ['create', 'create in', 'tạo trong']];
const BITS: Array<[number, string, boolean]> = [[S_ISUID, 's', true], [S_ISGID, 's', true], [S_ISVTX, 't', true], [0o400, 'r', false], [0o200, 'w', false], [0o100, 'x', false], [0o040, 'r', false], [0o020, 'w', false], [0o010, 'x', false], [0o004, 'r', false], [0o002, 'w', false], [0o001, 'x', false]];

function init(preset: string): { w: World; q: Ask } {
  const P = PERM_PRESETS[preset] ?? PERM_PRESETS.owner;
  return { w: P.world(baseWorld()), q: { ...P.ask } };
}

export default function PermSim({ lang = 'vi', preset = 'owner' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState(PERM_PRESETS[preset] ? preset : 'owner');
  const [w, setW] = useState<World>(() => init(pre).w);
  const [q, setQ] = useState<Ask>(() => init(pre).q);
  const [sel, setSel] = useState(q.path);
  const V = useMemo(() => ask(w, q), [w, q]);
  const p = usePlayer(V.checks.length + 1, 1100);
  const atEnd = p.i >= V.checks.length;
  const cur = atEnd ? undefined : V.checks[p.i];
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => {
    if (p.i !== prev.current) {
      if (atEnd) labSfx(V.ok ? 'hit' : 'wrong');
      else if (cur) labSfx(cur.res === 'pass' ? 'blip-exec' : cur.res === 'fail' ? 'miss' : 'tick');
    }
    prev.current = p.i;
  }, [p.i, atEnd, cur, V.ok]);

  const loadPreset = (k: string) => { const x = init(k); setPre(k); setW(x.w); setQ(x.q); setSel(x.q.path); p.reset(); labSfx('tap'); };
  const setAsk = (patch: Partial<Ask>) => {
    setQ((old) => {
      const nq = { ...old, ...patch };
      const n = nodeAt(w, nq.path);
      const wantDir = nq.op === 'list' || nq.op === 'create';
      if (n && (n.type === 'd') !== wantDir) {
        const alt = wantDir ? (n.path.lastIndexOf('/') > 0 ? n.path.slice(0, n.path.lastIndexOf('/')) : '/') : w.nodes.find((x) => x.type === 'f' && x.path.startsWith(n.path + '/'))?.path;
        if (alt) nq.path = alt;
      }
      if (nq.op !== 'read' && nq.op !== 'write') delete nq.via;
      return nq;
    });
    p.reset(); labSfx('tap');
  };
  const chmod = (path: string, mode: number) => { setW((x) => ({ ...x, nodes: x.nodes.map((n) => (n.path === path ? withMode(n, mode & 0o7777) : n)) })); p.reset(); labSfx('on'); };
  const chown = (path: string, patch: { uid?: number; gid?: number }) => { setW((x) => ({ ...x, nodes: x.nodes.map((n) => (n.path === path ? { ...n, ...patch } : n)) })); p.reset(); labSfx('tap'); };
  const selNode = nodeAt(w, sel) ?? nodeAt(w, q.path)!;
  const asked = nodeAt(w, q.path);
  const user = USERS.find((u) => u.name === q.who)!;
  const capHex = user.uid === 0 ? (q.capsDrop ? '00000000a80425f9' : '00000000a80425fb') : '0000000000000000';

  useLabBridge('perm', {
    preset: pre, who: q.who, op: q.op, path: q.path, via: q.via ?? '', capsDrop: !!q.capsDrop, i: p.i, atEnd,
    ok: atEnd ? V.ok : null, errno: atEnd ? V.errno : '', rule: cur?.rule ?? 'verdict', mode: asked ? octal(asked.mode) : '', sel, umask: w.umask,
  }, {
    preset: (v) => loadPreset(String(v)), who: (v) => setAsk({ who: String(v) }), op: (v) => setAsk({ op: v as Op }), path: (v) => { setAsk({ path: String(v) }); setSel(String(v)); },
    chmod: (v) => { const [path, m] = String(v).split(':'); chmod(path, parseInt(m, 8)); }, via: (v) => setAsk({ via: v ? '/usr/local/bin/ids' : undefined }),
    capsDrop: (v) => setAsk({ capsDrop: !!v }), select: (v) => setSel(String(v)),
  });

  const depth = (p0: string) => (p0 === '/' ? 0 : p0.split('/').length - 1);
  const wantDir = q.op === 'list' || q.op === 'create';
  const choices = w.nodes.filter((n) => (n.type === 'd') === wantDir);
  const curOn = cur?.on;

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('Permission room: can user X do Y?', 'Phòng quyền: người X làm được Y không?')}
      sub={t('rwx, owner/group/other, directories, sticky, setuid/setgid, umask, capabilities and ACLs — one rule at a time', 'rwx, chủ/nhóm/other, thư mục, sticky, setuid/setgid, umask, capability và ACL — từng luật một')}>
      <div className={s.bar} data-tour="perm-preset">
        <Seg label={t('Case', 'Tình huống')} value={pre} options={PRESETS.map((k) => [k, k])} onChange={loadPreset} />
      </div>
      <Explain>{t(PERM_PRESETS[pre].en, PERM_PRESETS[pre].vi)}</Explain>
      <div className={s.bar} data-tour="perm-ask">
        <label className={s.lbl}>{t('Who', 'Ai')}
          <select value={q.who} onChange={(e) => setAsk({ who: e.target.value })}>{USERS.map((u) => <option key={u.name} value={u.name}>{u.name} (uid {u.uid})</option>)}</select>
        </label>
        <Seg value={q.op} options={OPS.map(([k, en, vi]) => [k, t(en, vi)])} onChange={(v) => setAsk({ op: v })} />
        <label className={s.lbl}>{wantDir ? t('directory', 'thư mục') : t('file', 'tệp')}
          <select value={q.path} onChange={(e) => { setAsk({ path: e.target.value }); setSel(e.target.value); }}>{choices.map((n) => <option key={n.path} value={n.path}>{n.path}</option>)}</select>
        </label>
        {(q.op === 'read' || q.op === 'write') && <Seg value={q.via ? 'ids' : 'direct'} options={[['direct', t('directly', 'trực tiếp')], ['ids', t('through ids (setuid?)', 'qua ids (setuid?)')]]} onChange={(v) => setAsk({ via: v === 'ids' ? '/usr/local/bin/ids' : undefined })} />}
        {q.who === 'root' && <Seg value={q.capsDrop ? 'drop' : 'full'} options={[['full', t('all caps', 'đủ caps')], ['drop', '--cap-drop dac_override']]} onChange={(v) => setAsk({ capsDrop: v === 'drop' })} />}
      </div>
      <Controls p={p} lang={lang} label={atEnd ? t('verdict', 'phán quyết') : `${t('rule', 'luật')} ${p.i + 1}/${V.checks.length}`} />
      <Explain tone={atEnd ? (V.ok ? 'ok' : 'bad') : cur?.res === 'fail' ? 'bad' : cur?.res === 'pass' && cur.decide ? 'ok' : undefined}>
        {atEnd ? (V.ok ? <><b>✅ {t('Allowed.', 'Được phép.')}</b> {V.partial ? t('Partly: names only.', 'Một phần: chỉ thấy tên.') : ''}</> : <><b>⛔ {V.errno}</b> — {V.errno === 'EPERM' ? t('Operation not permitted (a rule beyond rwx said no).', 'Operation not permitted (một luật ngoài rwx nói không).') : t('Permission denied.', 'Permission denied.')}</>)
          : cur && t(cur.en, cur.vi)}
      </Explain>

      <div className={c.split} style={{ marginTop: 10 }}>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="perm-checks">
            <div className={s.panelTitle}>{t('What the kernel checks, in order', 'Nhân kiểm những gì, theo thứ tự')}</div>
            <div className={c.checks}>
              {V.checks.map((k, n) => (
                <div key={n} className={cx(c.check, n > p.i && c.checkFuture, n === p.i && c.checkDecide, n <= p.i && k.res === 'pass' && c.checkPass, n <= p.i && k.res === 'fail' && c.checkFail)}>
                  <span className={c.ic} aria-hidden>{n > p.i ? '·' : k.res === 'pass' ? '✅' : k.res === 'fail' ? '⛔' : k.res === 'skip' ? '↷' : 'ℹ️'}</span>
                  <span><span className={c.tag}>{k.rule}</span> <code className={s.mono}>{k.on}</code>{k.decide && n <= p.i && (k.res === 'pass' || k.res === 'fail') && <span className={cx(c.tag, c.tagAcc)} style={{ marginLeft: 4 }}>{t('decides', 'quyết định')}</span>}<br />{n <= p.i ? t(k.en, k.vi) : ''}</span>
                </div>
              ))}
            </div>
            {atEnd && <div className={cx(c.verdict, V.ok ? c.verdictOk : c.verdictBad)} style={{ marginTop: 8 }} data-tour="perm-verdict">{V.ok ? '✅' : '⛔'} {V.ok ? t('allowed', 'được phép') : V.errno}</div>}
          </div>
          <div className={s.term} data-tour="perm-shell" style={{ minHeight: 60 }}>
            <span className={s.pr}>$ </span>id {q.who}{'\n'}uid={user.uid}({user.name}) gid={user.gid}({gname(user.gid)}) groups={user.groups.map((g) => `${g}(${gname(g)})`).join(',')}{'\n'}<span className={s.dim}>CapEff: {capHex}</span>{'\n'}
            {V.shell.cmd}{'\n'}{atEnd ? <span className={V.ok ? undefined : s.er}>{V.shell.out}</span> : <span className={s.dim}>{t('(press Step to run the check)', '(bấm Bước để chạy phép kiểm)')}</span>}
          </div>
        </div>

        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="perm-tree">
            <div className={s.panelTitle}>{t('The files (click one to edit it)', 'Các tệp (bấm một tệp để sửa)')}</div>
            <div className={c.tree}>
              {w.nodes.map((n) => (
                <button type="button" key={n.path} className={cx(c.node, sel === n.path && c.nodeOn, n.path === q.path && c.nodeTarget)}
                  style={{ marginLeft: Math.min(4, depth(n.path)) * 10, outline: curOn === n.path ? '2px solid var(--ol-warn)' : undefined }} onClick={() => { setSel(n.path); labSfx('tap'); }}>
                  <code>{modeStr(n)} {uname(n.uid)}:{gname(n.gid)}</code>
                  <code style={{ fontWeight: 700 }}>{n.path === '/' ? '/' : n.path.slice(n.path.lastIndexOf('/') + 1)}{n.type === 'd' && n.path !== '/' ? '/' : ''}</code>
                </button>
              ))}
            </div>
          </div>
          <div className={s.panel} data-tour="perm-bits">
            <div className={s.panelTitle}>{t('Edit', 'Sửa')} <code className={s.mono}>{selNode.path}</code> — <code className={s.mono}>{modeStr(selNode)}</code> ({octal(selNode.mode)})</div>
            <div className={c.bits} role="group" aria-label="mode bits">
              {['suid', 'sgid', 'sticky', 'u', '', '', 'g', '', '', 'o', '', ''].map((h, k) => <span key={k} className={c.bitHead}>{h}</span>)}
              {BITS.map(([b, ch, sp]) => (
                <button type="button" key={b} className={cx(c.bit, sp && c.bitSp)} aria-pressed={!!(selNode.mode & b)} onClick={() => chmod(selNode.path, selNode.mode ^ b)} title={b.toString(8)}>{ch}</button>
              ))}
            </div>
            <div className={s.bar} style={{ marginBottom: 0 }}>
              <label className={s.lbl}>chmod <input type="text" inputMode="numeric" aria-label="octal mode" key={`${selNode.path}-${selNode.mode}`} defaultValue={octal(selNode.mode)} style={{ width: 64 }}
                onBlur={(e) => { const v = parseInt(e.target.value, 8); if (Number.isFinite(v)) chmod(selNode.path, v); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { const v = parseInt((e.target as HTMLInputElement).value, 8); if (Number.isFinite(v)) chmod(selNode.path, v); } }} /></label>
              <label className={s.lbl}>{t('owner', 'chủ')} <select value={selNode.uid} onChange={(e) => chown(selNode.path, { uid: Number(e.target.value) })}>{USERS.map((u) => <option key={u.uid} value={u.uid}>{u.name}</option>)}</select></label>
              <label className={s.lbl}>{t('group', 'nhóm')} <select value={selNode.gid} onChange={(e) => chown(selNode.path, { gid: Number(e.target.value) })}>{[0, 1001, 1002, 2000, 33].map((g) => <option key={g} value={g}>{gname(g)}</option>)}</select></label>
            </div>
            {selNode.acl && (
              <div className={s.term} style={{ minHeight: 0, marginTop: 6 }}>
                <span className={s.pr}>$ </span>getfacl -p {selNode.path}{'\n'}user::{permStr((selNode.mode >> 6) & 7)}{'\n'}
                {selNode.acl.users.map((e) => `user:${uname(e.uid)}:${permStr(e.perm)}${(e.perm & selNode.acl!.mask) !== e.perm ? `\t#effective:${permStr(e.perm & selNode.acl!.mask)}` : ''}\n`).join('')}
                group::{permStr(selNode.acl.groupObj)}{'\n'}mask::{permStr(selNode.acl.mask)}{'\n'}other::{permStr(selNode.mode & 7)}
              </div>
            )}
            <div className={s.small} style={{ marginTop: 6 }}>{t(`r = ${R}, w = ${W}, x = ${X}. On a directory: r = read the names, w = add/remove names, x = enter / look things up. With an ACL, the group bits of chmod set the MASK.`, `r = ${R}, w = ${W}, x = ${X}. Trên thư mục: r = đọc tên, w = thêm/bớt tên, x = đi vào / tra cứu. Có ACL thì bit nhóm của chmod đặt MASK.`)}</div>
          </div>
          <WhereBox focus="permission" lang={lang} height={200} />
        </div>
      </div>
    </Frame>
  );
}
