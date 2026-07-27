/**
 * Code & Network Animation Studio — mô hình dữ liệu
 * ================================================
 *
 * Toàn bộ trang /simulation chạy trên MỘT cấu trúc duy nhất: `Scenario`.
 * Một kịch bản = sơ đồ tĩnh (nodes + edges) + hàm `build()` sinh ra danh
 * sách `SimStep` từ các tuỳ chọn người dùng chọn (method, status, hit/miss…).
 *
 * Vì `build()` là hàm thuần (pure), việc đổi tuỳ chọn chỉ đơn giản là dựng
 * lại mảng step — không có state ẩn nào tồn tại giữa hai lần chạy. Đó là
 * điều kiện tiên quyết để thanh tua (scrubber) hoạt động chính xác: trạng
 * thái tại step `i` LUÔN suy ra được bằng cách phát lại step 0..i.
 */

import type { LucideIcon } from 'lucide-react';

/** Ngôn ngữ hiển thị của studio. Nội dung giảng dạy được viết song ngữ. */
export type Lang = 'vi' | 'en';

/** Một chuỗi song ngữ. Dùng `tr(value, lang)` để lấy bản dịch. */
export interface I18nText {
  vi: string;
  en: string;
}

export const tr = (t: I18nText | undefined, lang: Lang): string =>
  t ? t[lang] ?? t.vi : '';

/* ────────────────────────────────────────────────────────────
   SƠ ĐỒ MẠNG
   ──────────────────────────────────────────────────────────── */

/** Loại node — quyết định icon, màu viền và hình dạng khi vẽ. */
export type NodeKind =
  | 'client' // trình duyệt / app
  | 'edge' // CDN, reverse proxy, load balancer
  | 'gateway' // API gateway
  | 'server' // API / service
  | 'cache' // Redis, in-memory
  | 'db' // PostgreSQL, MongoDB
  | 'queue' // RabbitMQ / Kafka
  | 'worker' // consumer / background job
  | 'auth' // auth service / token issuer
  | 'socket' // WebSocket hub
  | 'storage' // object storage: R2, S3
  | 'ci' // runner CI/CD, registry ảnh
  | 'index'; // chỉ mục B-Tree / storage engine

/** Trạng thái trực quan của một node tại một thời điểm. */
export type NodeState =
  | 'idle' // im lặng, mờ
  | 'active' // đang là trọng tâm
  | 'processing' // vòng xoay xử lý
  | 'success' // nhấp nháy xanh
  | 'error' // rung + viền đỏ
  | 'waiting'; // đang chờ I/O (nhịp chậm)

export interface SimNode {
  id: string;
  /** Nhãn ngắn, luôn là thuật ngữ kỹ thuật (không dịch): "Redis", "API". */
  label: string;
  /** Dòng phụ có dịch: "Bộ nhớ đệm" / "In-memory cache". */
  sublabel?: I18nText;
  kind: NodeKind;
  /** Toạ độ tâm node trong hệ viewBox của sân khấu (STAGE_W × STAGE_H). */
  x: number;
  y: number;
  /** Ghi chú nhỏ hiện dưới node (ví dụ "p95 12ms"). */
  badge?: string;
}

export interface SimEdge {
  id: string;
  from: string;
  to: string;
  /**
   * Độ cong: dịch điểm điều khiển Bézier theo phương vuông góc.
   * Dương = cong lên/sang trái so với hướng đi. 0 = đường thẳng.
   * Dùng để tách hai cạnh song song ngược chiều (request vs response).
   */
  curve?: number;
  /** Cạnh phụ trợ (vẽ nét đứt mờ): pub/sub, replication… */
  ghost?: boolean;
  label?: I18nText;
}

/* ────────────────────────────────────────────────────────────
   BƯỚC MÔ PHỎNG
   ──────────────────────────────────────────────────────────── */

/**
 * Loại luồng dữ liệu — quyết định MÀU của gói tin và của tia sáng chạy
 * trên dây. Bảng màu kỹ thuật nằm ở `theme.ts`.
 */
export type FlowKind =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'RESPONSE'
  | 'ERROR'
  | 'CACHE_HIT'
  | 'CACHE_MISS'
  | 'EVENT'
  | 'TOKEN'
  | 'QUERY'
  | 'ACK'
  | 'INTERNAL';

/** Tên hiệu ứng âm thanh do `useSoundEngine` tổng hợp bằng Web Audio API. */
export type SfxName =
  | 'click'
  | 'swoosh'
  | 'ping'
  | 'success'
  | 'error'
  | 'buzz'
  | 'blip'
  | 'stream'
  | 'lock';

/** Một gói tin đứng yên trên dây — xem `SimStep.alsoInFlight`. */
export interface GhostPacket {
  edge: string;
  /** Vị trí cố định trên đường, 0 = đầu cạnh, 1 = cuối cạnh. */
  at: number;
  reverse?: boolean;
  label?: string;
  /** Bỏ trống thì dùng luôn `kind` của bước. */
  kind?: FlowKind;
}

export interface SimStep {
  id: string;
  title: I18nText;
  /** Lời giảng cho bước này — hiện ở Inspector, là "kịch bản" khi quay video. */
  detail: I18nText;

  /** Cạnh mà gói tin chạy qua. Bỏ trống = bước xử lý nội bộ tại 1 node. */
  edge?: string;
  /** true = gói tin chạy ngược chiều cạnh (to → from). */
  reverse?: boolean;
  /** Node diễn ra xử lý nội bộ (khi không có `edge`). */
  at?: string;

  kind: FlowKind;
  /** Thời lượng hoạt ảnh ở tốc độ 1×, tính bằng ms. */
  duration: number;
  /** Độ trễ mô phỏng hiển thị ở Inspector (ms). */
  latencyMs?: number;

  /** Chữ trên viên gói tin: "GET /posts", "JWT", "SET key". */
  packetLabel?: string;
  /** Thân JSON hiện ở Inspector. */
  payload?: unknown;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  status?: number;

  /** Trạng thái node được ÁP DỤNG khi bước bắt đầu (cộng dồn theo thời gian). */
  nodeStates?: Record<string, NodeState>;

  /**
   * Gói tin PHỤ đứng yên trên dây trong lúc bước này chạy.
   *
   * Engine chỉ có MỘT gói tin chuyển động (gói của bước hiện tại). Nhưng có
   * những bài học chỉ kể được khi nhiều gói cùng lơ lửng một lúc: người dùng
   * bấm "Mua ngay" lần thứ hai TRONG KHI request thứ nhất còn chưa tới nơi.
   * Vẽ chúng đứng yên là đúng bản chất — chúng đang kẹt chờ, không đi tới đâu.
   */
  alsoInFlight?: GhostPacket[];

  sfx?: SfxName;
  /** Dòng log kiểu DevTools/terminal. */
  log?: I18nText;
  /**
   * Gợi ý cho giảng viên: "dừng ở đây để giải thích CORS".
   * Hiện thành thẻ vàng ở Inspector và chấm cảnh báo trên thanh tua.
   */
  teachingNote?: I18nText;
}

/* ────────────────────────────────────────────────────────────
   KỊCH BẢN
   ──────────────────────────────────────────────────────────── */

export interface ScenarioChoice {
  value: string;
  /** Nhãn ngắn trên nút chọn — thuật ngữ, không dịch. */
  label: string;
  /**
   * Nhãn đầy đủ hiện ở dòng mô tả khi lựa chọn này đang được chọn.
   * Dùng khi nhãn chuẩn quá dài cho nút bấm ("422 Unprocessable Entity"
   * không vừa cột 300px, nhưng vẫn cần đọc được ở đâu đó).
   */
  fullLabel?: string;
  /** Màu riêng cho lựa chọn (ví dụ DELETE = đỏ). */
  color?: string;
  hint?: I18nText;
  /**
   * Tên nhóm. Khi có, bảng điều khiển tự gom các lựa chọn theo nhóm —
   * cần thiết khi danh sách dài (14 mã HTTP gom thành 2xx/3xx/4xx/5xx).
   */
  group?: I18nText;
}

export interface ScenarioOption {
  id: string;
  label: I18nText;
  choices: ScenarioChoice[];
  /** Giá trị mặc định — phải khớp một `choices[].value`. */
  defaultValue: string;
}

export type ScenarioOptions = Record<string, string>;

export interface Scenario {
  id: string;
  name: I18nText;
  tagline: I18nText;
  icon: LucideIcon;
  /** Màu chủ đạo (hex) dùng cho viền glow của thẻ kịch bản. */
  accent: string;
  nodes: SimNode[];
  edges: SimEdge[];
  options: ScenarioOption[];
  /** Sinh danh sách bước từ tuỳ chọn. PHẢI là hàm thuần. */
  build: (opts: ScenarioOptions) => SimStep[];
}

/**
 * Hệ toạ độ SOẠN THẢO của sân khấu (không phải pixel).
 *
 * Kịch bản đặt node trong hệ 1000 × 560 cho dễ đọc; `layout.ts` ánh xạ hệ
 * này sang khung canvas 1920 × 1080 thật. Tách hai hệ ra để đổi độ phân giải
 * xuất video sau này không phải sờ vào một dòng dữ liệu kịch bản nào.
 */
export const STAGE_W = 1000;
export const STAGE_H = 560;
