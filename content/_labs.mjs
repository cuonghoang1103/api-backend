/**
 * _labs.mjs — nhúng "phòng lab trực quan" vào bài học, dùng CHUNG cho mọi khoá/môn (28/10/2026).
 *
 *   import { labEmbed, thuNgay } from '../_labs.mjs';           // từ content/academy/*.mjs
 *   ${labEmbed('cpu-lab', 'cpu', 'sum', 'vi', 'Tổng 1..N trên CPU đồ chơi')}
 *   ${thuNgay('vi', 'bits', 'convert', 'Đổi 200 sang nhị phân từng bước', ['Đặt …', 'Đổi …'])}
 *
 * Ra HTML chỉ có class (qua được sanitizeHtml của trang học, không có script):
 *   <div class="cpu-lab cpu-lab-sim-cpu cpu-lab-p-sum"><p class="cpu-lab-cap">🧪 … <a href="/cpu-lab?sim=…">…</a></p></div>
 * Trang học (LearnPageClient — Academy dùng chung trang này) thấy khối thì gắn component React tương ứng
 * (frontend/src/components/labs/). Trình xem không chạy JS (app cũ, RSS…) vẫn có chú thích + link mở trang phòng lab.
 *
 * ⚠️ Danh sách dưới đây PHẢI khớp frontend/src/components/{os-lab,cpu-lab}/registry.ts — kiểm bằng
 *    npx tsx --test frontend/src/components/labs/registry.test.ts
 * Danh sách os-lab lấy THẲNG từ _lab.mjs của khoá OS (một nguồn, không chép).
 */
import { SIMS as OS_SIMS } from './courses/operating-systems-for-developers/_lab.mjs';

export const CPU_SIMS = {
  bits: ['play', 'intro', 'convert', 'signed', 'ops'],
  data: ['text', 'mojibake', 'float', 'color', 'endian'],
  logic: ['gates', 'adder', 'ripple', 'mux', 'register', 'nand'],
  cpu: ['add', 'sum', 'mul', 'max', 'io', 'selfmod', 'blank'],
  pipeline: ['add', 'sum', 'max'],
  cache: ['textbook', 'sequential', 'loop', 'conflict', 'matrix'],
};

export const LAB_NS = {
  'os-lab': { sims: OS_SIMS, gallery: '/os-lab', vi: 'Phòng lab hệ điều hành', en: 'OS lab' },
  'cpu-lab': { sims: CPU_SIMS, gallery: '/cpu-lab', vi: 'Phòng lab máy tính', en: 'Computer lab' },
};

export function labEmbed(ns, sim, preset, lang, caption) {
  const N = LAB_NS[ns];
  if (!N) throw new Error(`labs: không gian tên lạ "${ns}"`);
  if (!N.sims[sim]) throw new Error(`${ns}: mô phỏng lạ "${sim}"`);
  if (!N.sims[sim].includes(preset)) throw new Error(`${ns}: ${sim} không có preset "${preset}"`);
  if (lang !== 'en' && lang !== 'vi') throw new Error(`${ns}: lang phải là en|vi`);
  if (/[<>`]/.test(caption)) throw new Error(`${ns}: chú thích không được chứa < > hay backtick`);
  const vi = lang === 'vi';
  const href = `${N.gallery}?sim=${sim}&amp;preset=${preset}&amp;lang=${lang}`;
  return `<div class="${ns} ${ns}-sim-${sim} ${ns}-p-${preset}"><p class="${ns}-cap">🧪 <strong>${vi ? N.vi : N.en}:</strong> ${caption} ` +
    `<a href="${href}" target="_blank" rel="noopener">${vi ? 'Mở toàn màn hình →' : 'Open full screen →'}</a></p></div>`;
}

/**
 * Khối "🔬 Thử ngay": một câu dẫn + mô phỏng + 2–3 việc có hướng dẫn. `tasks` là mảng chuỗi (được dùng <b>, <code>).
 * Tuỳ chọn ns (mặc định cpu-lab) để nhúng cả mô phỏng của phòng lab OS.
 */
export function thuNgay(lang, sim, preset, lead, tasks, { ns = 'cpu-lab', caption, heading = true } = {}) {
  const vi = lang === 'vi';
  if (!Array.isArray(tasks) || tasks.length < 1) throw new Error('thuNgay: cần ít nhất một việc');
  for (const t of [lead, ...tasks]) if (/`|\$\{/.test(t)) throw new Error('thuNgay: không dùng backtick / ${ trong chữ');
  return `<div class="lab-try">
${heading ? `<h3>🔬 ${vi ? 'Thử ngay' : 'Try it now'}</h3>\n` : ''}<p>${lead}</p>
${labEmbed(ns, sim, preset, lang, caption ?? (vi ? 'kéo, bấm, chạy từng bước' : 'drag, click, step through'))}
<div class="callout"><b>${vi ? 'Việc cần làm' : 'Your tasks'}:</b><ol>${tasks.map((t) => `<li>${t}</li>`).join('')}</ol></div>
</div>`;
}
