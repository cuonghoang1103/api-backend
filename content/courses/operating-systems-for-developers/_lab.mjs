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
  latency: ['default'],
};

export function lab(sim, preset, lang, caption) {
  if (!SIMS[sim]) throw new Error(`os-lab: mô phỏng lạ "${sim}"`);
  if (!SIMS[sim].includes(preset)) throw new Error(`os-lab: ${sim} không có preset "${preset}"`);
  if (lang !== 'en' && lang !== 'vi') throw new Error(`os-lab: lang phải là en|vi`);
  const vi = lang === 'vi';
  const href = `/os-lab?sim=${sim}&amp;preset=${preset}&amp;lang=${lang}`;
  return `<div class="os-lab os-lab-sim-${sim} os-lab-p-${preset}"><p class="os-lab-cap">🧪 <strong>${vi ? 'Phòng lab trực quan' : 'Visual lab'}:</strong> ${caption} ` +
    `<a href="${href}" target="_blank" rel="noopener">${vi ? 'Mở toàn màn hình →' : 'Open full screen →'}</a></p></div>`;
}
