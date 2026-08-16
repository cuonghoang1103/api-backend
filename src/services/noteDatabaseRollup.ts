/**
 * Quan hệ (RELATION) và số tổng hợp (ROLLUP) giữa hai database của Notes.
 *
 * ─── Vì sao tính ở MÁY CHỦ ───
 * Rollup đọc dữ liệu của một database KHÁC, mà database đó người xem có thể
 * không có quyền mở. Tính ở trình duyệt nghĩa là phải gửi toàn bộ dòng của
 * bảng kia xuống — tức là trao dữ liệu mà người đó không được xem, chỉ để
 * cộng ra một con số. Tính ở đây thì chỉ con số đi ra.
 *
 * Lý do thứ hai: một bảng có sáu khung nhìn và còn được nhúng vào ghi chú.
 * Tính ở client nghĩa là sáu chỗ phải cho ra cùng kết quả, và chỗ nào lệch
 * thì không ai phát hiện.
 *
 * ─── Vì sao rollup KHÔNG lưu vào ô ───
 * Giá trị rollup phụ thuộc vào dòng của bảng khác. Lưu lại nghĩa là mỗi lần
 * ai đó sửa một dòng bên kia, phải đi tìm mọi rollup đang trỏ tới nó mà cập
 * nhật — bỏ sót một chỗ là con số sai nằm im đó mãi. Tính lúc đọc thì không
 * bao giờ cũ.
 */
import { prisma } from '../config/database.js';

/** Phép tổng hợp mà một cột ROLLUP có thể dùng. */
export const ROLLUP_FUNCTIONS = [
  'count', 'countDone', 'countNotEmpty', 'sum', 'average', 'min', 'max',
  'earliestDate', 'latestDate', 'percentDone',
] as const;
export type RollupFunction = (typeof ROLLUP_FUNCTIONS)[number];

export interface RelationConfig {
  /** Database mà cột này trỏ tới. */
  targetDatabaseId: number;
}

export interface RollupConfig {
  /** Cột RELATION nằm CÙNG bảng, dùng để biết lấy dòng nào bên kia. */
  relationPropertyId: number;
  /** Cột bên bảng đích để tổng hợp. `count` không cần cột này. */
  targetPropertyId: number | null;
  fn: RollupFunction;
}

export function parseRelationConfig(config: unknown): RelationConfig | null {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return null;
  const target = Number((config as Record<string, unknown>).targetDatabaseId);
  return Number.isInteger(target) && target > 0 ? { targetDatabaseId: target } : null;
}

export function parseRollupConfig(config: unknown): RollupConfig | null {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return null;
  const c = config as Record<string, unknown>;
  const relationPropertyId = Number(c.relationPropertyId);
  if (!Number.isInteger(relationPropertyId) || relationPropertyId <= 0) return null;
  const fn = String(c.fn ?? 'count') as RollupFunction;
  if (!(ROLLUP_FUNCTIONS as readonly string[]).includes(fn)) return null;
  const targetRaw = Number(c.targetPropertyId);
  return {
    relationPropertyId,
    targetPropertyId: Number.isInteger(targetRaw) && targetRaw > 0 ? targetRaw : null,
    fn,
  };
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toTime(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const t = new Date(String(value)).getTime();
  return Number.isNaN(t) ? null : t;
}

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Một ô được coi là "đã xong" khi nào.
 *
 * CHECKBOX thì hiển nhiên. STATUS thì tra `group === 'done'` trong config —
 * KHÔNG tra theo tên tuỳ chọn, vì tên do người dùng đặt và có thể là "Ship
 * rồi" hay "Đã bàn giao". Đây cũng là lý do cột STATUS mang thêm `group`
 * (xem N4).
 */
function isDone(value: unknown, targetConfig: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string' || value === '') return false;
  const options = (targetConfig && typeof targetConfig === 'object' && !Array.isArray(targetConfig))
    ? (targetConfig as Record<string, unknown>).options
    : null;
  if (!Array.isArray(options)) return false;
  return options.some((option) =>
    option && typeof option === 'object'
    && (option as Record<string, unknown>).name === value
    && (option as Record<string, unknown>).group === 'done');
}

/** Tính một giá trị rollup từ các ô đã lấy được bên bảng đích. */
export function computeRollup(
  fn: RollupFunction,
  values: unknown[],
  targetConfig: unknown,
): number | string | null {
  switch (fn) {
    case 'count':
      return values.length;
    case 'countNotEmpty':
      return values.filter((v) => !isBlank(v)).length;
    case 'countDone':
      return values.filter((v) => isDone(v, targetConfig)).length;
    case 'percentDone': {
      // Không có dòng nào thì trả 0 chứ KHÔNG trả null: một dự án chưa có
      // việc nào đã hoàn thành 0%, và hiện dấu gạch ở cột tiến độ sẽ khiến
      // người dùng tưởng cột hỏng.
      if (values.length === 0) return 0;
      const done = values.filter((v) => isDone(v, targetConfig)).length;
      return Math.round((done / values.length) * 100);
    }
    case 'sum': {
      const nums = values.map(toNumber).filter((n): n is number => n !== null);
      return nums.reduce((a, b) => a + b, 0);
    }
    case 'average': {
      const nums = values.map(toNumber).filter((n): n is number => n !== null);
      if (nums.length === 0) return null;
      // Làm tròn 2 chữ số: trung bình thô ra 33.33333333333333 và cột số
      // trông như bị lỗi.
      return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
    }
    case 'min': {
      const nums = values.map(toNumber).filter((n): n is number => n !== null);
      return nums.length === 0 ? null : Math.min(...nums);
    }
    case 'max': {
      const nums = values.map(toNumber).filter((n): n is number => n !== null);
      return nums.length === 0 ? null : Math.max(...nums);
    }
    case 'earliestDate': {
      const times = values.map(toTime).filter((t): t is number => t !== null);
      return times.length === 0 ? null : new Date(Math.min(...times)).toISOString();
    }
    case 'latestDate': {
      const times = values.map(toTime).filter((t): t is number => t !== null);
      return times.length === 0 ? null : new Date(Math.max(...times)).toISOString();
    }
    default:
      return null;
  }
}

export interface LinkMaps {
  /** propertyId → (fromRowId → danh sách toRowId) */
  forward: Map<number, Map<number, number[]>>;
  /** rowId của bảng ĐÍCH → nhãn hiển thị, để client không phải gọi thêm. */
  labels: Map<number, string>;
}

/**
 * Nạp mọi liên kết của một database, kèm nhãn của các dòng được trỏ tới.
 *
 * Lấy nhãn ngay ở đây thay vì để client tự gọi: một bảng 200 dòng, mỗi dòng
 * trỏ tới 3 việc, sẽ thành 600 lượt gọi nếu client tự tra từng cái.
 */
export async function loadRelationData(
  relationPropertyIds: number[],
  rowIds: number[],
): Promise<LinkMaps> {
  const empty: LinkMaps = { forward: new Map(), labels: new Map() };
  if (relationPropertyIds.length === 0 || rowIds.length === 0) return empty;

  const links = await prisma.noteDatabaseRowLink.findMany({
    where: { propertyId: { in: relationPropertyIds }, fromRowId: { in: rowIds } },
    select: { propertyId: true, fromRowId: true, toRowId: true },
    orderBy: { id: 'asc' },
  });
  if (links.length === 0) return empty;

  const forward = new Map<number, Map<number, number[]>>();
  for (const link of links) {
    let byRow = forward.get(link.propertyId);
    if (!byRow) { byRow = new Map(); forward.set(link.propertyId, byRow); }
    const list = byRow.get(link.fromRowId);
    if (list) list.push(link.toRowId); else byRow.set(link.fromRowId, [link.toRowId]);
  }

  // Nhãn = ô của cột `isTitle` bên bảng đích.
  const targetRowIds = [...new Set(links.map((l) => l.toRowId))];
  const titleCells = await prisma.noteDatabaseCell.findMany({
    where: { rowId: { in: targetRowIds }, property: { isTitle: true } },
    select: { rowId: true, value: true },
  });
  const labels = new Map<number, string>();
  for (const cell of titleCells) {
    const text = cell.value === null || cell.value === undefined ? '' : String(cell.value);
    if (text) labels.set(cell.rowId, text);
  }
  // Dòng chưa đặt tiêu đề vẫn phải có nhãn, nếu không chip hiện ra trống trơn
  // và người dùng không biết mình đang liên kết tới cái gì.
  for (const id of targetRowIds) if (!labels.has(id)) labels.set(id, `Dòng #${id}`);

  return { forward, labels };
}

/**
 * Nạp các ô cần cho mọi cột ROLLUP của một database.
 *
 * Trả về: propertyId của cột rollup → (fromRowId → giá trị đã tính).
 */
export async function computeRollups(
  rollups: { id: number; config: unknown }[],
  links: LinkMaps,
  rowIds: number[],
): Promise<Map<number, Map<number, number | string | null>>> {
  const result = new Map<number, Map<number, number | string | null>>();
  if (rollups.length === 0 || rowIds.length === 0) return result;

  for (const rollup of rollups) {
    const config = parseRollupConfig(rollup.config);
    if (!config) continue;

    const byRow = links.forward.get(config.relationPropertyId) ?? new Map<number, number[]>();

    // `count` không cần đọc ô nào — chỉ đếm liên kết. Tách riêng để một bảng
    // chỉ dùng "đếm việc" không phải chạm vào bảng cells lần nào.
    if (config.fn === 'count' || config.targetPropertyId === null) {
      const values = new Map<number, number | string | null>();
      for (const rowId of rowIds) values.set(rowId, (byRow.get(rowId) ?? []).length);
      result.set(rollup.id, values);
      continue;
    }

    const linkedRowIds = [...new Set([...byRow.values()].flat())];
    if (linkedRowIds.length === 0) {
      const values = new Map<number, number | string | null>();
      for (const rowId of rowIds) values.set(rowId, computeRollup(config.fn, [], null));
      result.set(rollup.id, values);
      continue;
    }

    const [cells, targetProperty] = await Promise.all([
      prisma.noteDatabaseCell.findMany({
        where: { rowId: { in: linkedRowIds }, propertyId: config.targetPropertyId },
        select: { rowId: true, value: true },
      }),
      prisma.noteDatabaseProperty.findUnique({
        where: { id: config.targetPropertyId },
        select: { config: true },
      }),
    ]);
    const cellByRow = new Map(cells.map((c) => [c.rowId, c.value]));

    const values = new Map<number, number | string | null>();
    for (const rowId of rowIds) {
      const linked = byRow.get(rowId) ?? [];
      // Dòng liên kết CHƯA có ô nào ở cột đích vẫn phải được đếm là một dòng
      // (giá trị `null`) — nếu bỏ qua thì "% xong" của một dự án có 5 việc
      // chưa ai đặt trạng thái sẽ tính trên 0 việc và ra 0%, giống hệt như
      // dự án không có việc nào.
      const cellValues = linked.map((id) => cellByRow.get(id) ?? null);
      values.set(rowId, computeRollup(config.fn, cellValues, targetProperty?.config ?? null));
    }
    result.set(rollup.id, values);
  }

  return result;
}
