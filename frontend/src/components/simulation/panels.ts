/**
 * PANEL — bảng vẽ cho những gì xảy ra BÊN TRONG một tiến trình.
 * =============================================================
 *
 * Sơ đồ node + cạnh kể rất tốt chuyện "một request đi từ hộp này sang hộp
 * kia". Nó không kể được gì về event loop, ngăn xếp lời gọi, hàng đợi
 * microtask, áp lực ngược của stream, cây node_modules hay đường RSS leo dốc
 * — tức là gần như toàn bộ nửa đầu của một khoá Node.js. Những thứ ấy không
 * có "dây" để gói tin chạy; chúng là ngăn xếp, hàng đợi, mức đầy và số đo.
 *
 * File này định nghĩa nửa còn lại của studio:
 *
 *   PanelSpec  — bố cục tĩnh: panel gì, nằm ở đâu, có mấy làn.
 *   PanelOp    — thao tác một bước gây ra: đẩy vào ngăn xếp, lấy khỏi hàng
 *                đợi, đặt giá trị đồng hồ, thêm điểm vào biểu đồ.
 *   PanelState — trạng thái tại một thời điểm, DẪN XUẤT hoàn toàn từ ops.
 *
 * BA RÀNG BUỘC (giống hệt phần đồ thị, và vì cùng một lý do)
 * ---------------------------------------------------------
 * 1. Trạng thái tại bước i = phát lại ops của bước 0..i. Không giữ state ẩn
 *    giữa hai lần chạy ⇒ kéo thanh tua tới đâu cũng ra đúng khung hình mà
 *    chạy tuần tự sẽ đạt tới, và dựng lại video cho ra file y hệt.
 * 2. Không `Math.random()`, không `Date.now()`.
 * 3. Toạ độ panel dùng hệ SOẠN THẢO 1000×560 y như node, `panelLayout()` ánh
 *    xạ sang pixel — đổi độ phân giải xuất không phải sờ vào dữ liệu kịch bản.
 *
 * Mọi thứ chuyển động đều suy ra từ `bornStep`/`diedStep` của từng phần tử:
 * phần tử sinh ra ở bước đang chạy thì trượt vào, phần tử vừa bị lấy đi thì
 * mờ dần rồi biến mất. Nhờ vậy kịch bản chỉ cần mô tả "đẩy vào / lấy ra",
 * không phải mô tả hoạt ảnh.
 */

import type { I18nText } from './types';

/* ────────────────────────────────────────────────────────────
   PHẦN TỬ
   ──────────────────────────────────────────────────────────── */

/**
 * Sắc thái của một phần tử — quyết định màu viền và màu chữ.
 * Cố ý ít lựa chọn: bảng màu của studio đã chật, thêm sắc thái thứ tám là
 * bắt đầu có hai màu trông giống nhau trên video nén.
 */
export type ItemTone = 'idle' | 'active' | 'ok' | 'warn' | 'err' | 'info' | 'muted';

export interface PanelItem {
  /** Khoá ổn định. Bỏ trống thì hệ thống tự sinh theo vị trí. */
  id?: string;
  label: string;
  /** Dòng phụ nhỏ hơn, ví dụ "setTimeout · 0ms". */
  sub?: string;
  tone?: ItemTone;
  /** Chữ nhỏ ở góc phải, ví dụ số lần thử lại. */
  badge?: string;
  /** Chỉ dùng cho panel bảng: giá trị từng cột. */
  cells?: string[];
  /** Chỉ dùng cho panel cây: độ sâu (0 = gốc). */
  depth?: number;
}

/** Phần tử đã vào trạng thái — có thêm sổ sách để trình vẽ làm hoạt ảnh. */
export interface RuntimeItem extends PanelItem {
  key: string;
  /**
   * Làn chứa phần tử. Ghi lại ngay lúc đẩy vào vì khi phần tử bị lấy ra, nó
   * rời khỏi `items` và chỉ còn nằm trong `leaving` — trình vẽ vẫn phải biết
   * vẽ nó mờ dần Ở LÀN NÀO. (Suy ra lane từ `key` thì hỏng ngay khi kịch bản
   * tự đặt `id` cho phần tử.)
   */
  lane: string;
  bornStep: number;
  /** Có giá trị = phần tử đang RỜI ĐI trong bước này (vẽ mờ dần). */
  diedStep?: number;
}

/* ────────────────────────────────────────────────────────────
   BỐ CỤC TĨNH
   ──────────────────────────────────────────────────────────── */

export interface PanelBase {
  id: string;
  title?: I18nText;
  /** Chú thích nhỏ dưới tiêu đề panel. */
  hint?: I18nText;
  /** Góc trên-trái và kích thước trong hệ soạn thảo 1000 × 560. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Màu nhấn riêng. Bỏ trống thì lấy màu chủ đạo của kịch bản. */
  accent?: string;
}

/** Khung mã nguồn có con trỏ dòng đang chạy. */
export interface CodePanelSpec extends PanelBase {
  kind: 'code';
  lines: string[];
  /** Số dòng đầu tiên hiện ở máng số (mặc định 1). */
  startLine?: number;
  /** Tên file hiện ở thanh tiêu đề nhỏ. */
  file?: string;
}

/** Ngăn xếp lời gọi — phần tử mới nằm TRÊN CÙNG. */
export interface StackPanelSpec extends PanelBase {
  kind: 'stack';
  /** Nhãn đáy ngăn xếp, ví dụ "main()" hoặc "(trống)". */
  floor?: I18nText;
}

export interface LaneSpec {
  id: string;
  label: string;
  sub?: I18nText;
  accent?: string;
}

/**
 * Nhiều hàng đợi song song trong một panel: sáu pha của event loop, bốn
 * luồng threadpool, bốn trạng thái job của BullMQ, tám worker của cluster.
 * Đây là loại panel dùng nhiều nhất trong khoá Node.js.
 */
export interface LanesPanelSpec extends PanelBase {
  kind: 'lanes';
  lanes: LaneSpec[];
  /** 'rows' = mỗi làn một hàng ngang (mặc định); 'cols' = mỗi làn một cột dọc. */
  layout?: 'rows' | 'cols';
  /** Phần tử chạy từ phải sang trái (hàng đợi) hay xếp chồng lên (cột). */
  dense?: boolean;
}

export interface MeterSpec {
  id: string;
  label: string;
  max: number;
  unit?: string;
  /** Vạch ngưỡng, ví dụ highWaterMark 64KB hoặc trần heap. */
  threshold?: number;
  thresholdLabel?: string;
  accent?: string;
}

/** Thanh mức: bộ đệm stream, RAM, số kết nối pool đang bận. */
export interface MeterPanelSpec extends PanelBase {
  kind: 'meter';
  meters: MeterSpec[];
}

export interface SeriesSpec {
  id: string;
  label: string;
  accent?: string;
}

/**
 * Biểu đồ — thứ bắt buộc phải có cho chương 16/17, nơi bài học NẰM trong số
 * đo: 305 → 3.550 req/giây, RSS đi ngang so với leo dốc, brotli q11 chậm 490
 * lần mà file lại to hơn.
 */
export interface ChartPanelSpec extends PanelBase {
  kind: 'chart';
  mode: 'bar' | 'line';
  series?: SeriesSpec[];
  unit?: string;
  /** Trần trục Y. Bỏ trống = tự co theo dữ liệu lớn nhất. */
  max?: number;
  xLabel?: I18nText;
  yLabel?: I18nText;
  /** Chỉ dùng cho 'line': trần trục X (mặc định tự co). */
  xMax?: number;
}

/** Cây: node_modules, phân tầng thư mục, B-Tree. */
export interface TreePanelSpec extends PanelBase {
  kind: 'tree';
}

export interface ColumnSpec {
  key: string;
  label: string;
  /** Tỉ trọng bề rộng (mặc định 1). */
  flex?: number;
  align?: 'left' | 'right';
}

/** Bảng: khoá idempotency đã thấy, tầng cache Docker, bảng so sánh. */
export interface TablePanelSpec extends PanelBase {
  kind: 'table';
  columns: ColumnSpec[];
}

/** Cửa sổ terminal: dòng log chạy dần. */
export interface LogPanelSpec extends PanelBase {
  kind: 'log';
  /** Giữ tối đa bấy nhiêu dòng, cũ nhất bị đẩy ra (mặc định vừa khít panel). */
  maxLines?: number;
  /** Nhãn thanh tiêu đề, ví dụ "node server.js". */
  file?: string;
}

export type PanelSpec =
  | CodePanelSpec
  | StackPanelSpec
  | LanesPanelSpec
  | MeterPanelSpec
  | ChartPanelSpec
  | TreePanelSpec
  | TablePanelSpec
  | LogPanelSpec;

export type PanelKind = PanelSpec['kind'];

/* ────────────────────────────────────────────────────────────
   THAO TÁC
   ──────────────────────────────────────────────────────────── */

/** Làn mặc định của những panel chỉ có một danh sách (stack, log, table…). */
export const MAIN_LANE = '_';

/**
 * Thao tác một bước gây ra trên panel.
 *
 * Trường `p` là id panel — cố tình đặt tên một chữ cái vì mỗi kịch bản viết
 * hàng trăm dòng ops, `{ p: 'stack', op: 'push', … }` đọc nhanh hơn hẳn
 * `{ panelId: 'stack', operation: 'push', … }`.
 */
export type PanelOp =
  /** Thêm phần tử vào cuối làn (ngăn xếp: lên đỉnh; hàng đợi: về cuối). */
  | { p: string; op: 'push'; lane?: string; item: PanelItem | PanelItem[] }
  /** Lấy khỏi CUỐI làn — ngăn xếp trả về, tức là pop đúng nghĩa. */
  | { p: string; op: 'pop'; lane?: string; n?: number }
  /** Lấy khỏi ĐẦU làn — hàng đợi được phục vụ (FIFO). */
  | { p: string; op: 'shift'; lane?: string; n?: number }
  /** Dọn sạch một làn, hoặc cả panel khi bỏ trống `lane`. */
  | { p: string; op: 'clear'; lane?: string }
  /** Đổi sắc thái/nhãn phụ của một phần tử đang có (theo `id`). */
  | { p: string; op: 'tone'; lane?: string; key: string; tone?: ItemTone; badge?: string; sub?: string }
  /** Làn / hàng đang được chiếu sáng. `null` = tắt hết. */
  | { p: string; op: 'active'; value: string | null }
  /** Dòng mã đang chạy (đánh số theo `startLine`). Mảng rỗng = không dòng nào. */
  | { p: string; op: 'lines'; value: number[] }
  /** Đặt giá trị một đồng hồ đo hoặc một cột của biểu đồ cột. */
  | { p: string; op: 'value'; key: string; value: number; label?: string; tone?: ItemTone }
  /** Thêm một điểm vào đường của biểu đồ đường. */
  | { p: string; op: 'point'; key: string; x: number; y: number };

/* ────────────────────────────────────────────────────────────
   TRẠNG THÁI
   ──────────────────────────────────────────────────────────── */

export interface MeterValue {
  value: number;
  /** Giá trị TRƯỚC bước hiện tại — trình vẽ nội suy để kim chạy mượt. */
  prev: number;
  label?: string;
  tone?: ItemTone;
  bornStep: number;
}

export interface PanelRuntime {
  /** Phần tử theo làn. Panel một danh sách dùng khoá `MAIN_LANE`. */
  items: Record<string, RuntimeItem[]>;
  /** Phần tử vừa bị lấy đi TRONG BƯỚC NÀY — vẽ mờ dần rồi thôi. */
  leaving: RuntimeItem[];
  active: string | null;
  lines: number[];
  values: Record<string, MeterValue>;
  points: Record<string, { x: number; y: number }[]>;
}

export type PanelState = Record<string, PanelRuntime>;

function emptyRuntime(): PanelRuntime {
  return { items: {}, leaving: [], active: null, lines: [], values: {}, points: {} };
}

/** Trạng thái rỗng cho một bộ panel. */
export function initialPanelState(panels: PanelSpec[]): PanelState {
  const out: PanelState = {};
  for (const p of panels) out[p.id] = emptyRuntime();
  return out;
}

function laneOf(rt: PanelRuntime, lane: string | undefined): RuntimeItem[] {
  const id = lane ?? MAIN_LANE;
  if (!rt.items[id]) rt.items[id] = [];
  return rt.items[id];
}

/**
 * Áp một danh sách ops lên trạng thái. `state` bị SỬA TẠI CHỖ — hàm này chỉ
 * được gọi từ `panelStateAt()` trên bản sao dựng riêng cho lần tính đó, nên
 * không có ai khác nhìn thấy trạng thái trung gian.
 */
function applyOps(state: PanelState, ops: PanelOp[], stepIndex: number) {
  for (const op of ops) {
    const rt = state[op.p] ?? (state[op.p] = emptyRuntime());

    switch (op.op) {
      case 'push': {
        const list = laneOf(rt, op.lane);
        const items = Array.isArray(op.item) ? op.item : [op.item];
        const lane = op.lane ?? MAIN_LANE;
        items.forEach((it, i) => {
          list.push({
            ...it,
            key: it.id ?? `${op.p}:${lane}:${stepIndex}:${list.length + i}`,
            lane,
            bornStep: stepIndex,
          });
        });
        break;
      }

      case 'pop': {
        const list = laneOf(rt, op.lane);
        const n = Math.min(op.n ?? 1, list.length);
        for (let i = 0; i < n; i++) {
          const gone = list.pop();
          if (gone) rt.leaving.push({ ...gone, diedStep: stepIndex });
        }
        break;
      }

      case 'shift': {
        const list = laneOf(rt, op.lane);
        const n = Math.min(op.n ?? 1, list.length);
        for (let i = 0; i < n; i++) {
          const gone = list.shift();
          if (gone) rt.leaving.push({ ...gone, diedStep: stepIndex });
        }
        break;
      }

      case 'clear': {
        if (op.lane) {
          const list = laneOf(rt, op.lane);
          for (const gone of list) rt.leaving.push({ ...gone, diedStep: stepIndex });
          rt.items[op.lane] = [];
        } else {
          for (const list of Object.values(rt.items)) {
            for (const gone of list) rt.leaving.push({ ...gone, diedStep: stepIndex });
          }
          rt.items = {};
        }
        break;
      }

      case 'tone': {
        // Tìm trong làn được chỉ định, hoặc trong TẤT CẢ các làn khi bỏ trống:
        // kịch bản thường biết id phần tử mà không muốn nhớ nó đang nằm làn nào
        // (một job vừa chuyển từ 'waiting' sang 'active' chẳng hạn).
        const lanes = op.lane ? [laneOf(rt, op.lane)] : Object.values(rt.items);
        for (const list of lanes) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].key !== op.key) continue;
            list[i] = {
              ...list[i],
              ...(op.tone ? { tone: op.tone } : {}),
              ...(op.badge !== undefined ? { badge: op.badge } : {}),
              ...(op.sub !== undefined ? { sub: op.sub } : {}),
            };
          }
        }
        break;
      }

      case 'active':
        rt.active = op.value;
        break;

      case 'lines':
        rt.lines = op.value;
        break;

      case 'value': {
        const prev = rt.values[op.key]?.value ?? 0;
        rt.values[op.key] = {
          value: op.value,
          prev,
          label: op.label,
          tone: op.tone,
          bornStep: stepIndex,
        };
        break;
      }

      case 'point': {
        if (!rt.points[op.key]) rt.points[op.key] = [];
        rt.points[op.key].push({ x: op.x, y: op.y });
        break;
      }
    }
  }
}

/**
 * Trạng thái panel cộng dồn tới bước `index`.
 *
 * Phát lại từ bước 0 mỗi lần — đắt hơn giữ state ẩn, nhưng kịch bản dài nhất
 * cũng chỉ vài chục bước với vài trăm ops, và đổi lại là thanh tua nhảy tới
 * bất kỳ đâu cũng đúng tuyệt đối. `SimulationStage` còn nhớ đệm kết quả theo
 * chỉ số bước nên thực tế mỗi bước chỉ tính một lần.
 *
 * `leaving` được dọn TRƯỚC mỗi bước: phần tử rời đi chỉ sống đúng một bước,
 * vừa đủ để trình vẽ cho nó mờ dần.
 */
export function panelStateAt(
  panels: PanelSpec[],
  steps: { ops?: PanelOp[] }[],
  index: number
): PanelState {
  const state = initialPanelState(panels);
  for (let i = 0; i <= index && i < steps.length; i++) {
    for (const rt of Object.values(state)) rt.leaving = [];
    const ops = steps[i].ops;
    if (ops?.length) applyOps(state, ops, i);
  }
  return state;
}
