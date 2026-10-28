/**
 * Tên → inode → mô tả file mở → bảng fd — engine thuần cho mô phỏng `fdtable` (Chương 9, bài 9.1–9.2; dùng lại cho Ch2).
 *
 * Ba tầng của nhân:
 *   • bảng fd của TỪNG tiến trình: số nguyên nhỏ (0, 1, 2, 3…) → con trỏ tới một mô tả file mở;
 *   • mô tả file mở (open file description, "struct file"): offset hiện tại + cờ (O_APPEND, O_CLOEXEC…) + số tham chiếu;
 *     open() lần nữa tạo mô tả MỚI (offset riêng), còn dup()/fork() chia sẻ CÙNG mô tả (offset chung);
 *   • inode: dữ liệu + số liên kết (số tên trỏ tới) — chỉ được giải phóng khi link count = 0 VÀ không còn mô tả nào mở nó.
 * Thư mục chỉ là bảng tên → số inode.
 * Mọi preset khớp output thật: lab/out/c92-fd (ofd.c twice/dup/append/fork, 2>&1 > f vs > f 2>&1, O_CLOEXEC),
 * c91-inode (ln, ln -s, rm, EXDEV, số inode 14 được dùng lại), c104-fd (RLIMIT_NOFILE 1024 ⇒ EMFILE), c24/Ch2 (rm khi còn mở).
 */

export interface Inode { ino: number; kind: 'file' | 'tty' | 'symlink' | 'socket'; data: string; size: number; links: number; target?: string }
export interface Ofd { id: number; ino: number; pos: number; append: boolean; cloexec: boolean; refs: number }
export interface Proc { pid: number; name: string; fds: Array<[number, number]> }
export interface Dentry { name: string; ino: number }
export interface FdState {
  dentries: Dentry[]; inodes: Inode[]; ofds: Ofd[]; procs: Proc[];
  soft: number; hard: number; nextIno: number; nextOfd: number;
  /** inode đã giải phóng — được cấp lại trước (ext4 dùng lại số nhỏ: 14 → 14) */
  free: number[];
  term: string[];
  last: { cmd: string; en: string; vi: string; tone?: 'ok' | 'bad' | 'warn'; hot: { pid?: number; fd?: number; ofd?: number; ino?: number; name?: string }; err?: string };
}

export type FdOp =
  | { op: 'open'; pid: number; path: string; append?: boolean; cloexec?: boolean; creat?: boolean; trunc?: boolean; label?: string }
  | { op: 'dup'; pid: number; fd: number }
  | { op: 'dup2'; pid: number; from: number; to: number }
  | { op: 'fork'; pid: number; child: number; name?: string }
  | { op: 'write'; pid: number; fd: number; text: string; bytes?: number }
  | { op: 'close'; pid: number; fd: number }
  | { op: 'rm'; name: string }
  | { op: 'ln'; from: string; to: string }
  | { op: 'symlink'; target: string; name: string }
  | { op: 'mvx'; name: string }
  | { op: 'cat'; name: string }
  | { op: 'exec'; pid: number; prog: string }
  | { op: 'leak'; pid: number; n: number }
  | { op: 'ulimit'; soft: number }
  | { op: 'note'; en: string; vi: string };

const TTY = 1;
const clone = (s: FdState): FdState => ({
  ...s, dentries: s.dentries.map((d) => ({ ...d })), inodes: s.inodes.map((i) => ({ ...i })), ofds: s.ofds.map((o) => ({ ...o })), free: [...s.free],
  procs: s.procs.map((p) => ({ ...p, fds: p.fds.map((f) => [...f] as [number, number]) })), term: [...s.term], last: { ...s.last, hot: {}, err: undefined, tone: undefined },
});

export function initFd(opts: { nextIno?: number; files?: Array<[string, number, string]>; pid?: number; name?: string; soft?: number } = {}): FdState {
  const inodes: Inode[] = [{ ino: TTY, kind: 'tty', data: '', size: 0, links: 1 }];
  const dentries: Dentry[] = [];
  for (const [name, ino, data] of opts.files ?? []) { inodes.push({ ino, kind: 'file', data, size: data.length, links: 1 }); dentries.push({ name, ino }); }
  return {
    dentries, inodes, ofds: [{ id: 1, ino: TTY, pos: 0, append: false, cloexec: false, refs: 3 }],
    procs: [{ pid: opts.pid ?? 100, name: opts.name ?? 'worker', fds: [[0, 1], [1, 1], [2, 1]] }],
    soft: opts.soft ?? 1024, hard: 1048576, nextIno: opts.nextIno ?? 12, nextOfd: 2, term: [], free: [],
    last: { cmd: '', en: 'A process starts with three fds — 0 stdin, 1 stdout, 2 stderr — all pointing at the terminal.', vi: 'Một tiến trình khởi đầu với ba fd — 0 stdin, 1 stdout, 2 stderr — đều trỏ vào terminal.', hot: {} },
  };
}

const proc = (s: FdState, pid: number) => s.procs.find((p) => p.pid === pid)!;
const fdGet = (p: Proc, fd: number) => p.fds.find(([k]) => k === fd)?.[1];
const lowestFree = (p: Proc) => { let k = 0; const used = new Set(p.fds.map(([f]) => f)); while (used.has(k)) k++; return k; };
const setFd = (p: Proc, fd: number, ofd: number) => { p.fds = [...p.fds.filter(([k]) => k !== fd), [fd, ofd] as [number, number]].sort((a, b) => a[0] - b[0]); };
export const openCount = (s: FdState, ino: number) => s.ofds.filter((o) => o.ino === ino).length;
export const namesOf = (s: FdState, ino: number) => s.dentries.filter((d) => d.ino === ino).map((d) => d.name);
export const inodeOf = (s: FdState, ino: number) => s.inodes.find((i) => i.ino === ino);
/** df đếm mọi inode còn sống (kể cả đã xoá tên mà còn mở); du chỉ đếm cái còn tên. */
export const dfBytes = (s: FdState) => s.inodes.filter((i) => i.kind === 'file').reduce((a, i) => a + i.size, 0);
export const duBytes = (s: FdState) => s.inodes.filter((i) => i.kind === 'file' && namesOf(s, i.ino).length).reduce((a, i) => a + i.size, 0);

/** Giải phóng inode nếu không còn tên lẫn mô tả mở. Trả true nếu đã giải phóng. */
function maybeFree(s: FdState, ino: number): boolean {
  const n = inodeOf(s, ino);
  if (!n || n.kind === 'tty') return false;
  if (n.links <= 0 && openCount(s, ino) === 0) { s.inodes = s.inodes.filter((i) => i.ino !== ino); if (n.kind !== 'socket') s.free.push(ino); return true; }
  return false;
}
function dropRef(s: FdState, ofdId: number): { freedOfd: boolean; freedIno: boolean; ino: number } {
  const o = s.ofds.find((x) => x.id === ofdId)!;
  o.refs--;
  if (o.refs > 0) return { freedOfd: false, freedIno: false, ino: o.ino };
  s.ofds = s.ofds.filter((x) => x.id !== ofdId);
  return { freedOfd: true, freedIno: maybeFree(s, o.ino), ino: o.ino };
}
function allocIno(s: FdState): number {
  if (s.free.length) { s.free.sort((a, b) => a - b); return s.free.shift()!; }
  return s.nextIno++;
}

export function apply(s0: FdState, op: FdOp): FdState {
  const s = clone(s0);
  const L = s.last;
  switch (op.op) {
    case 'note': L.en = op.en; L.vi = op.vi; return s;
    case 'ulimit': s.soft = op.soft; L.cmd = `ulimit -Sn ${op.soft}`; L.en = `Soft limit RLIMIT_NOFILE = ${op.soft} (hard ${s.hard}). Any process may raise its soft limit up to the hard limit — Node does that at start-up.`; L.vi = `Giới hạn mềm RLIMIT_NOFILE = ${op.soft} (cứng ${s.hard}). Tiến trình nào cũng được tự nâng giới hạn mềm lên tới mức cứng — Node làm việc đó khi khởi động.`; L.tone = 'ok'; return s;
    case 'open': {
      const p = proc(s, op.pid);
      const label = op.label ?? op.path;
      const flags = ['O_WRONLY', op.creat && 'O_CREAT', op.trunc && 'O_TRUNC', op.append && 'O_APPEND', op.cloexec && 'O_CLOEXEC'].filter(Boolean).join('|');
      L.cmd = `${p.name}[${p.pid}]: open("${label}", ${flags})`;
      if (p.fds.length >= s.soft) {
        L.err = 'EMFILE'; L.tone = 'bad'; L.hot = { pid: p.pid };
        L.en = `open() = -1 EMFILE (Too many open files): the table already holds ${p.fds.length} fds = the soft limit ${s.soft}. Nothing is wrong with the disk or the network — this process simply never closes what it opens.`;
        L.vi = `open() = -1 EMFILE (Too many open files): bảng đã có ${p.fds.length} fd = giới hạn mềm ${s.soft}. Đĩa hay mạng chẳng sao cả — tiến trình này đơn giản là mở mà không bao giờ đóng.`;
        s.term.push(`Error: EMFILE: too many open files, open '${label}'`);
        return s;
      }
      let d = s.dentries.find((x) => x.name === op.path);
      if (!d) {
        if (op.path.startsWith('socket')) {
          const ino = s.nextIno++;
          s.inodes.push({ ino, kind: 'socket', data: '', size: 0, links: 0 });
          d = { name: op.path, ino };
        } else if (op.creat) {
          const ino = allocIno(s);
          s.inodes.push({ ino, kind: 'file', data: '', size: 0, links: 1 });
          d = { name: op.path, ino }; s.dentries.push(d);
        } else {
          L.err = 'ENOENT'; L.tone = 'bad'; L.en = 'No such file or directory.'; L.vi = 'Không có tệp đó.'; return s;
        }
      }
      const ino = inodeOf(s, d.ino)!;
      if (op.trunc) { ino.data = ''; ino.size = 0; }
      const o: Ofd = { id: s.nextOfd++, ino: d.ino, pos: 0, append: !!op.append, cloexec: !!op.cloexec, refs: 1 };
      s.ofds.push(o);
      const fd = lowestFree(p);
      setFd(p, fd, o.id);
      L.hot = { pid: p.pid, fd, ofd: o.id, ino: d.ino, name: d.name };
      L.cmd += ` = ${fd}`;
      L.en = `open() creates a NEW open file description #${o.id} (offset 0${op.append ? ', O_APPEND' : ''}${op.cloexec ? ', O_CLOEXEC' : ''}) pointing at inode ${d.ino}, and puts it in the lowest free slot of ${p.name}'s fd table: fd ${fd}.`;
      L.vi = `open() tạo một mô tả file mở MỚI #${o.id} (offset 0${op.append ? ', O_APPEND' : ''}${op.cloexec ? ', O_CLOEXEC' : ''}) trỏ tới inode ${d.ino}, rồi đặt nó vào ô trống nhỏ nhất trong bảng fd của ${p.name}: fd ${fd}.`;
      return s;
    }
    case 'leak': {
      const p = proc(s, op.pid);
      let n = 0;
      while (n < op.n && p.fds.length < s.soft) {
        const ino = s.nextIno++;
        s.inodes.push({ ino, kind: 'socket', data: '', size: 0, links: 0 });
        const o: Ofd = { id: s.nextOfd++, ino, pos: 0, append: false, cloexec: false, refs: 1 };
        s.ofds.push(o); setFd(p, lowestFree(p), o.id); n++;
      }
      L.cmd = `× ${op.n} requests: accept4() … and forget to close()`;
      L.hot = { pid: p.pid };
      if (n < op.n) {
        L.err = 'EMFILE'; L.tone = 'bad';
        L.en = `After ${n} more sockets the table is full: ${p.fds.length}/${s.soft}. The next accept4() returns -1 EMFILE — epoll keeps reporting the listening socket as ready, so the server spins (9 359 failed accept4 per second in the lab) while clients hang.`;
        L.vi = `Thêm ${n} socket nữa thì bảng đầy: ${p.fds.length}/${s.soft}. Lần accept4() kế trả -1 EMFILE — epoll vẫn báo socket nghe là sẵn sàng, nên máy chủ quay tít (9 359 lần accept4 thất bại mỗi giây trong lab) còn khách thì treo.`;
        s.term.push('accept4(3, NULL, NULL, SOCK_NONBLOCK) = -1 EMFILE (Too many open files)');
      } else {
        L.tone = p.fds.length > s.soft * 0.8 ? 'warn' : undefined;
        L.en = `${n} connections handled, none closed: ${p.fds.length} of ${s.soft} fds in use. Each leaked socket is one row in the table and one open file description in the kernel.`;
        L.vi = `Đã xử lý ${n} kết nối, không đóng cái nào: ${p.fds.length} trên ${s.soft} fd đang dùng. Mỗi socket rò là một dòng trong bảng và một mô tả file mở trong nhân.`;
      }
      return s;
    }
    case 'dup': {
      const p = proc(s, op.pid);
      const of = fdGet(p, op.fd)!;
      const fd = lowestFree(p);
      setFd(p, fd, of);
      s.ofds.find((o) => o.id === of)!.refs++;
      L.cmd = `${p.name}[${p.pid}]: dup(${op.fd}) = ${fd}`; L.hot = { pid: p.pid, fd, ofd: of };
      L.en = `dup(${op.fd}) does NOT open the file again: fd ${fd} points at the SAME description #${of} — same offset, same flags (refcount ${s.ofds.find((o) => o.id === of)!.refs}).`;
      L.vi = `dup(${op.fd}) KHÔNG mở lại tệp: fd ${fd} trỏ vào CÙNG mô tả #${of} — chung offset, chung cờ (refcount ${s.ofds.find((o) => o.id === of)!.refs}).`;
      return s;
    }
    case 'dup2': {
      const p = proc(s, op.pid);
      const of = fdGet(p, op.from)!;
      const old = fdGet(p, op.to);
      if (old !== undefined && old !== of) dropRef(s, old);
      setFd(p, op.to, of);
      if (old !== of) s.ofds.find((o) => o.id === of)!.refs++;
      const ino = s.ofds.find((o) => o.id === of)!.ino;
      const what = ino === TTY ? 'the terminal' : namesOf(s, ino)[0] ?? `inode ${ino}`;
      const whatVi = ino === TTY ? 'terminal' : namesOf(s, ino)[0] ?? `inode ${ino}`;
      L.cmd = `${p.name}[${p.pid}]: dup2(${op.from}, ${op.to})`; L.hot = { pid: p.pid, fd: op.to, ofd: of };
      L.en = `dup2(${op.from}, ${op.to}): close fd ${op.to}, then make it a copy of fd ${op.from} — RIGHT NOW fd ${op.from} means ${what}, so fd ${op.to} now means ${what} too. It copies what fd ${op.from} points at today, not a link to fd ${op.from}.`;
      L.vi = `dup2(${op.from}, ${op.to}): đóng fd ${op.to}, rồi biến nó thành bản sao của fd ${op.from} — NGAY LÚC NÀY fd ${op.from} là ${whatVi}, nên fd ${op.to} cũng thành ${whatVi}. Nó chép thứ fd ${op.from} đang trỏ tới, không phải một đường nối tới fd ${op.from}.`;
      return s;
    }
    case 'fork': {
      const p = proc(s, op.pid);
      const c: Proc = { pid: op.child, name: op.name ?? 'child', fds: p.fds.map((f) => [...f] as [number, number]) };
      for (const [, of] of c.fds) s.ofds.find((o) => o.id === of)!.refs++;
      s.procs.push(c);
      L.cmd = `${p.name}[${p.pid}]: fork() = ${op.child}`; L.hot = { pid: c.pid };
      L.en = `fork() copies the fd TABLE, not the files: child ${op.child} gets the same numbers pointing at the same descriptions (every refcount +1). Parent and child now share offsets.`;
      L.vi = `fork() chép BẢNG fd, không chép tệp: con ${op.child} có đúng các số đó trỏ vào đúng các mô tả đó (mọi refcount +1). Cha và con giờ dùng chung offset.`;
      return s;
    }
    case 'write': {
      const p = proc(s, op.pid);
      const of = fdGet(p, op.fd);
      L.cmd = `${p.name}[${p.pid}]: write(${op.fd}, ${op.bytes ? `<${fmtBytes(op.bytes)}>` : JSON.stringify(op.text)})`;
      if (of === undefined) { L.err = 'EBADF'; L.tone = 'bad'; L.en = `fd ${op.fd} is not open: EBADF.`; L.vi = `fd ${op.fd} chưa mở: EBADF.`; return s; }
      const o = s.ofds.find((x) => x.id === of)!;
      const ino = inodeOf(s, o.ino)!;
      L.hot = { pid: p.pid, fd: op.fd, ofd: o.id, ino: o.ino };
      if (ino.kind === 'tty') {
        s.term.push(op.text.replace(/\n$/, ''));
        L.en = `fd ${op.fd} → description #${o.id} → the terminal: the text appears on screen.`; L.vi = `fd ${op.fd} → mô tả #${o.id} → terminal: chữ hiện lên màn hình.`;
        return s;
      }
      const n = op.bytes ?? op.text.length;
      const oldSize = ino.size;
      if (o.append) o.pos = ino.size;
      if (op.bytes) { ino.size = Math.max(ino.size, o.pos + n); }
      else {
        const pad = ino.data.length < o.pos ? ino.data + '\0'.repeat(o.pos - ino.data.length) : ino.data;
        ino.data = pad.slice(0, o.pos) + op.text + pad.slice(o.pos + n);
        ino.size = ino.data.length;
      }
      const at = o.pos;
      o.pos += n;
      L.cmd += ` = ${n}`;
      const over = at < oldSize;
      L.tone = over && !o.append ? 'warn' : undefined;
      L.en = `${o.append ? `O_APPEND: the kernel first moves the offset to the END (${at}), atomically, ` : `Writes at the offset stored in description #${o.id}: ${at}, `}then ${fmtBytes(n)} are written and the offset becomes ${o.pos}.${over && !o.append ? ' That position already had data — it was OVERWRITTEN.' : ''}`;
      L.vi = `${o.append ? `O_APPEND: nhân dời offset về CUỐI tệp (${at}) trước, một cách nguyên tử, ` : `Ghi tại offset lưu trong mô tả #${o.id}: ${at}, `}rồi ghi ${fmtBytes(n)} và offset thành ${o.pos}.${over && !o.append ? ' Chỗ đó đã có dữ liệu — nó bị GHI ĐÈ.' : ''}`;
      return s;
    }
    case 'close': {
      const p = proc(s, op.pid);
      const of = fdGet(p, op.fd)!;
      p.fds = p.fds.filter(([k]) => k !== op.fd);
      const r = dropRef(s, of);
      L.cmd = `${p.name}[${p.pid}]: close(${op.fd})`; L.hot = { pid: p.pid, ino: r.ino };
      L.tone = r.freedIno ? 'ok' : undefined;
      L.en = r.freedIno ? `Last reference gone and the file had no name left ⇒ the kernel frees inode ${r.ino} and its blocks. NOW df goes down.` : r.freedOfd ? `fd ${op.fd} closed; description #${of} had no other user, so it is freed too. The inode stays (it still has a name).` : `fd ${op.fd} closed, but description #${of} is still used by another fd or process (refcount ${s.ofds.find((o) => o.id === of)?.refs}).`;
      L.vi = r.freedIno ? `Tham chiếu cuối cùng biến mất và tệp không còn tên nào ⇒ nhân giải phóng inode ${r.ino} cùng các khối dữ liệu. GIỜ df mới giảm.` : r.freedOfd ? `Đã đóng fd ${op.fd}; mô tả #${of} không còn ai dùng nên cũng được giải phóng. Inode vẫn còn (nó còn tên).` : `Đã đóng fd ${op.fd}, nhưng mô tả #${of} vẫn được fd hoặc tiến trình khác dùng (refcount ${s.ofds.find((o) => o.id === of)?.refs}).`;
      return s;
    }
    case 'rm': {
      const d = s.dentries.find((x) => x.name === op.name);
      L.cmd = `rm ${op.name}`;
      if (!d) { L.err = 'ENOENT'; L.tone = 'bad'; L.en = 'No such file.'; L.vi = 'Không có tệp đó.'; return s; }
      s.dentries = s.dentries.filter((x) => x !== d);
      const ino = inodeOf(s, d.ino)!;
      ino.links--;
      const freed = maybeFree(s, d.ino);
      L.hot = { ino: d.ino };
      L.tone = !freed && ino.links === 0 ? 'warn' : undefined;
      L.en = freed ? `rm = unlink(): the name is removed from the directory, link count drops to 0 and nobody has it open ⇒ inode ${d.ino} is freed.`
        : ino.links > 0 ? `rm removes ONE name. Inode ${d.ino} still has ${ino.links} other name(s), so the data stays.`
          : `The name is gone (ls and du no longer see it) but a process still has inode ${d.ino} OPEN ⇒ the kernel keeps it: link count 0, open 1. df does NOT go down — "deleted" log files eating a full disk. Find them with lsof +L1.`;
      L.vi = freed ? `rm = unlink(): tên bị gỡ khỏi thư mục, số liên kết về 0 và không ai đang mở ⇒ inode ${d.ino} được giải phóng.`
        : ino.links > 0 ? `rm chỉ gỡ MỘT tên. Inode ${d.ino} vẫn còn ${ino.links} tên khác nên dữ liệu vẫn nguyên.`
          : `Tên đã mất (ls và du không thấy nữa) nhưng một tiến trình vẫn đang MỞ inode ${d.ino} ⇒ nhân giữ lại: link count 0, đang mở 1. df KHÔNG giảm — chuyện tệp log "đã xoá" vẫn làm đầy đĩa. Tìm bằng lsof +L1.`;
      return s;
    }
    case 'ln': {
      const d = s.dentries.find((x) => x.name === op.from)!;
      s.dentries.push({ name: op.to, ino: d.ino });
      inodeOf(s, d.ino)!.links++;
      L.cmd = `ln ${op.from} ${op.to}`; L.hot = { ino: d.ino, name: op.to };
      L.en = `A hard link is just a second NAME for the same inode ${d.ino} (ls -li shows the same number); link count = ${inodeOf(s, d.ino)!.links}. Neither name is "the original".`;
      L.vi = `Hard link chỉ là TÊN thứ hai cho cùng inode ${d.ino} (ls -li hiện cùng một số); số liên kết = ${inodeOf(s, d.ino)!.links}. Không tên nào là "bản gốc".`;
      return s;
    }
    case 'symlink': {
      const ino = allocIno(s);
      s.inodes.push({ ino, kind: 'symlink', data: op.target, size: op.target.length, links: 1, target: op.target });
      s.dentries.push({ name: op.name, ino });
      L.cmd = `ln -s ${op.target} ${op.name}`; L.hot = { ino, name: op.name };
      L.en = `A symlink is its OWN inode (${ino}) whose content is just the text "${op.target}" (${op.target.length} bytes). It points at a NAME, not at an inode.`;
      L.vi = `Symlink là một inode RIÊNG (${ino}) mà nội dung chỉ là chuỗi "${op.target}" (${op.target.length} byte). Nó trỏ tới một TÊN, không trỏ tới inode.`;
      return s;
    }
    case 'mvx': {
      const d = s.dentries.find((x) => x.name === op.name)!;
      s.dentries = s.dentries.filter((x) => x !== d);
      const ino = inodeOf(s, d.ino)!; ino.links--; const freed = maybeFree(s, d.ino);
      L.cmd = `mv ${op.name} /tmp/`; L.hot = { ino: d.ino };
      s.term.push(`renameat2("${op.name}", "/tmp/${op.name}") = -1 EXDEV (Invalid cross-device link)`);
      L.en = `/tmp is another filesystem: an inode number only means something on its own disk, so rename() fails with EXDEV and mv falls back to COPY + DELETE. Inode ${d.ino} here is ${freed ? 'freed' : 'unlinked'}.`;
      L.vi = `/tmp là hệ thống tệp khác: số inode chỉ có nghĩa trên chính đĩa của nó, nên rename() thất bại với EXDEV và mv lùi về CHÉP + XOÁ. Inode ${d.ino} ở đây ${freed ? 'được giải phóng' : 'bị gỡ tên'}.`;
      return s;
    }
    case 'cat': {
      const d = s.dentries.find((x) => x.name === op.name);
      L.cmd = `cat ${op.name}`;
      if (!d) { s.term.push(`cat: ${op.name}: No such file or directory`); L.tone = 'bad'; L.en = 'No such name.'; L.vi = 'Không có tên đó.'; return s; }
      const ino = inodeOf(s, d.ino)!;
      if (ino.kind === 'symlink') {
        const t = s.dentries.find((x) => x.name === ino.target);
        L.hot = { ino: d.ino, name: op.name };
        if (!t) { s.term.push(`cat: ${op.name}: No such file or directory`); L.tone = 'bad'; L.en = `The symlink still exists, but the NAME it points at ("${ino.target}") is gone ⇒ a dangling link: No such file or directory.`; L.vi = `Symlink vẫn còn, nhưng TÊN nó trỏ tới ("${ino.target}") đã mất ⇒ link treo: No such file or directory.`; return s; }
        s.term.push(inodeOf(s, t.ino)!.data.replace(/\n$/, '')); L.tone = 'ok'; L.en = `The kernel reads the symlink's text "${ino.target}" and looks that name up again.`; L.vi = `Nhân đọc chuỗi "${ino.target}" trong symlink rồi tra lại tên đó.`; return s;
      }
      s.term.push(ino.data.replace(/\n$/, '')); L.hot = { ino: d.ino, name: op.name }; L.tone = 'ok';
      L.en = `"${op.name}" → inode ${d.ino} → the data is still there.`; L.vi = `"${op.name}" → inode ${d.ino} → dữ liệu vẫn còn đó.`;
      return s;
    }
    case 'exec': {
      const p = proc(s, op.pid);
      const closed: number[] = [];
      for (const [fd, of] of [...p.fds]) {
        const o = s.ofds.find((x) => x.id === of)!;
        if (o.cloexec) { p.fds = p.fds.filter(([k]) => k !== fd); dropRef(s, of); closed.push(fd); }
      }
      L.cmd = `${p.name}[${p.pid}]: execve("${op.prog}")`; L.hot = { pid: p.pid };
      p.name = op.prog.split('/').pop()!;
      L.en = `execve() replaces the program but KEEPS the fd table — except fds marked O_CLOEXEC${closed.length ? ` (closed: ${closed.join(', ')})` : ' (none here)'}. That is how a shell's redirections reach ls, and how a forgotten fd leaks a secret into a child.`;
      L.vi = `execve() thay chương trình nhưng GIỮ NGUYÊN bảng fd — trừ các fd có O_CLOEXEC${closed.length ? ` (đã đóng: ${closed.join(', ')})` : ' (ở đây không có)'}. Nhờ vậy chuyển hướng của shell tới được ls, và cũng vì vậy một fd bị quên làm lộ bí mật sang tiến trình con.`;
      return s;
    }
  }
}

export const fmtBytes = (n: number) => (n >= 1 << 20 ? `${Math.round(n / (1 << 20))} MiB` : `${n} B`);

export interface FdPreset { init: FdState; ops: FdOp[]; en: string; vi: string }
const A = 'worker A: order 1001 paid\n', B = 'worker B: hi\n';
const MB = 1 << 20;

export const FD_PRESETS: Record<string, FdPreset> = {
  twice: {
    en: 'Two workers each open() log.txt and write one line (ofd.c "twice").', vi: 'Hai worker mỗi người open() log.txt một lần rồi ghi một dòng (ofd.c "twice").',
    init: initFd({ files: [['log.txt', 12, '']] }),
    ops: [{ op: 'open', pid: 100, path: 'log.txt', label: 'log.txt (A)' }, { op: 'open', pid: 100, path: 'log.txt', label: 'log.txt (B)' }, { op: 'write', pid: 100, fd: 3, text: A }, { op: 'write', pid: 100, fd: 4, text: B }, { op: 'cat', name: 'log.txt' }],
  },
  dup: {
    en: 'Same two writes, but B is a dup() of A (ofd.c "dup").', vi: 'Vẫn hai lần ghi đó, nhưng B là dup() của A (ofd.c "dup").',
    init: initFd({ files: [['log.txt', 12, '']] }),
    ops: [{ op: 'open', pid: 100, path: 'log.txt' }, { op: 'dup', pid: 100, fd: 3 }, { op: 'write', pid: 100, fd: 3, text: A }, { op: 'write', pid: 100, fd: 4, text: B }, { op: 'cat', name: 'log.txt' }],
  },
  append: {
    en: 'Two separate opens again — but B uses O_APPEND (ofd.c "append").', vi: 'Lại hai lần open riêng — nhưng B dùng O_APPEND (ofd.c "append").',
    init: initFd({ files: [['log.txt', 12, '']] }),
    ops: [{ op: 'open', pid: 100, path: 'log.txt' }, { op: 'open', pid: 100, path: 'log.txt', append: true }, { op: 'write', pid: 100, fd: 3, text: A }, { op: 'write', pid: 100, fd: 4, text: B }, { op: 'cat', name: 'log.txt' }],
  },
  fork: {
    en: 'open(), then fork(): parent and child write to the inherited fd 3 (ofd.c "fork").', vi: 'open(), rồi fork(): cha và con cùng ghi vào fd 3 thừa hưởng (ofd.c "fork").',
    init: initFd({ files: [['log.txt', 12, '']], name: 'parent' }),
    ops: [{ op: 'open', pid: 100, path: 'log.txt' }, { op: 'fork', pid: 100, child: 101 }, { op: 'write', pid: 101, fd: 3, text: 'child  line 1\n' }, { op: 'write', pid: 101, fd: 3, text: 'child  line 2\n' }, { op: 'write', pid: 100, fd: 3, text: 'parent line 3\n' }, { op: 'cat', name: 'log.txt' }],
  },
  deleted: {
    en: 'An app keeps app.log open; someone rm\'s the 900 MiB log to free disk space (the Chapter 2 incident).', vi: 'Một app giữ app.log đang mở; ai đó rm tệp log 900 MiB cho nhẹ đĩa (sự cố Chương 2).',
    init: initFd({ files: [['app.log', 12, '']], name: 'node' }),
    ops: [{ op: 'open', pid: 100, path: 'app.log', append: true }, { op: 'write', pid: 100, fd: 3, text: '', bytes: 900 * MB }, { op: 'rm', name: 'app.log' }, { op: 'write', pid: 100, fd: 3, text: '', bytes: 50 * MB }, { op: 'close', pid: 100, fd: 3 }],
  },
  emfile: {
    en: 'A server leaks one socket per request. The soft limit is 1024 (ulimit -n).', vi: 'Một máy chủ rò một socket mỗi request. Giới hạn mềm là 1024 (ulimit -n).',
    init: initFd({ name: 'echo-epoll', soft: 1024 }),
    ops: [{ op: 'open', pid: 100, path: 'socket:listen', label: 'socket :7000 (listen)' }, { op: 'leak', pid: 100, n: 500 }, { op: 'leak', pid: 100, n: 500 }, { op: 'leak', pid: 100, n: 500 }, { op: 'ulimit', soft: 4096 }, { op: 'leak', pid: 100, n: 500 }],
  },
  links: {
    en: 'Names vs inodes on /mnt/lab: hard link, symlink, rm, a cross-device mv, inode numbers reused (c91-inode).', vi: 'Tên và inode trên /mnt/lab: hard link, symlink, rm, mv sang đĩa khác, số inode được dùng lại (c91-inode).',
    init: initFd({ files: [['status.txt', 13, 'load 0.42\n']], nextIno: 14 }),
    ops: [{ op: 'open', pid: 100, path: 'app.env', creat: true, trunc: true, label: 'app.env' }, { op: 'write', pid: 100, fd: 3, text: 'PORT=3000\n' }, { op: 'close', pid: 100, fd: 3 }, { op: 'ln', from: 'app.env', to: 'app.env.bak' }, { op: 'symlink', target: 'app.env', name: 'current.env' },
      { op: 'rm', name: 'app.env' }, { op: 'cat', name: 'app.env.bak' }, { op: 'cat', name: 'current.env' }, { op: 'mvx', name: 'app.env.bak' }, { op: 'rm', name: 'current.env' }, { op: 'open', pid: 100, path: 'new.txt', creat: true, label: 'new.txt' }],
  },
  redirect: {
    en: 'The shell runs ls /nope with "> out.txt 2>&1" — then the same with the order swapped.', vi: 'Shell chạy ls /nope với "> out.txt 2>&1" — rồi đảo thứ tự.',
    init: initFd({ name: 'bash' }),
    ops: [{ op: 'fork', pid: 100, child: 62, name: 'bash' }, { op: 'open', pid: 62, path: 'out.txt', creat: true, trunc: true }, { op: 'dup2', pid: 62, from: 3, to: 1 }, { op: 'close', pid: 62, fd: 3 }, { op: 'dup2', pid: 62, from: 1, to: 2 }, { op: 'exec', pid: 62, prog: '/usr/bin/ls' },
      { op: 'write', pid: 62, fd: 2, text: "ls: cannot access '/nope': No such file or directory\n" }, { op: 'cat', name: 'out.txt' },
      { op: 'fork', pid: 100, child: 63, name: 'bash' }, { op: 'dup2', pid: 63, from: 1, to: 2 }, { op: 'open', pid: 63, path: 'out.txt', creat: true, trunc: true }, { op: 'dup2', pid: 63, from: 3, to: 1 }, { op: 'close', pid: 63, fd: 3 }, { op: 'exec', pid: 63, prog: '/usr/bin/ls' },
      { op: 'write', pid: 63, fd: 2, text: "ls: cannot access '/nope': No such file or directory\n" }, { op: 'cat', name: 'out.txt' }],
  },
};

/** Chạy cả kịch bản: trạng thái 0 = ban đầu, trạng thái k = sau thao tác k. */
export function runFd(init: FdState, ops: FdOp[]): FdState[] {
  const out = [init];
  for (const o of ops) out.push(apply(out[out.length - 1], o));
  return out;
}

/** offset của fd trong tiến trình pid (để kiểm & cho tour). */
export function posOf(s: FdState, pid: number, fd: number): number | undefined {
  const p = s.procs.find((x) => x.pid === pid);
  const of = p && fdGet(p, fd);
  return of === undefined ? undefined : s.ofds.find((o) => o.id === of)?.pos;
}
