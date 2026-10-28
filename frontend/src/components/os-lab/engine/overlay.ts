/**
 * Chồng lớp OverlayFS + bộ nhớ đệm build — engine thuần cho mô phỏng `overlay` (Chương 12, bài 12.3).
 *
 * mount -t overlay -o lowerdir=app:base,upperdir=upper,workdir=work merged
 *   • lowerdir: các lớp CHỈ ĐỌC, lớp ghi bên TRÁI nằm TRÊN (app che base);
 *   • upperdir: lớp GHI ĐƯỢC duy nhất — mọi thay đổi của container rơi vào đây (docker diff = nội dung upper);
 *   • merged: góc nhìn ghép: đi từ trên xuống, gặp tệp nào trước thì thấy tệp đó.
 * Sửa tệp của lớp dưới ⇒ COPY-UP: chép NGUYÊN tệp lên upper rồi mới sửa (200 MB mất 0,93 s, upper 1 → 201 MB; lần sửa
 * thứ hai 1 ms). Xoá tệp của lớp dưới ⇒ WHITEOUT (thiết bị ký tự 0,0 trên upper). Xoá thư mục rồi tạo lại ⇒ thư mục
 * OPAQUE (trusted.overlay.opaque="y") che toàn bộ thư mục cùng tên ở dưới.
 * Bộ nhớ đệm build: mỗi lệnh Dockerfile là một lớp; một lớp đổi ⇒ nó và MỌI lớp sau phải dựng lại.
 * Khớp lab/out/c123-overlay + c123-host.
 */

export interface OvEntry { kind: 'file' | 'dir' | 'whiteout'; mb: number; data: string; opaque?: boolean }
export interface OvLayer { name: string; files: Record<string, OvEntry> }
export interface OvState {
  lowers: OvLayer[]; upper: OvLayer; mounted: boolean;
  term: string[];
  last: { cmd: string; en: string; vi: string; tone?: 'ok' | 'bad' | 'warn'; hot: { layer?: string; path?: string }; sec?: number; copied?: number };
}

export const COPYUP_S_PER_MB = 0.93 / 200;
const f = (data: string, mb = 0): OvEntry => ({ kind: 'file', mb, data });
const dir = (): OvEntry => ({ kind: 'dir', mb: 0, data: '' });

export function initOverlay(): OvState {
  return {
    lowers: [
      { name: 'app', files: { etc: dir(), 'etc/app.conf': f('port=8080\n'), 'server.js': f("console.log('hi')\n") } },
      { name: 'base', files: { etc: dir(), 'etc/app.conf': f('port=80\n'), 'etc/legacy.conf': f('old\n'), 'os-release': f('Debian 13\n'), 'big.db': f('', 200) } },
    ],
    upper: { name: 'upper', files: {} }, mounted: false, term: [],
    last: { cmd: '', en: 'Two read-only layers, an empty upper directory. Nothing is mounted yet.', vi: 'Hai lớp chỉ-đọc, một thư mục upper trống. Chưa mount gì.', hot: {} },
  };
}

const parents = (p: string) => { const out: string[] = []; let k = p.lastIndexOf('/'); while (k > 0) { out.push(p.slice(0, k)); k = p.lastIndexOf('/', k - 1); } return out; };

/** Tệp `path` nhìn từ merged: lớp nào cung cấp, hay bị che. */
export function resolve(s: OvState, path: string): { from: string; e: OvEntry } | null {
  for (const L of [s.upper, ...s.lowers]) {
    for (const a of parents(path)) { const pe = L.files[a]; if (pe?.kind === 'whiteout') return null; }
    const e = L.files[path];
    if (e) { if (e.kind === 'whiteout') return null; return { from: L.name, e }; }
    if (parents(path).some((a) => L.files[a]?.opaque)) return null;
  }
  return null;
}

export function merged(s: OvState): Array<{ path: string; from: string; e: OvEntry }> {
  const all = new Set<string>();
  for (const L of [s.upper, ...s.lowers]) for (const p of Object.keys(L.files)) all.add(p);
  const out: Array<{ path: string; from: string; e: OvEntry }> = [];
  for (const p of Array.from(all).sort()) { const r = resolve(s, p); if (r) out.push({ path: p, ...r }); }
  return out;
}

/** du -sm upper (tối thiểu 1 khi có thứ gì đó, như du thật làm tròn lên). */
export function upperMB(s: OvState): number {
  const es = Object.values(s.upper.files);
  if (!es.length) return 0;
  return Math.ceil(es.reduce((a, e) => a + e.mb, 0) + 0.004 * es.length);
}

/** docker diff: A thêm, C đổi (đã copy-up hoặc thư mục bị đụng), D xoá (whiteout). */
export function dockerDiff(s: OvState): string[] {
  const out: string[] = [];
  for (const [p, e] of Object.entries(s.upper.files).sort()) {
    const inLower = s.lowers.some((L) => L.files[p]);
    if (e.kind === 'whiteout') out.push(`D /${p}`);
    else if (e.kind === 'dir' || inLower) out.push(`C /${p}`);
    else out.push(`A /${p}`);
  }
  return out;
}

export type OvOp =
  | { op: 'mount' }
  | { op: 'read'; path: string }
  | { op: 'create'; path: string; data: string }
  | { op: 'append'; path: string; data: string }
  | { op: 'rm'; path: string }
  | { op: 'rmdir'; path: string }
  | { op: 'umount' };

const clone = (s: OvState): OvState => ({
  ...s, lowers: s.lowers.map((L) => ({ ...L, files: { ...L.files } })), upper: { ...s.upper, files: { ...s.upper.files } }, term: [...s.term],
  last: { cmd: '', en: '', vi: '', hot: {} },
});
const ensureDirs = (s: OvState, path: string) => { for (const a of parents(path)) if (!s.upper.files[a]) s.upper.files[a] = dir(); };

export function apply(s0: OvState, op: OvOp): OvState {
  const s = clone(s0);
  const L = s.last;
  switch (op.op) {
    case 'mount':
      s.mounted = true;
      L.cmd = 'mount -t overlay overlay -o lowerdir=app:base,upperdir=upper,workdir=work merged';
      L.en = 'The kernel stacks the layers into ONE view called merged. Leftmost lowerdir (app) is on top of base; upper is above both. Nothing is copied — merged is only a view.';
      L.vi = 'Nhân xếp các lớp thành MỘT góc nhìn tên merged. lowerdir bên trái nhất (app) nằm trên base; upper nằm trên cùng. Không có gì bị chép — merged chỉ là một góc nhìn.';
      L.tone = 'ok';
      return s;
    case 'read': {
      const r = resolve(s, op.path);
      L.cmd = `cat merged/${op.path}`; L.hot = { layer: r?.from, path: op.path };
      if (!r) { s.term.push(`cat: merged/${op.path}: No such file or directory`); L.tone = 'bad'; L.en = 'Hidden or missing: no layer shows this name.'; L.vi = 'Bị che hoặc không có: không lớp nào hiện tên này.'; return s; }
      s.term.push(`$ cat merged/${op.path}`, r.e.data.replace(/\n$/, '') || `(${r.e.mb} MB of data)`);
      const shadow = s.lowers.filter((x) => x.name !== r.from && x.files[op.path]).map((x) => x.name);
      L.en = `Looked top-down: the first layer that has ${op.path} is "${r.from}".${shadow.length ? ` The copy in ${shadow.join(', ')} is still there, just hidden underneath.` : ''}`;
      L.vi = `Tìm từ trên xuống: lớp đầu tiên có ${op.path} là "${r.from}".${shadow.length ? ` Bản trong ${shadow.join(', ')} vẫn còn đó, chỉ bị che bên dưới.` : ''}`;
      return s;
    }
    case 'create':
      ensureDirs(s, op.path);
      s.upper.files[op.path] = f(op.data);
      L.cmd = `echo "${op.data.replace(/\n$/, '')}" > merged/${op.path}`; L.hot = { layer: 'upper', path: op.path }; L.sec = 0.001;
      L.en = 'A brand-new file: it is created directly in upper. The image layers are not touched.'; L.vi = 'Một tệp mới tinh: nó được tạo thẳng trong upper. Các lớp image không bị đụng tới.';
      return s;
    case 'append': {
      const r = resolve(s, op.path);
      L.cmd = `echo "${op.data.replace(/\n$/, '')}" >> merged/${op.path}`;
      if (!r) { L.tone = 'bad'; L.en = 'No such file.'; L.vi = 'Không có tệp đó.'; return s; }
      if (r.from === 'upper') {
        s.upper.files[op.path] = { ...r.e, data: r.e.data + op.data, mb: r.e.mb };
        L.hot = { layer: 'upper', path: op.path }; L.sec = 0.001; L.tone = 'ok';
        L.en = `The file is already in upper, so the write goes straight there: ${L.sec * 1000} ms. Copy-up is paid only ONCE per file.`;
        L.vi = `Tệp đã nằm trong upper nên lần ghi đi thẳng vào đó: ${L.sec * 1000} ms. Giá copy-up chỉ trả MỘT lần cho mỗi tệp.`;
        return s;
      }
      ensureDirs(s, op.path);
      s.upper.files[op.path] = { kind: 'file', mb: r.e.mb, data: r.e.data + op.data };
      const sec = r.e.mb ? Math.round(r.e.mb * COPYUP_S_PER_MB * 1000) / 1000 : 0.001;
      L.hot = { layer: 'upper', path: op.path }; L.sec = sec; L.copied = r.e.mb; L.tone = r.e.mb >= 50 ? 'warn' : undefined;
      L.en = `COPY-UP: ${op.path} lives in the read-only layer "${r.from}". Before the write, the kernel copies the WHOLE file into upper${r.e.mb ? ` — ${r.e.mb} MB for one byte, ${sec} s` : ''}, then appends. "${r.from}" itself is untouched.`;
      L.vi = `COPY-UP: ${op.path} nằm trong lớp chỉ-đọc "${r.from}". Trước khi ghi, nhân chép NGUYÊN tệp lên upper${r.e.mb ? ` — ${r.e.mb} MB cho một byte, mất ${sec} s` : ''}, rồi mới nối thêm. Bản thân "${r.from}" không đổi.`;
      return s;
    }
    case 'rm': {
      const inLower = s.lowers.some((x) => x.files[op.path]);
      L.cmd = `rm merged/${op.path}`; L.hot = { layer: 'upper', path: op.path };
      if (inLower) {
        s.upper.files[op.path] = { kind: 'whiteout', mb: 0, data: '' };
        ensureDirs(s, op.path);
        s.term.push(`$ ls -l upper/${op.path}`, `c--------- 2 root root 0, 0 Oct 28 22:42 upper/${op.path}`);
        L.tone = 'warn';
        L.en = `${op.path} lives in a read-only layer, so it cannot really be deleted. Instead the kernel puts a WHITEOUT in upper — a character device 0,0 — that hides the name. The bytes are still in the image: deleting a secret in a later layer does not remove it.`;
        L.vi = `${op.path} nằm trong lớp chỉ-đọc nên không thể xoá thật. Thay vào đó nhân đặt một WHITEOUT trong upper — thiết bị ký tự 0,0 — để che tên. Byte vẫn còn trong image: xoá bí mật ở một lớp sau không làm nó biến mất.`;
      } else {
        delete s.upper.files[op.path];
        L.en = 'The file existed only in upper, so it is simply deleted.'; L.vi = 'Tệp chỉ có trong upper nên bị xoá thật.';
      }
      return s;
    }
    case 'rmdir': {
      for (const p of Object.keys(s.upper.files)) if (p === op.path || p.startsWith(op.path + '/')) delete s.upper.files[p];
      s.upper.files[op.path] = { kind: 'dir', mb: 0, data: '', opaque: true };
      L.cmd = `rm -rf merged/${op.path} && mkdir merged/${op.path}`; L.hot = { layer: 'upper', path: op.path }; L.tone = 'warn';
      s.term.push(`$ getfattr -d -m trusted.overlay upper/${op.path}`, `trusted.overlay.opaque="y"`);
      L.en = `Delete the directory and create it again: instead of one whiteout per file, the new ${op.path}/ in upper is marked OPAQUE — "do not look below me". Everything under ${op.path}/ in app and base disappears from merged.`;
      L.vi = `Xoá thư mục rồi tạo lại: thay vì một whiteout cho mỗi tệp, ${op.path}/ mới trong upper được đánh dấu OPAQUE — "đừng nhìn xuống dưới tôi". Mọi thứ dưới ${op.path}/ của app và base biến mất khỏi merged.`;
      return s;
    }
    case 'umount':
      s.mounted = false;
      L.cmd = 'umount merged; ls upper'; L.tone = 'ok';
      s.term.push(...dockerDiff(s));
      L.en = 'Unmounted: merged is gone, but upper is a normal directory that keeps every change — this is exactly what `docker diff` lists (A added, C changed, D deleted). `docker rm` throws upper away.';
      L.vi = 'Đã umount: merged biến mất, nhưng upper là một thư mục bình thường giữ mọi thay đổi — đúng thứ `docker diff` liệt kê (A thêm, C đổi, D xoá). `docker rm` vứt upper đi.';
      return s;
  }
}

export function runOv(ops: OvOp[], init = initOverlay()): OvState[] {
  const out = [init];
  for (const o of ops) out.push(apply(out[out.length - 1], o));
  return out;
}

export const OV_SCRIPTS: Record<string, OvOp[]> = {
  layers: [{ op: 'mount' }, { op: 'read', path: 'etc/app.conf' }, { op: 'read', path: 'os-release' }, { op: 'read', path: 'server.js' }],
  copyup: [{ op: 'mount' }, { op: 'create', path: 'access.log', data: 'GET /\n' }, { op: 'append', path: 'etc/app.conf', data: 'workers=4\n' }, { op: 'append', path: 'big.db', data: 'x' }, { op: 'append', path: 'big.db', data: 'y' }, { op: 'umount' }],
  whiteout: [{ op: 'mount' }, { op: 'rm', path: 'etc/legacy.conf' }, { op: 'read', path: 'etc/legacy.conf' }, { op: 'umount' }],
  opaque: [{ op: 'mount' }, { op: 'append', path: 'etc/app.conf', data: 'workers=4\n' }, { op: 'rmdir', path: 'etc' }, { op: 'read', path: 'etc/app.conf' }, { op: 'umount' }],
};

// ───────────────────────── ảnh Docker thật (c123-host) ─────────────────────────
export const IMAGE_LAYERS: Array<{ size: string; by: string }> = [
  { size: '309MB', by: 'RUN set -eux; ARCH="$(dpkg --…  (JDK base)' }, { size: '12.3kB', by: 'RUN set -eux; echo "Verifying…' }, { size: '12.3kB', by: 'COPY --chmod=755 entrypoint.sh' },
  { size: '0B', by: 'ENTRYPOINT ["/__cacert_entrypoint.sh"]' }, { size: '0B', by: 'CMD ["jshell"]' }, { size: '0B', by: 'ENV DEBIAN_FRONTEND=noninteractive' },
  { size: '719MB', by: 'RUN apt-get update && apt-get install …' }, { size: '122MB', by: 'COPY /usr/local/bin/node' }, { size: '18.9MB', by: 'COPY /usr/local/lib/node_modules' },
  { size: '16.4kB', by: 'RUN ln -s ../lib/node_modules/npm…' }, { size: '20.5kB', by: 'COPY phien.sh /usr/local/bin/phien' }, { size: '102kB', by: 'RUN chmod +x /usr/local/bin/phien' },
  { size: '4.1kB', by: 'WORKDIR /lab' }, { size: '0B', by: 'CMD ["bash"]' },
];
/** 13 lớp có nội dung (docker image inspect: 13 layers) + 1 lớp init của container = 14 lowerdir. */
export const OS_LAB_LAYERS = 13;
export const lowerdirCount = (imageLayers: number) => imageLayers + 1;
export const DOCKER_DIFF = ['C /tmp', 'A /tmp/note', 'C /etc', 'A /etc/hosts.allow', 'D /etc/legal'];

// ───────────────────────── bộ nhớ đệm build ─────────────────────────
export type Change = 'none' | 'server' | 'package';
export interface BuildStep { n: number; cmd: string; cached: boolean; sec: number }
const FIRST = 3.1;
/** good: COPY package.json → RUN npm ci → COPY server.js; bad: COPY . . trước RUN npm ci. Thời gian khớp c123-host. */
export function buildPlan(order: 'good' | 'bad', change: Change, first = false): { steps: BuildStep[]; total: number } {
  const cmds = order === 'good'
    ? ['FROM alpine:latest', 'WORKDIR /app', 'COPY package.json .', 'RUN npm ci   # (pretend: sleep 3)', 'COPY server.js .']
    : ['FROM alpine:latest', 'WORKDIR /app', 'COPY . .', 'RUN npm ci   # (pretend: sleep 3)'];
  // bước đầu tiên bị đổi nội dung
  const dirtyAt = first ? 2 : change === 'none' ? Infinity : order === 'good' ? (change === 'package' ? 3 : 5) : 3;
  const steps = cmds.map((cmd, k) => {
    const n = k + 1;
    const cached = n === 1 ? true : n < dirtyAt;
    const sec = cached ? 0 : /npm ci/.test(cmd) ? FIRST : /COPY|WORKDIR/.test(cmd) ? (n === cmds.length ? 0.1 : 0.0) : 0;
    return { n, cmd, cached, sec };
  });
  return { steps, total: Math.round(steps.reduce((a, x) => a + x.sec, 0) * 10) / 10 };
}
