/**
 * Phòng quyền "user X làm được Y không?" — engine thuần cho mô phỏng `perm` (Chương 9, bài 9.6–9.7).
 *
 * Mô phỏng đúng thứ tự kiểm của Linux (fs/namei.c generic_permission + acl_permission_check + capable_wrt_inode_uidgid):
 *   1. Đi từng thư mục trên đường dẫn: mỗi thư mục cần quyền x (tìm kiếm) — thiếu ⇒ EACCES ngay tại đó.
 *   2. Phép kiểm DAC trên đích: là CHỦ? ⇒ CHỈ xét bit chủ (dừng, kể cả khi nhóm/other rộng hơn)
 *      → [ACL: mục user:tên ∧ mask] → thuộc NHÓM (chính hoặc phụ, + mục group ACL ∧ mask)? ⇒ chỉ xét bit nhóm (dừng)
 *      → other.
 *   3. DAC từ chối ⇒ hỏi capability: CAP_DAC_OVERRIDE (đọc/ghi mọi thứ; THỰC THI tệp chỉ khi có ít nhất một bit x),
 *      CAP_DAC_READ_SEARCH (đọc tệp, đọc+tìm thư mục).
 *   4. Xoá/tạo tên = ghi vào THƯ MỤC (w + x trên thư mục cha, quyền của tệp không liên quan). Thư mục có sticky bit:
 *      chỉ chủ tệp, chủ thư mục hoặc CAP_FOWNER được xoá ⇒ người khác nhận EPERM ("Operation not permitted").
 *   5. Tạo tệp: mode = 0666 & ~umask (thư mục 0777); thư mục cha có setgid ⇒ nhóm của tệp mới = nhóm thư mục;
 *      thư mục cha có ACL mặc định ⇒ tệp mới thừa hưởng ACL (umask bị bỏ qua).
 *   6. Chạy chương trình setuid ⇒ euid = chủ tệp chương trình.
 * Mọi tình huống preset khớp output thật lab/out/c96-quyen + c97-cap.
 */

export type Op = 'read' | 'write' | 'exec' | 'list' | 'delete' | 'create';
export type Cap = 'CAP_DAC_OVERRIDE' | 'CAP_DAC_READ_SEARCH' | 'CAP_FOWNER';
export const R = 4, W = 2, X = 1;
export const S_ISUID = 0o4000, S_ISGID = 0o2000, S_ISVTX = 0o1000;

export interface User { name: string; uid: number; gid: number; groups: number[]; caps: Cap[] }
export interface Acl { users: Array<{ uid: number; perm: number }>; groups: Array<{ gid: number; perm: number }>; groupObj: number; mask: number }
export interface Node { path: string; type: 'f' | 'd'; mode: number; uid: number; gid: number; acl?: Acl; defAcl?: Acl; text?: string }
export interface World { nodes: Node[]; umask: number }

export const GROUPS: Record<number, string> = { 0: 'root', 1001: 'dev', 1002: 'bob', 2000: 'team', 33: 'www-data', 101: 'nginx' };
export const USERS: User[] = [
  { name: 'dev', uid: 1001, gid: 1001, groups: [1001, 2000], caps: [] },
  { name: 'bob', uid: 1002, gid: 1002, groups: [1002, 2000], caps: [] },
  { name: 'www-data', uid: 33, gid: 33, groups: [33], caps: [] },
  // root trong container Docker: CapEff 00000000a80425fb — có DAC_OVERRIDE, FOWNER; KHÔNG có DAC_READ_SEARCH (c97-cap)
  { name: 'root', uid: 0, gid: 0, groups: [0], caps: ['CAP_DAC_OVERRIDE', 'CAP_FOWNER'] },
];
export const uname = (uid: number) => USERS.find((u) => u.uid === uid)?.name ?? String(uid);
export const gname = (gid: number) => GROUPS[gid] ?? String(gid);

/** -rwxr-sr-t … đúng kiểu ls -l (kèm dấu + khi có ACL). */
export function modeStr(n: Pick<Node, 'type' | 'mode' | 'acl'>): string {
  const m = n.mode;
  const tri = (v: number, sp: boolean, ch: string) => `${v & R ? 'r' : '-'}${v & W ? 'w' : '-'}${sp ? (v & X ? ch : ch.toUpperCase()) : v & X ? 'x' : '-'}`;
  return (n.type === 'd' ? 'd' : '-') + tri((m >> 6) & 7, !!(m & S_ISUID), 's') + tri((m >> 3) & 7, !!(m & S_ISGID), 's') + tri(m & 7, !!(m & S_ISVTX), 't') + (n.acl ? '+' : '');
}
export const octal = (m: number) => (m & 0o7000 ? m.toString(8).padStart(4, '0') : (m & 0o777).toString(8).padStart(3, '0'));
export const permStr = (v: number) => `${v & R ? 'r' : '-'}${v & W ? 'w' : '-'}${v & X ? 'x' : '-'}`;
const want = (b: number) => [b & R && 'r', b & W && 'w', b & X && 'x'].filter(Boolean).join('+');

export interface Check { rule: string; on: string; res: 'pass' | 'fail' | 'skip' | 'info'; decide?: boolean; en: string; vi: string }
export interface Verdict {
  ok: boolean; errno: '' | 'EACCES' | 'EPERM' | 'ENOENT'; checks: Check[]; euid: number;
  /** tệp mới tạo (op create) */
  created?: Node; partial?: boolean;
  shell: { cmd: string; out: string };
}

const dirOf = (p: string) => (p.lastIndexOf('/') <= 0 ? '/' : p.slice(0, p.lastIndexOf('/')));
const baseOf = (p: string) => p.slice(p.lastIndexOf('/') + 1);
export const nodeAt = (w: World, p: string) => w.nodes.find((n) => n.path === p);

/** Một phép kiểm quyền DAC + capability trên một nút; ghi từng bước vào `out`. */
export function permission(n: Node, u: User, euid: number, bits: number, out0: Check[], purpose: [string, string], brief = false): boolean {
  const on = n.path;
  // brief (đi qua thư mục tổ tiên): chỉ giữ dòng QUYẾT ĐỊNH, bỏ các dòng "không phải chủ / không thuộc nhóm"
  const out: Check[] = brief ? { push: (k: Check) => { if (k.res !== 'skip') out0.push(k); return 0; } } as unknown as Check[] : out0;
  const tag = (en: string, vi: string) => [`${purpose[0]}: ${en}`, `${purpose[1]}: ${vi}`] as const;
  let dac: boolean | null = null;
  // 1. chủ
  if (euid === n.uid) {
    const ob = (n.mode >> 6) & 7;
    dac = (ob & bits) === bits;
    const [en, vi] = tag(`you ARE the owner (uid ${euid}) ⇒ only the owner bits count: ${permStr(ob)} — need ${want(bits)} ⇒ ${dac ? 'yes' : 'NO'}. Group and other bits are not even looked at.`,
      `bạn LÀ chủ (uid ${euid}) ⇒ chỉ xét bit của chủ: ${permStr(ob)} — cần ${want(bits)} ⇒ ${dac ? 'có' : 'KHÔNG'}. Bit nhóm và other không hề được nhìn tới.`);
    out.push({ rule: 'owner', on, res: dac ? 'pass' : 'fail', decide: true, en, vi });
  } else {
    out.push({ rule: 'owner', on, res: 'skip', en: `${purpose[0]}: owner is ${uname(n.uid)} (uid ${n.uid}), you are uid ${euid} ⇒ not the owner.`, vi: `${purpose[1]}: chủ là ${uname(n.uid)} (uid ${n.uid}), bạn là uid ${euid} ⇒ không phải chủ.` });
    // 2. ACL: mục user có tên
    const named = n.acl?.users.find((e) => e.uid === euid);
    if (n.acl && named) {
      const eff = named.perm & n.acl.mask;
      dac = (eff & bits) === bits;
      const [en, vi] = tag(`ACL entry user:${uname(euid)}:${permStr(named.perm)} — but it is ANDed with the mask ${permStr(n.acl.mask)} ⇒ effective ${permStr(eff)} — need ${want(bits)} ⇒ ${dac ? 'yes' : 'NO'}.${eff !== named.perm ? ' (getfacl shows "#effective:' + permStr(eff) + '")' : ''}`,
        `mục ACL user:${uname(euid)}:${permStr(named.perm)} — nhưng phải AND với mask ${permStr(n.acl.mask)} ⇒ hiệu lực ${permStr(eff)} — cần ${want(bits)} ⇒ ${dac ? 'có' : 'KHÔNG'}.${eff !== named.perm ? ' (getfacl hiện "#effective:' + permStr(eff) + '")' : ''}`);
      out.push({ rule: 'acl-user', on, res: dac ? 'pass' : 'fail', decide: true, en, vi });
    } else {
      // 3. nhóm
      const inGroup = u.groups.includes(n.gid);
      const gEntries = n.acl ? n.acl.groups.filter((e) => u.groups.includes(e.gid)) : [];
      if (inGroup || gEntries.length) {
        const gb = n.acl ? n.acl.groupObj & n.acl.mask : (n.mode >> 3) & 7;
        const cands = [...(inGroup ? [gb] : []), ...gEntries.map((e) => e.perm & (n.acl?.mask ?? 7))];
        dac = cands.some((v) => (v & bits) === bits);
        const which = inGroup ? `group ${gname(n.gid)} (you are in it: ${u.groups.map(gname).join(', ')})` : `ACL group entr${gEntries.length > 1 ? 'ies' : 'y'}`;
        const whichVi = inGroup ? `nhóm ${gname(n.gid)} (bạn thuộc nhóm này: ${u.groups.map(gname).join(', ')})` : `mục ACL nhóm`;
        const [en, vi] = tag(`${which} ⇒ only the group bits count: ${cands.map(permStr).join(' / ')} — need ${want(bits)} ⇒ ${dac ? 'yes' : 'NO'}. Other bits are skipped even if they are wider.`,
          `${whichVi} ⇒ chỉ xét bit nhóm: ${cands.map(permStr).join(' / ')} — cần ${want(bits)} ⇒ ${dac ? 'có' : 'KHÔNG'}. Bit other bị bỏ qua dù có rộng hơn.`);
        out.push({ rule: 'group', on, res: dac ? 'pass' : 'fail', decide: true, en, vi });
      } else {
        out.push({ rule: 'group', on, res: 'skip', en: `${purpose[0]}: group is ${gname(n.gid)}; you are in ${u.groups.map(gname).join(', ')} ⇒ not in the group.`, vi: `${purpose[1]}: nhóm là ${gname(n.gid)}; bạn thuộc ${u.groups.map(gname).join(', ')} ⇒ không thuộc nhóm.` });
        const ob = n.mode & 7;
        dac = (ob & bits) === bits;
        const [en, vi] = tag(`so you are "other": ${permStr(ob)} — need ${want(bits)} ⇒ ${dac ? 'yes' : 'NO'}.`, `vậy bạn là "other": ${permStr(ob)} — cần ${want(bits)} ⇒ ${dac ? 'có' : 'KHÔNG'}.`);
        out.push({ rule: 'other', on, res: dac ? 'pass' : 'fail', decide: true, en, vi });
      }
    }
  }
  if (dac) return true;
  // 4. capability
  const anyX = n.type === 'd' || (n.mode & 0o111) !== 0;
  if (u.caps.includes('CAP_DAC_OVERRIDE') && euid === u.uid) {
    const ok = !(bits & X) || anyX;
    const [en, vi] = tag(ok ? `the mode bits said no, but the process has CAP_DAC_OVERRIDE ⇒ allowed anyway. This is why root can read a file with mode 000.`
      : `CAP_DAC_OVERRIDE can override read and write, but it may only EXECUTE a file that has at least one x bit. This file has none ⇒ still no — even for root.`,
      ok ? `bit quyền nói không, nhưng tiến trình có CAP_DAC_OVERRIDE ⇒ vẫn được. Vì thế root đọc được tệp mode 000.`
        : `CAP_DAC_OVERRIDE vượt được quyền đọc và ghi, nhưng chỉ được THỰC THI tệp có ít nhất một bit x. Tệp này không có bit nào ⇒ vẫn không — kể cả root.`);
    out.push({ rule: 'cap', on, res: ok ? 'pass' : 'fail', decide: true, en, vi });
    return ok;
  }
  if (u.caps.includes('CAP_DAC_READ_SEARCH') && euid === u.uid && !(bits & W) && (n.type === 'd' || !(bits & X))) {
    out.push({ rule: 'cap', on, res: 'pass', decide: true, en: `${purpose[0]}: CAP_DAC_READ_SEARCH lets it read and search anyway.`, vi: `${purpose[1]}: CAP_DAC_READ_SEARCH cho phép đọc và tìm kiếm.` });
    return true;
  }
  if (euid === 0 || u.uid === 0) {
    out.push({ rule: 'cap', on, res: 'fail', decide: true, en: `${purpose[0]}: uid 0 but WITHOUT CAP_DAC_OVERRIDE (dropped with capsh --drop / --cap-drop) ⇒ root is refused like anyone else. Root's power is just a set of capabilities.`, vi: `${purpose[1]}: uid 0 nhưng KHÔNG có CAP_DAC_OVERRIDE (đã bỏ bằng capsh --drop / --cap-drop) ⇒ root bị từ chối như mọi người. Quyền lực của root chỉ là một bộ capability.` });
  } else {
    out.push({ rule: 'cap', on, res: 'skip', en: `${purpose[0]}: no capability that could override (CapEff = 0 for a normal user).`, vi: `${purpose[1]}: không có capability nào vượt được (người dùng thường có CapEff = 0).` });
  }
  return false;
}

export interface Ask { who: string; op: Op; path: string; via?: string; /** root với --cap-drop / capsh --drop=cap_dac_override */ capsDrop?: boolean }

export function ask(w: World, q: Ask): Verdict {
  const u0 = USERS.find((x) => x.name === q.who) ?? USERS[0];
  const u: User = q.capsDrop && u0.uid === 0 ? { ...u0, caps: u0.caps.filter((c) => c !== 'CAP_DAC_OVERRIDE') } : u0;
  const checks: Check[] = [];
  let euid = u.uid;
  // chương trình setuid
  if (q.via) {
    const prog = nodeAt(w, q.via);
    if (prog && prog.mode & S_ISUID) {
      euid = prog.uid;
      checks.push({ rule: 'setuid', on: prog.path, res: 'info', en: `${prog.path} is ${modeStr(prog)} — the "s" in the owner slot is the setuid bit: whoever runs it gets euid = the FILE OWNER (${uname(prog.uid)}, ${prog.uid}). real uid stays ${u.uid}.`, vi: `${prog.path} là ${modeStr(prog)} — chữ "s" ở ô của chủ là bit setuid: ai chạy nó cũng mang euid = CHỦ TỆP (${uname(prog.uid)}, ${prog.uid}). real uid vẫn là ${u.uid}.` });
    } else if (prog) {
      checks.push({ rule: 'setuid', on: prog.path, res: 'info', en: `${prog.path} has no setuid bit ⇒ it runs with your own uid ${u.uid}.`, vi: `${prog.path} không có bit setuid ⇒ nó chạy với uid của chính bạn ${u.uid}.` });
    }
  }
  const asUser: User = euid === u.uid ? u : { ...u, uid: euid, gid: u.gid, caps: euid === 0 ? ['CAP_DAC_OVERRIDE', 'CAP_FOWNER'] : u.caps };
  const target = q.op === 'create' ? `${q.path}/new.txt` : q.path;
  const parent = q.op === 'create' ? q.path : dirOf(q.path);
  const node = nodeAt(w, q.path);
  const shell = shellFor(q, u, euid);
  // 1. đường dẫn: x trên từng thư mục tổ tiên
  const comps: string[] = [];
  const stopAt = q.op === 'create' ? q.path : dirOf(q.path);
  for (let p = stopAt; ; p = dirOf(p)) { comps.unshift(p); if (p === '/') break; }
  for (const d of comps) {
    const dn = nodeAt(w, d);
    if (!dn) continue;
    const ok = permission(dn, asUser, euid, X, checks, [`walk ${d}`, `đi qua ${d}`], true);
    if (!ok) return { ok: false, errno: 'EACCES', checks, euid, shell: { cmd: shell.cmd, out: shell.deny('Permission denied') } };
  }
  if (!node && q.op !== 'create') return { ok: false, errno: 'ENOENT', checks, euid, shell: { cmd: shell.cmd, out: shell.deny('No such file or directory') } };

  if (q.op === 'read' || q.op === 'write' || q.op === 'exec') {
    const bits = q.op === 'read' ? R : q.op === 'write' ? W : X;
    if (q.op === 'exec' && node!.type === 'd') return { ok: false, errno: 'EACCES', checks, euid, shell: { cmd: shell.cmd, out: shell.deny('Is a directory') } };
    const ok = permission(node!, asUser, euid, bits, checks, [`${q.op} ${baseOf(q.path)}`, `${q.op === 'read' ? 'đọc' : q.op === 'write' ? 'ghi' : 'chạy'} ${baseOf(q.path)}`]);
    return { ok, errno: ok ? '' : 'EACCES', checks, euid, shell: { cmd: shell.cmd, out: ok ? shell.ok(node!) : shell.deny('Permission denied') } };
  }
  if (q.op === 'list') {
    const okR = permission(node!, asUser, euid, R, checks, [`read the names in ${q.path}`, `đọc các tên trong ${q.path}`]);
    if (!okR) return { ok: false, errno: 'EACCES', checks, euid, shell: { cmd: shell.cmd, out: `ls: cannot open directory '${q.path}': Permission denied` } };
    const kids = w.nodes.filter((n) => dirOf(n.path) === q.path && n.path !== q.path);
    const okX = permission(node!, asUser, euid, X, checks, [`look up each entry (stat)`, `tra từng mục (stat)`]);
    if (!okX) {
      checks.push({ rule: 'partial', on: q.path, res: 'info', decide: true, en: 'r without x on a directory: you may read the NAMES (the directory is a table name → inode) but not look inside the inodes ⇒ ls prints ????????? for everything else.', vi: 'có r mà không có x trên thư mục: bạn đọc được TÊN (thư mục là bảng tên → inode) nhưng không được nhìn vào inode ⇒ ls in ????????? cho mọi thứ khác.' });
      return { ok: true, partial: true, errno: '', checks, euid, shell: { cmd: shell.cmd, out: `total 0\n${kids.map((k) => `-????????? ? ? ? ?            ? ${baseOf(k.path)}`).join('\n')}` } };
    }
    return { ok: true, errno: '', checks, euid, shell: { cmd: shell.cmd, out: kids.map((k) => `${modeStr(k)} 1 ${uname(k.uid)} ${gname(k.gid)} ${baseOf(k.path)}`).join('\n') || '(empty)' } };
  }
  // delete / create: ghi vào THƯ MỤC cha
  const pn = nodeAt(w, parent)!;
  const okDir = permission(pn, asUser, euid, W | X, checks, [`write the directory ${parent}`, `ghi vào thư mục ${parent}`]);
  if (!okDir) return { ok: false, errno: 'EACCES', checks, euid, shell: { cmd: shell.cmd, out: shell.deny('Permission denied') } };
  if (q.op === 'delete') {
    if (node && node.uid !== euid && q.op === 'delete') {
      checks.push({ rule: 'file-bits', on: q.path, res: 'info', en: `Note: the FILE's own mode (${modeStr(node)}) plays no part — deleting removes a name from the directory, so only the directory's w+x matter.`, vi: `Để ý: mode của chính TỆP (${modeStr(node)}) không liên quan — xoá là gỡ một tên khỏi thư mục, nên chỉ w+x của thư mục mới tính.` });
    }
    if (pn.mode & S_ISVTX) {
      const own = node!.uid === euid, ownDir = pn.uid === euid, fowner = asUser.caps.includes('CAP_FOWNER');
      const ok = own || ownDir || fowner;
      checks.push({ rule: 'sticky', on: parent, res: ok ? 'pass' : 'fail', decide: true,
        en: `${parent} has the STICKY bit (the "t" in ${modeStr(pn)}): in a shared directory you may only delete files you own (or if you own the directory, or have CAP_FOWNER). File owner: ${uname(node!.uid)} ⇒ ${ok ? 'allowed' : 'EPERM'}.`,
        vi: `${parent} có bit STICKY (chữ "t" trong ${modeStr(pn)}): trong thư mục dùng chung bạn chỉ được xoá tệp của mình (hoặc khi là chủ thư mục, hoặc có CAP_FOWNER). Chủ tệp: ${uname(node!.uid)} ⇒ ${ok ? 'được' : 'EPERM'}.` });
      if (!ok) return { ok: false, errno: 'EPERM', checks, euid, shell: { cmd: shell.cmd, out: shell.deny('Operation not permitted') } };
    }
    return { ok: true, errno: '', checks, euid, shell: { cmd: shell.cmd, out: '' } };
  }
  // create
  const def = pn.defAcl;
  const base = 0o666;
  const mode = def ? (base & 0o606) | ((def.mask & 7) << 3) : base & ~w.umask & 0o777;
  const gid = pn.mode & S_ISGID ? pn.gid : u.gid;
  const created: Node = { path: target, type: 'f', mode, uid: euid, gid, ...(def ? { acl: { users: def.users.map((e) => ({ ...e })), groups: def.groups.map((e) => ({ ...e })), groupObj: def.groupObj, mask: def.mask } } : {}) };
  checks.push({ rule: 'umask', on: target, res: 'info', decide: true,
    en: def ? `The directory has a DEFAULT ACL, so the new file inherits it (${def.users.map((e) => `user:${uname(e.uid)}:${permStr(e.perm)}`).join(', ')}, mask ${permStr(def.mask)}) and the umask is ignored.`
      : `New file mode = 0666 & ~umask(${w.umask.toString(8).padStart(4, '0')}) = ${octal(mode)} (${modeStr(created).slice(1)}). Programs ask for 0666, the umask takes bits away — Node's writeFileSync(…, { mode: 0o666 }) also ends up ${octal(base & ~w.umask & 0o777)}.`,
    vi: def ? `Thư mục có ACL MẶC ĐỊNH nên tệp mới thừa hưởng nó (${def.users.map((e) => `user:${uname(e.uid)}:${permStr(e.perm)}`).join(', ')}, mask ${permStr(def.mask)}) và umask bị bỏ qua.`
      : `Mode tệp mới = 0666 & ~umask(${w.umask.toString(8).padStart(4, '0')}) = ${octal(mode)} (${modeStr(created).slice(1)}). Chương trình xin 0666, umask lấy bớt bit đi — writeFileSync(…, { mode: 0o666 }) của Node cũng ra ${octal(base & ~w.umask & 0o777)}.` });
  checks.push({ rule: 'setgid', on: parent, res: 'info', decide: true,
    en: pn.mode & S_ISGID ? `${parent} has the SETGID bit (the "s" in the group slot: ${modeStr(pn)}) ⇒ the new file belongs to group ${gname(pn.gid)}, not to ${u.name}'s own group — so the whole team can use it.`
      : `No setgid bit on ${parent} ⇒ the new file gets ${u.name}'s primary group (${gname(u.gid)}).`,
    vi: pn.mode & S_ISGID ? `${parent} có bit SETGID (chữ "s" ở ô nhóm: ${modeStr(pn)}) ⇒ tệp mới thuộc nhóm ${gname(pn.gid)}, không phải nhóm riêng của ${u.name} — cả đội dùng chung được.`
      : `${parent} không có bit setgid ⇒ tệp mới mang nhóm chính của ${u.name} (${gname(u.gid)}).` });
  return { ok: true, errno: '', checks, euid, created, shell: { cmd: shell.cmd, out: `${modeStr(created)} 1 ${uname(euid)} ${gname(gid)} 0 new.txt` } };
}

function shellFor(q: Ask, u: User, euid: number) {
  const run = q.via ? `runuser -u ${u.name} -- ${q.via} ` : u.name === 'root' ? '' : `runuser -u ${u.name} -- `;
  const cmd = q.op === 'read' ? `${run}cat ${q.path}` : q.op === 'write' ? `${run}sh -c 'echo x >> ${q.path}'` : q.op === 'exec' ? `${run}env ${q.path}`
    : q.op === 'list' ? `${run}ls -l ${q.path}` : q.op === 'delete' ? `${run}rm -f ${q.path}` : `${run}touch ${q.path}/new.txt; ls -l ${q.path}/new.txt`;
  const deny = (msg: string) => q.op === 'read' ? (q.via ? `open ${q.path}: ${msg}` : `cat: ${q.path}: ${msg}`) : q.op === 'write' ? `sh: 1: cannot create ${q.path}: ${msg}` : q.op === 'exec' ? `env: '${q.path}': ${msg}`
    : q.op === 'delete' ? `rm: cannot remove '${q.path}': ${msg}` : q.op === 'create' ? `touch: cannot touch '${q.path}/new.txt': ${msg}` : `ls: cannot open directory '${q.path}': ${msg}`;
  const ok = (n: Node) => q.op === 'read' ? (q.via ? `real uid=${u.uid}  effective uid=${euid}\nopen ${q.path}: OK` : n.text ?? '(contents)') : q.op === 'exec' ? (n.text ?? 'deploy') : '';
  return { cmd: `$ ${cmd}`, deny, ok };
}

// ───────────────────────── thế giới mẫu (đúng c96/c97) ─────────────────────────
const f = (path: string, mode: number, uid: number, gid: number, text?: string, extra: Partial<Node> = {}): Node => ({ path, type: 'f', mode, uid, gid, text, ...extra });
const d = (path: string, mode: number, uid: number, gid: number, extra: Partial<Node> = {}): Node => ({ path, type: 'd', mode, uid, gid, ...extra });

export function baseWorld(): World {
  return {
    umask: 0o022,
    nodes: [
      d('/', 0o755, 0, 0),
      d('/tmp', 0o1777, 0, 0),
      f('/tmp/own.txt', 0o077, 1001, 1001, 'hello'),
      f('/tmp/bob-session', 0o644, 1002, 1002, ''),
      d('/srv', 0o755, 0, 0),
      d('/srv/app', 0o755, 0, 0),
      f('/srv/app/.env', 0o600, 0, 0, 'DB_PASSWORD=s3cret'),
      f('/srv/app/dev-notes.txt', 0o644, 1001, 0, ''),
      f('/srv/app/deploy.sh', 0o644, 0, 0, 'deploy'),
      d('/srv/app/uploads', 0o710, 1001, 1001, { acl: { users: [{ uid: 33, perm: X }], groups: [], groupObj: 0, mask: X } }),
      f('/srv/app/uploads/a.jpg', 0o640, 1001, 1001, 'jpeg bytes', { acl: { users: [{ uid: 33, perm: R }], groups: [], groupObj: 0, mask: R } }),
      d('/srv/box', 0o744, 0, 0),
      f('/srv/box/q3.txt', 0o644, 0, 0, 'report'),
      d('/srv/drop', 0o777, 0, 0),
      f('/srv/drop/bob-session', 0o644, 1002, 1002, ''),
      d('/srv/team', 0o2775, 0, 2000),
      d('/srv/devdir', 0o755, 1001, 1001),
      f('/srv/devdir/owned-by-root', 0o444, 0, 0, ''),
      f('/usr/local/bin/ids', 0o4755, 0, 0, 'ids'),
    ],
  };
}

export interface PermPreset { world: (w: World) => World; ask: Ask; en: string; vi: string }
const setMode = (w: World, p: string, mode: number): World => ({ ...w, nodes: w.nodes.map((n) => (n.path === p ? withMode(n, mode) : n)) });

/** chmod: với tệp có ACL, bit nhóm của chmod đặt MASK (bẫy "chmod 600 ⇒ #effective:---"). */
export function withMode(n: Node, mode: number): Node {
  if (!n.acl) return { ...n, mode };
  return { ...n, mode, acl: { ...n.acl, mask: (mode >> 3) & 7 } };
}

export const PERM_PRESETS: Record<string, PermPreset> = {
  owner: { world: (w) => w, ask: { who: 'dev', op: 'read', path: '/tmp/own.txt' },
    en: '/tmp/own.txt is ----rwxrwx (077) and belongs to dev. Can dev read it? Can bob?', vi: '/tmp/own.txt là ----rwxrwx (077) và thuộc về dev. dev đọc được không? bob thì sao?' },
  dirx: { world: (w) => w, ask: { who: 'dev', op: 'list', path: '/srv/box' },
    en: '/srv/box is drwxr--r-- (744). dev may read the names… but can dev see inside? Then try 711.', vi: '/srv/box là drwxr--r-- (744). dev đọc được tên… nhưng có nhìn được vào trong không? Rồi thử 711.' },
  sticky: { world: (w) => w, ask: { who: 'dev', op: 'delete', path: '/tmp/bob-session' },
    en: 'Everyone may write /tmp (drwxrwxrwt). Can dev delete bob\'s file there? And in /srv/drop (777, no sticky)?', vi: 'Ai cũng ghi được /tmp (drwxrwxrwt). dev xoá được tệp của bob ở đó không? Còn ở /srv/drop (777, không sticky)?' },
  setgid: { world: (w) => w, ask: { who: 'dev', op: 'create', path: '/srv/team' },
    en: 'dev creates a file in /srv/team (drwxrwsr-x, group team). Which group does it get, and which mode with umask 022?', vi: 'dev tạo một tệp trong /srv/team (drwxrwsr-x, nhóm team). Tệp mang nhóm nào, mode gì với umask 022?' },
  setuid: { world: (w) => w, ask: { who: 'dev', op: 'read', path: '/srv/app/.env', via: '/usr/local/bin/ids' },
    en: '.env is -rw------- root. dev cannot read it — but /usr/local/bin/ids is setuid root (rwsr-xr-x). What does ids see?', vi: '.env là -rw------- của root. dev không đọc được — nhưng /usr/local/bin/ids là setuid root (rwsr-xr-x). ids thấy gì?' },
  caps: { world: (w) => setMode(w, '/srv/app/.env', 0o000), ask: { who: 'root', op: 'read', path: '/srv/app/.env' },
    en: 'chmod 000 .env — root still reads it. Then try to run deploy.sh (644) as root, and drop CAP_DAC_OVERRIDE.', vi: 'chmod 000 .env — root vẫn đọc được. Rồi thử chạy deploy.sh (644) bằng root, và bỏ CAP_DAC_OVERRIDE.' },
  acl: { world: (w) => w, ask: { who: 'www-data', op: 'read', path: '/srv/app/uploads/a.jpg' },
    en: 'uploads/ is dev\'s private folder, but an ACL gives www-data x on the folder and r on a.jpg. Then: chmod 600 a.jpg — the mask trap.', vi: 'uploads/ là thư mục riêng của dev, nhưng một ACL cho www-data x trên thư mục và r trên a.jpg. Rồi: chmod 600 a.jpg — cái bẫy mask.' },
};
