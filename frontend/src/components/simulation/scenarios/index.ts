/**
 * Sổ đăng ký kịch bản.
 *
 * Thêm một kịch bản mới = tạo file trong thư mục này rồi thêm vào mảng
 * `SCENARIOS`. Không có chỗ nào khác cần sửa: bảng điều khiển, thanh tua,
 * bộ đọc tham số URL và trình vẽ canvas đều đọc từ đây.
 */

import type { PanelSpec } from '../panels';
import type { Scenario, ScenarioGroup, ScenarioOptions, SimStep } from '../types';
import { restApiScenario } from './restApi';
import { cachingScenario } from './caching';
import { authScenario } from './auth';
import { databaseScenario } from './database';
import { websocketScenario } from './websocket';
import { microservicesScenario } from './microservices';
import { spamClickScenario } from './spamClick';
import { uploadScenario } from './upload';
import { nPlusOneScenario } from './nPlusOne';
import { webhookScenario } from './webhook';
import { nodejsEventLoopScenario } from './nodejsEventLoop';
import { nodejsMicrotaskScenario } from './nodejsMicrotask';
import { nodejsBlockingScenario } from './nodejsBlocking';
import { nodejsWorkerScenario } from './nodejsWorker';
import { nodejsBufferScenario } from './nodejsBuffer';
import { nodejsStreamScenario } from './nodejsStream';

// Thứ tự trong mảng = thứ tự hiện trên bảng chọn, và nó là thứ tự SƯ PHẠM:
// nền tảng trước (REST → đệm → xác thực → CSDL), rồi tới realtime và kiến
// trúc phân tán, cuối cùng là nhóm "bẫy thực chiến" — những thứ chỉ vỡ ra
// khi đã chạy hệ thống thật.
export const SCENARIOS: Scenario[] = [
  restApiScenario,
  cachingScenario,
  authScenario,
  databaseScenario,
  websocketScenario,
  microservicesScenario,
  spamClickScenario,
  webhookScenario,
  uploadScenario,
  nPlusOneScenario,

  // ── Mục Node.js — mỗi kịch bản dựng video cho MỘT bài trong khoá
  // `content/courses/nodejs`. Thứ tự ở đây theo thứ tự chương.
  nodejsEventLoopScenario,
  nodejsMicrotaskScenario,
  nodejsBlockingScenario,
  nodejsWorkerScenario,
  nodejsBufferScenario,
  nodejsStreamScenario,
];

/**
 * Các MỤC của bảng chọn.
 *
 * Kịch bản không khai `group` thì thuộc mục đầu tiên. Thêm một khoá học mới
 * = thêm một dòng ở đây rồi đặt `group` cho kịch bản của khoá đó.
 */
export const SCENARIO_GROUPS: ScenarioGroup[] = [
  {
    id: 'core',
    name: { vi: 'Nền tảng web', en: 'Web fundamentals' },
    blurb: { vi: 'Vòng đời một request, từ trình duyệt tới CSDL', en: 'The life of a request, browser to database' },
    accent: '#38bdf8',
  },
  {
    id: 'nodejs',
    name: { vi: 'Node.js', en: 'Node.js' },
    blurb: { vi: 'Đi kèm khoá Node.js trong Khoá học', en: 'Companion to the Node.js course' },
    accent: '#34d399',
  },
];

export const DEFAULT_GROUP_ID = SCENARIO_GROUPS[0].id;

/** Mục của một kịch bản (kịch bản không khai `group` rơi về mục mặc định). */
export const groupOf = (s: Scenario): string => s.group ?? DEFAULT_GROUP_ID;

/** Kịch bản của một mục, giữ nguyên thứ tự khai báo. */
export function scenariosInGroup(groupId: string): Scenario[] {
  return SCENARIOS.filter((s) => groupOf(s) === groupId);
}

export const DEFAULT_SCENARIO_ID = restApiScenario.id;

export function getScenario(id: string | null | undefined): Scenario {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}

/** Bộ tuỳ chọn mặc định của một kịch bản. */
export function defaultOptions(scenario: Scenario): ScenarioOptions {
  const out: ScenarioOptions = {};
  for (const opt of scenario.options) out[opt.id] = opt.defaultValue;
  return out;
}

/**
 * Làm sạch tuỳ chọn đọc từ URL: mọi giá trị lạ bị thay bằng mặc định.
 * Nhờ vậy một URL sai chính tả vẫn render được thay vì làm trắng trang —
 * quan trọng khi Playwright dựng video hàng loạt từ danh sách URL sinh tự động.
 */
export function sanitizeOptions(scenario: Scenario, raw: Record<string, string | undefined>): ScenarioOptions {
  const out: ScenarioOptions = {};
  for (const opt of scenario.options) {
    const value = raw[opt.id];
    out[opt.id] = opt.choices.some((c) => c.value === value) ? (value as string) : opt.defaultValue;
  }
  return out;
}

/**
 * Dựng danh sách bước ĐÃ GIẢI QUYẾT của một kịch bản.
 *
 * Hàm này là ranh giới tất định của cả trang: cùng (scenario, options) thì
 * luôn ra cùng một mảng bước, cùng thứ tự, cùng thời lượng. Không có
 * Math.random(), không có Date.now() ở bất kỳ đâu bên dưới.
 */
export function resolveSteps(scenario: Scenario, options: ScenarioOptions): SimStep[] {
  return scenario.build(options);
}

/**
 * Bộ panel ĐÃ GIẢI QUYẾT của một kịch bản.
 *
 * Song sinh của `resolveSteps`: cùng (kịch bản, tuỳ chọn) thì luôn ra cùng
 * một bố cục panel. Kịch bản sơ đồ trả về mảng rỗng.
 */
export function resolvePanels(scenario: Scenario, options: ScenarioOptions): PanelSpec[] {
  const p = scenario.panels;
  if (!p) return [];
  return typeof p === 'function' ? p(options) : p;
}

/** Tổng thời lượng hoạt hình (ms, ở tốc độ 1×). */
export function totalDuration(steps: SimStep[]): number {
  return steps.reduce((sum, s) => sum + s.duration, 0);
}
