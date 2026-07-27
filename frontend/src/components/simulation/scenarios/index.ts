/**
 * Sổ đăng ký kịch bản.
 *
 * Thêm một kịch bản mới = tạo file trong thư mục này rồi thêm vào mảng
 * `SCENARIOS`. Không có chỗ nào khác cần sửa: bảng điều khiển, thanh tua,
 * bộ đọc tham số URL và trình vẽ canvas đều đọc từ đây.
 */

import type { Scenario, ScenarioOptions, SimStep } from '../types';
import { restApiScenario } from './restApi';
import { cachingScenario } from './caching';
import { authScenario } from './auth';
import { databaseScenario } from './database';
import { websocketScenario } from './websocket';
import { microservicesScenario } from './microservices';

export const SCENARIOS: Scenario[] = [
  restApiScenario,
  cachingScenario,
  authScenario,
  databaseScenario,
  websocketScenario,
  microservicesScenario,
];

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

/** Tổng thời lượng hoạt hình (ms, ở tốc độ 1×). */
export function totalDuration(steps: SimStep[]): number {
  return steps.reduce((sum, s) => sum + s.duration, 0);
}
