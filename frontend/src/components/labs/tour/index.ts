/**
 * Danh mục tour. Ngoài các tour viết tay (tours-cpu.ts, tours-os.ts), MỌI mô phỏng có thêm một tour "làm quen"
 * `<tên>-start` dựng tự động: mô phỏng này là gì, bảng điều khiển dùng ra sao, bấm thử hai bước, đọc ô giải thích.
 * Nhờ vậy nút "Bắt đầu hướng dẫn" có mặt ở mọi khối nhúng, kể cả mô phỏng chưa có tour riêng.
 *
 * Bài học chọn tour bằng class `<ns>-t-<id>`; danh sách id phía nội dung nằm ở content/_labs.mjs (LAB_TOURS) và
 * PHẢI khớp `tourIdsBySim()` ở đây — labs/registry.test.ts kiểm.
 */
import { LABS } from '../registry';
import { LAB_NAMESPACES, type LabNs } from '../selector';
import { CPU_TOURS } from './tours-cpu';
import { OS_TOURS } from './tours-os';
import { OS2_TOURS } from './tours-os2';
import type { Tour, TourStep } from './types';

/** mô phỏng không có ô giải thích cố định ⇒ tour làm quen bỏ bước "đọc ô giải thích" */
const NO_EXPLAIN = new Set(['os-lab:sysmon']);

function startTour(ns: LabNs, sim: string): Tour {
  const d = LABS[ns].labs[sim];
  const hasPlayer = (s: Record<string, unknown>) => !!s.player;
  return {
    id: `${sim}-start`, ns, sim, presets: [],
    title: ['How to use this lab', 'Cách dùng phòng lab này'],
    summary: ['A one-minute orientation: what this simulation shows and how to drive it.', 'Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.'],
    steps: [
      { target: 'head', title: [d.en, d.vi], body: [d.descEn, d.descVi] },
      {
        target: 'controls', when: hasPlayer,
        title: ['The control bar', 'Thanh điều khiển'],
        body: ['↺ back to the start · ⏮ one step back · ▶ Play / Pause · ⏭ Step forward · 0.5×–4× speed · the slider jumps anywhere in time. Nothing you do here can break anything — you can always rewind.', '↺ về đầu · ⏮ lùi một bước · ▶ Chạy / Dừng · ⏭ tới một bước · tốc độ 0,5×–4× · thanh trượt nhảy tới bất kỳ thời điểm nào. Bạn bấm gì cũng không hỏng được — luôn tua lại được.'],
      },
      {
        target: 'step', when: hasPlayer,
        title: ['Your turn: two steps', 'Đến lượt bạn: hai bước'],
        body: ['Press Step twice and watch what changes on screen after each press.', 'Bấm Bước hai lần và xem trên màn hình thứ gì thay đổi sau mỗi lần bấm.'],
        task: { text: ['Press Step twice.', 'Bấm Bước hai lần.'], until: (s) => ((s.player?.i as number) ?? 0) >= 2, solve: [{ a: 'player.step', delay: 600, upTo: 2 }] },
      },
      ...(NO_EXPLAIN.has(`${ns}:${sim}`) ? [] : [{
        target: 'explain',
        title: ['Read the explanation', 'Đọc ô giải thích'],
        body: ['The box with the coloured left border tells you what just happened and why. Green = good outcome, orange = warning, red = something went wrong (on purpose).', 'Ô có viền màu bên trái kể cho bạn chuyện gì vừa xảy ra và vì sao. Xanh lá = kết quả tốt, cam = cảnh báo, đỏ = có chuyện (cố ý cho bạn thấy).'],
      } as TourStep]),
      {
        title: ['Now explore', 'Giờ tự khám phá'],
        body: ['Change the options at the top, run it again and compare. The lesson text around this lab tells you what to look for. Press the guide button again any time.', 'Đổi các lựa chọn phía trên, chạy lại và so sánh. Bài học quanh phòng lab này cho bạn biết cần để ý điều gì. Cần lúc nào thì bấm lại nút hướng dẫn.'],
      },
    ],
    quiz: {
      q: ['What does the box with the coloured left border tell you?', 'Ô có viền màu bên trái cho bạn biết gì?'],
      options: [['What just happened in the simulation and why', 'Chuyện vừa xảy ra trong mô phỏng và vì sao'], ['An advertisement', 'Một quảng cáo'], ['An error of the website', 'Lỗi của trang web']],
      answer: 0, why: ['Read it after every step — it is the narration of the simulation.', 'Đọc nó sau mỗi bước — đó là lời kể của mô phỏng.'],
    },
  };
}

const GENERIC: Tour[] = LAB_NAMESPACES.flatMap((ns) => Object.keys(LABS[ns].labs).map((sim) => startTour(ns, sim)));
export const TOURS: Tour[] = [...CPU_TOURS, ...OS_TOURS, ...OS2_TOURS, ...GENERIC];
export const TOUR_BY_ID: ReadonlyMap<string, Tour> = new Map(TOURS.map((t) => [t.id, t]));

/** Mọi tour của một mô phỏng: tour viết tay trước, tour làm quen cuối. */
export const toursOf = (ns: LabNs, sim: string) => TOURS.filter((t) => t.ns === ns && t.sim === sim);

/** Tour mặc định khi mô phỏng mở ở `preset`: tour viết tay dành cho đúng preset đó, không có thì tour làm quen. */
export function defaultTour(ns: LabNs, sim: string, preset?: string): Tour | undefined {
  const all = toursOf(ns, sim);
  return all.find((t) => preset !== undefined && t.presets.includes(preset)) ?? all.find((t) => t.presets.length === 0);
}

/** { ns: { sim: [id…] } } — đối chiếu với LAB_TOURS của content/_labs.mjs */
export function tourIdsBySim(): Record<LabNs, Record<string, string[]>> {
  const out = {} as Record<LabNs, Record<string, string[]>>;
  for (const ns of LAB_NAMESPACES) {
    out[ns] = {};
    for (const sim of Object.keys(LABS[ns].labs)) out[ns][sim] = toursOf(ns, sim).map((t) => t.id);
  }
  return out;
}
