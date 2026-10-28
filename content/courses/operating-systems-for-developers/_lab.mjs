/**
 * _lab.mjs — nhúng mô phỏng tương tác ("phòng lab trực quan") vào bài học.
 *
 *   import { lab } from './_lab.mjs';
 *   ${lab('process', 'shell', 'vi', 'Shell chạy một lệnh: fork → exec → wait')}   // trong khối .ml-vi
 *   ${lab('process', 'shell', 'en', 'A shell runs one command')}                   // trong khối .ml-en
 *
 * Ra HTML chỉ có class (qua được sanitizeHtml của trang học, không có script):
 *   <div class="os-lab os-lab-sim-process os-lab-p-shell"><p class="os-lab-cap">🧪 …  <a href="/os-lab?sim=…">…</a></p></div>
 * Trang học (LearnPageClient) thấy div.os-lab thì gắn component React tương ứng (frontend/src/components/os-lab/).
 * Trình xem không chạy JS (app desktop cũ, RSS…) vẫn có câu chú thích + link mở trang /os-lab.
 *
 * ⚠️ Danh sách SIMS dưới đây PHẢI khớp `OS_LABS` trong frontend/src/components/os-lab/registry.ts.
 *
 * Hướng dẫn từng bước (28/10/2026): tham số thứ 5 `{ tour }` chọn một bài hướng dẫn cho khối nhúng —
 *   ${lab('race', 'none', 'vi', 'counter++ mất lần tăng', { tour: 'race-lost-update' })}
 * ⇒ thêm class `os-lab-t-<tour>`; trang học hiện dải "Hướng dẫn từng bước: …" + nút Bắt đầu ngay trên mô phỏng.
 * Kịch bản tour nằm trong mã (frontend/src/components/labs/tour/), danh sách id dưới đây PHẢI khớp
 * `tourIdsBySim()` — labs/registry.test.ts kiểm. Không truyền tour ⇒ mô phỏng vẫn có nút "Bắt đầu hướng dẫn" nhỏ.
 */
export const SIMS = {
  process: ['shell', 'zombie', 'orphan', 'fork3', 'oom137', 'threads', 'sandbox'],
  scheduler: ['textbook', 'convoy', 'rr', 'interactive', 'multicore', 'nice'],
  race: ['none', 'mutex', 'atomic', 'deadlock', 'ordered'],
  memory: ['layout', 'stack', 'overflow'],
  vm: ['program', 'walk', 'pressure', 'exam', 'belady', 'loop'],
  sysmon: ['calm', 'cpuhog', 'memleak', 'diskfull', 'iostorm', 'forkbomb', 'zombies', 'mystery'],
  eventloop: ['order', 'block', 'offload', 'pool', 'race', 'racelock'],
  threadpool: ['healthy', 'overload', 'timeout', 'dbpool', 'virtual', 'mm1'],
  sync: ['semaphore', 'leak', 'pcif', 'pcwhile', 'readers', 'writerpref'],
  deadlock: ['banker', 'request', 'detect', 'cycle', 'pool', 'philosophers', 'inversion'],
  cgroup: ['oom', 'high', 'cache', 'swap', 'restart', 'cpuquota', 'cputhreads'],
  cow: ['fork', 'exec', 'bgsave', 'hugepage'],
  pagecache: ['seq', 'random', 'warm', 'mmap', 'lru'],
  syscall: ['write', 'fail', 'vdso', 'batch', 'strace', 'seccomp'],
  perm: ['owner', 'dirx', 'sticky', 'setgid', 'setuid', 'caps', 'acl'],
  fdtable: ['twice', 'dup', 'append', 'fork', 'deleted', 'emfile', 'links', 'redirect'],
  nslayers: ['docker', 'unshare', 'userns', 'pod'],
  overlay: ['layers', 'copyup', 'whiteout', 'opaque', 'image', 'cache'],
  latency: ['default'],
};

/** Bài hướng dẫn từng bước có cho từng mô phỏng (`<tên>-start` = tour làm quen, mô phỏng nào cũng có). */
export const TOURS = {
  process: ['process-shell', 'process-start'],
  scheduler: ['sched-policies', 'scheduler-start'],
  race: ['race-lost-update', 'race-deadlock', 'race-start'],
  memory: ['memory-start'],
  vm: ['vm-translate', 'vm-thrash', 'vm-start'],
  sysmon: ['sysmon-read', 'sysmon-start'],
  eventloop: ['eventloop-order', 'eventloop-block', 'eventloop-start'],
  threadpool: ['threadpool-start'],
  sync: ['sync-start'],
  deadlock: ['deadlock-detect', 'deadlock-banker', 'deadlock-start'],
  cgroup: ['cgroup-start'],
  cow: ['cow-start'],
  pagecache: ['pagecache-start'],
  syscall: ['syscall-journey', 'syscall-errno', 'syscall-start'],
  perm: ['perm-check', 'perm-acl', 'perm-start'],
  fdtable: ['fdtable-offsets', 'fdtable-deleted', 'fdtable-start'],
  nslayers: ['nslayers-views', 'nslayers-pod', 'nslayers-start'],
  overlay: ['overlay-copyup', 'overlay-cache', 'overlay-start'],
  latency: ['latency-start'],
};

/** @param {{ tour?: string }} [opts] */
export function lab(sim, preset, lang, caption, opts = {}) {
  const { tour } = opts;
  if (!SIMS[sim]) throw new Error(`os-lab: mô phỏng lạ "${sim}"`);
  if (!SIMS[sim].includes(preset)) throw new Error(`os-lab: ${sim} không có preset "${preset}"`);
  if (lang !== 'en' && lang !== 'vi') throw new Error(`os-lab: lang phải là en|vi`);
  if (tour !== undefined && !(TOURS[sim] ?? []).includes(tour)) throw new Error(`os-lab: ${sim} không có tour "${tour}"`);
  const vi = lang === 'vi';
  const href = `/os-lab?sim=${sim}&amp;preset=${preset}&amp;lang=${lang}${tour ? `&amp;tour=${tour}` : ''}`;
  return `<div class="os-lab os-lab-sim-${sim} os-lab-p-${preset}${tour ? ` os-lab-t-${tour}` : ''}"><p class="os-lab-cap">🧪 <strong>${vi ? 'Phòng lab trực quan' : 'Visual lab'}:</strong> ${caption} ` +
    `<a href="${href}" target="_blank" rel="noopener">${vi ? 'Mở toàn màn hình →' : 'Open full screen →'}</a></p></div>`;
}
