/**
 * Notes Databases (Phase 5)
 * =========================
 *
 * Typed, Notion-style databases that live inside a NoteSubject. Access is
 * inherited from the subject's share, so a database is reachable by exactly
 * the people who can already reach that folder's notes — there is no second
 * permission system to keep in sync.
 *
 *   viewer / commenter : read
 *   editor / owner     : read + write
 *
 * Cells are stored one row per (row, property) and are DELETED when cleared,
 * so "empty" has a single representation. Reading a database therefore never
 * has to distinguish SQL NULL from JSON null from missing.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { canEditSharedNote, checkNoteAccess } from './notesShare.service.js';

// ─── Property types ───────────────────────────────────────────

export const DATABASE_PROPERTY_TYPES = [
  'TITLE', 'TEXT', 'NUMBER', 'SELECT', 'MULTI_SELECT', 'DATE', 'CHECKBOX', 'URL',
  // 17/08/2026 — sáu kiểu bổ sung. Cột `type` là VARCHAR chứ không phải enum
  // Postgres, nên thêm ở đây là đủ, KHÔNG cần migration.
  'STATUS', 'PERSON', 'EMAIL', 'FILE', 'CREATED_TIME', 'LAST_EDITED_TIME',
] as const;
export type DatabasePropertyType = (typeof DATABASE_PROPERTY_TYPES)[number];

/**
 * Kiểu TÍNH RA, không lưu: giá trị luôn đến từ `createdAt`/`updatedAt` của
 * chính dòng đó.
 *
 * Ghi vào những cột này bị BỎ QUA chứ không báo lỗi. Chỗ khác trong tệp này
 * cố ý ném lỗi thay vì âm thầm ép kiểu (một cột NUMBER nhận "abc" thành 0 sẽ
 * làm hỏng mọi phép cộng về sau), nhưng ở đây khác hẳn: client gửi lại NGUYÊN
 * bản đồ `values` khi sửa một ô bất kỳ, nên ném lỗi nghĩa là không sửa nổi
 * dòng nào chừng nào bảng còn một cột thời gian. Không ghi được là ĐỊNH NGHĨA
 * của cột, không phải dữ liệu hỏng.
 */
export const COMPUTED_PROPERTY_TYPES = new Set<DatabasePropertyType>([
  'CREATED_TIME', 'LAST_EDITED_TIME',
]);

export const DATABASE_VIEW_TYPES = ['TABLE', 'BOARD', 'CALENDAR', 'GALLERY', 'TIMELINE'] as const;
export type DatabaseViewType = (typeof DATABASE_VIEW_TYPES)[number];

function assertId(value: number, label = 'id') {
  if (!Number.isInteger(value) || value <= 0) {
    throw new AppError(`${label} không hợp lệ`, 400, 'INVALID_ID');
  }
}

function cleanText(value: unknown, max: number, label: string): string {
  const text = String(value ?? '').trim();
  if (!text) throw new AppError(`${label} không được để trống`, 400, 'EMPTY_FIELD');
  return text.slice(0, max);
}

function parsePropertyType(value: unknown): DatabasePropertyType {
  const type = String(value ?? '').toUpperCase();
  if (!(DATABASE_PROPERTY_TYPES as readonly string[]).includes(type)) {
    throw new AppError(`Kiểu thuộc tính không hỗ trợ: ${type}`, 400, 'INVALID_PROPERTY_TYPE');
  }
  return type as DatabasePropertyType;
}

function parseViewType(value: unknown): DatabaseViewType {
  const type = String(value ?? 'TABLE').toUpperCase();
  if (!(DATABASE_VIEW_TYPES as readonly string[]).includes(type)) {
    throw new AppError(`Kiểu khung nhìn không hỗ trợ: ${type}`, 400, 'INVALID_VIEW_TYPE');
  }
  return type as DatabaseViewType;
}

/** Option list for SELECT / MULTI_SELECT, read out of the property config. */
function configOptions(config: Prisma.JsonValue | null): string[] | null {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return null;
  const raw = (config as Record<string, unknown>).options;
  if (!Array.isArray(raw)) return null;
  const options = raw
    .map((option) => {
      if (typeof option === 'string') return option;
      if (option && typeof option === 'object') {
        const name = (option as Record<string, unknown>).name;
        return typeof name === 'string' ? name : null;
      }
      return null;
    })
    .filter((option): option is string => Boolean(option));
  return options.length > 0 ? options : null;
}

/**
 * Parse a number typed by a human, in either Vietnamese or English notation.
 *
 * Vietnamese uses the separators the opposite way round from English:
 * `1.750.000` is one and three-quarter million, and `12,5` is twelve and a
 * half. Stripping commas the English way turned `12,5` into 125 — a silent
 * factor-of-ten error in a column people do arithmetic on.
 *
 * Rules, applied in order:
 *   - both separators present → the LAST one is the decimal point
 *   - one separator, repeated → grouping  (1.750.000 · 1,750,000)
 *   - one separator, once, followed by exactly 3 digits → grouping, because
 *     `1,750` and `1.750` both overwhelmingly mean one thousand seven fifty
 *   - otherwise → decimal point  (12,5 · 12.5 · 12,50)
 */
export function parseLocaleNumber(input: string): number {
  const text = input.replace(/[\s  ]/g, '').trim();
  if (!text) return Number.NaN;
  if (!/^[+-]?[\d.,]+$/.test(text)) return Number.NaN;

  const lastComma = text.lastIndexOf(',');
  const lastDot = text.lastIndexOf('.');
  const cut = Math.max(lastComma, lastDot);
  if (cut === -1) return Number(text);

  const separator = lastComma > lastDot ? ',' : '.';
  const occurrences = text.split(separator).length - 1;
  const trailing = text.length - cut - 1;
  const bothPresent = lastComma !== -1 && lastDot !== -1;
  // A thousands group never has a leading zero: `0,001` is one thousandth,
  // not the number 1. Without this guard the 3-digit rule below swallowed it.
  const leadingGroup = text.slice(0, cut).replace(/^[+-]/, '');
  const groupable = leadingGroup.length > 0 && !leadingGroup.startsWith('0');
  const isGrouping = !bothPresent && groupable && (occurrences > 1 || trailing === 3);

  if (isGrouping) return Number(text.replace(/[.,]/g, ''));
  return Number(`${text.slice(0, cut).replace(/[.,]/g, '')}.${text.slice(cut + 1)}`);
}

/**
 * Coerce a raw cell value to its column's type.
 *
 * Returns `null` for "clear this cell". Throwing on a bad value rather than
 * silently coercing matters here: a NUMBER column that quietly accepted
 * "abc" as 0 would corrupt every later sum without ever showing an error.
 */
export function normalizeCellValue(
  type: DatabasePropertyType,
  raw: unknown,
  config: Prisma.JsonValue | null = null,
): Prisma.InputJsonValue | null {
  if (raw === null || raw === undefined || raw === '') return null;

  switch (type) {
    case 'TITLE':
    case 'TEXT':
      return String(raw).slice(0, 2000);

    case 'URL': {
      const url = String(raw).trim().slice(0, 2000);
      if (!url) return null;
      // Reject anything that is not http(s): a stored `javascript:` URL would
      // be rendered as a clickable link for every viewer of a shared database.
      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch {
        throw new AppError('Địa chỉ URL không hợp lệ', 400, 'INVALID_URL');
      }
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new AppError('URL chỉ chấp nhận http hoặc https', 400, 'INVALID_URL_PROTOCOL');
      }
      return parsed.toString();
    }

    case 'NUMBER': {
      const numeric = typeof raw === 'number' ? raw : parseLocaleNumber(String(raw));
      if (!Number.isFinite(numeric)) {
        throw new AppError('Giá trị số không hợp lệ', 400, 'INVALID_NUMBER');
      }
      return numeric;
    }

    case 'CHECKBOX':
      if (typeof raw === 'boolean') return raw;
      return ['true', '1', 'yes', 'on'].includes(String(raw).toLowerCase());

    case 'DATE': {
      const date = new Date(String(raw));
      if (Number.isNaN(date.getTime())) {
        throw new AppError('Ngày không hợp lệ', 400, 'INVALID_DATE');
      }
      return date.toISOString();
    }

    case 'SELECT': {
      const option = String(raw).trim().slice(0, 200);
      if (!option) return null;
      const allowed = configOptions(config);
      if (allowed && !allowed.includes(option)) {
        throw new AppError(`Lựa chọn "${option}" không có trong cột này`, 400, 'INVALID_SELECT_OPTION');
      }
      return option;
    }

    case 'MULTI_SELECT': {
      if (!Array.isArray(raw)) {
        throw new AppError('Cột nhiều lựa chọn cần một mảng', 400, 'INVALID_MULTI_SELECT');
      }
      const allowed = configOptions(config);
      const picked = [...new Set(
        raw.map((option) => String(option).trim().slice(0, 200)).filter(Boolean),
      )].slice(0, 50);
      if (allowed) {
        const unknown = picked.find((option) => !allowed.includes(option));
        if (unknown) {
          throw new AppError(`Lựa chọn "${unknown}" không có trong cột này`, 400, 'INVALID_SELECT_OPTION');
        }
      }
      return picked.length > 0 ? picked : null;
    }

    /* STATUS dùng chung luật với SELECT nhưng khác Ý NGHĨA: `config.options`
     * của nó mang thêm `group` (todo / doing / done) để Board gom cột và để
     * thanh tiến độ biết đâu là "xong". Phần kiểm hợp lệ thì y hệt, nên gọi
     * lại chứ không chép. */
    case 'STATUS': {
      const option = String(raw).trim().slice(0, 200);
      if (!option) return null;
      const allowed = configOptions(config);
      if (allowed && !allowed.includes(option)) {
        throw new AppError(`Trạng thái "${option}" không có trong cột này`, 400, 'INVALID_STATUS_OPTION');
      }
      return option;
    }

    case 'EMAIL': {
      const email = String(raw).trim().slice(0, 320).toLowerCase();
      if (!email) return null;
      /* Kiểm bằng regex CỐ Ý lỏng. Địa chỉ email hợp lệ theo RFC 5322 gồm cả
       * dấu ngoặc kép, chú thích và ký tự quốc tế; một regex "chặt" luôn từ
       * chối nhầm địa chỉ thật, mà từ chối nhầm ở đây thì người dùng không
       * lưu nổi dữ liệu của chính họ. Ở đây chỉ chặn thứ rõ ràng không phải
       * email; muốn biết địa chỉ có thật hay không thì phải gửi thư. */
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new AppError('Địa chỉ email không hợp lệ', 400, 'INVALID_EMAIL');
      }
      return email;
    }

    /* PERSON lưu MẢNG ID người dùng, không lưu tên.
     *
     * Lưu tên kèm theo sẽ nhanh hơn lúc hiển thị nhưng nó đóng băng tại thời
     * điểm gán: người dùng đổi tên là mọi dòng cũ vẫn gọi họ bằng tên cũ, và
     * không có cách nào biết dòng nào cần sửa. Tên tra ở phía client từ danh
     * sách thành viên của môn (GET .../people).
     *
     * KHÔNG kiểm ở đây rằng id đó có quyền vào môn: kiểm được thì tốt, nhưng
     * nó cần một truy vấn cho mỗi ô được ghi, và hậu quả của việc gán nhầm
     * một người ngoài chỉ là một cái tên không tra được — trong khi chi phí
     * là mọi thao tác sửa bảng chậm đi. */
    case 'PERSON': {
      const list = Array.isArray(raw) ? raw : [raw];
      const ids = [...new Set(
        list.map((item) => Number(typeof item === 'object' && item !== null ? (item as { id?: unknown }).id : item))
            .filter((id) => Number.isInteger(id) && id > 0),
      )].slice(0, 20);
      return ids.length > 0 ? ids : null;
    }

    /* FILE lưu mảng { url, name, size, mime }. Tệp đã nằm trên R2 qua luồng
     * /files/upload sẵn có — ở đây chỉ ghi lại địa chỉ. */
    case 'FILE': {
      const list = Array.isArray(raw) ? raw : [raw];
      const files = list
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const f = item as Record<string, unknown>;
          const url = String(f.url ?? '').trim().slice(0, 2000);
          if (!url) return null;
          // Cùng lý do với cột URL: một địa chỉ `javascript:` được lưu ở đây
          // sẽ thành liên kết bấm được cho MỌI người xem bảng chia sẻ.
          let parsed: URL;
          try { parsed = new URL(url); } catch { return null; }
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
          return {
            url: parsed.toString(),
            name: String(f.name ?? '').slice(0, 300),
            size: Number.isFinite(Number(f.size)) ? Number(f.size) : null,
            mime: String(f.mime ?? '').slice(0, 150),
          };
        })
        .filter((f): f is NonNullable<typeof f> => f !== null)
        .slice(0, 10);
      return files.length > 0 ? files : null;
    }

    case 'CREATED_TIME':
    case 'LAST_EDITED_TIME':
      // Tính ra lúc đọc — xem COMPUTED_PROPERTY_TYPES. Không bao giờ lưu.
      return null;

    default:
      return String(raw).slice(0, 2000);
  }
}


/**
 * Tiêm giá trị của các cột TÍNH RA vào bản đồ `values` của một dòng.
 *
 * Làm ở tầng đọc chứ không bắt client tự suy: nếu để client tự lấy
 * `row.createdAt` khi thấy cột kiểu CREATED_TIME thì mỗi nơi hiển thị bảng
 * (bảng, board, lịch, gallery, timeline, khối nhúng trong ghi chú) phải nhớ
 * làm đúng như nhau, và chỗ nào quên thì cột đó rỗng mà không ai biết vì sao.
 * Ở đây nó là một dòng, ở đó nó là sáu chỗ phải đồng bộ.
 */
function withComputedValues<T extends { createdAt: Date; updatedAt: Date; values: Record<string, unknown> }>(
  row: T,
  properties: { id: number; type: string }[],
): T {
  for (const property of properties) {
    if (property.type === 'CREATED_TIME') row.values[property.id] = row.createdAt.toISOString();
    else if (property.type === 'LAST_EDITED_TIME') row.values[property.id] = row.updatedAt.toISOString();
  }
  return row;
}

// ─── Access ───────────────────────────────────────────────────

async function assertSubjectAccess(userId: number, subjectId: number, write: boolean) {
  assertId(subjectId, 'subjectId');
  const access = await checkNoteAccess(userId, subjectId);
  if (!access.hasAccess || !access.permission) {
    throw new AppError('Bạn không có quyền truy cập môn học này', 403, 'ACCESS_DENIED');
  }
  if (write && !canEditSharedNote(access.permission)) {
    throw new AppError('Bạn cần quyền chỉnh sửa', 403, 'EDIT_PERMISSION_REQUIRED');
  }
  return access;
}

/** Resolve a database and the caller's rights on it in one step. */
async function assertDatabaseAccess(userId: number, databaseId: number, write: boolean) {
  assertId(databaseId, 'databaseId');
  const database = await prisma.noteDatabase.findUnique({
    where: { id: databaseId },
    select: { id: true, subjectId: true, userId: true },
  });
  if (!database) throw new AppError('Cơ sở dữ liệu không tồn tại', 404, 'DATABASE_NOT_FOUND');
  const access = await assertSubjectAccess(userId, database.subjectId, write);
  return { database, access };
}

async function propertyDatabaseId(propertyId: number) {
  assertId(propertyId, 'propertyId');
  const property = await prisma.noteDatabaseProperty.findUnique({
    where: { id: propertyId },
    select: { id: true, databaseId: true, type: true, config: true, isTitle: true },
  });
  if (!property) throw new AppError('Thuộc tính không tồn tại', 404, 'PROPERTY_NOT_FOUND');
  return property;
}

// ─── Databases ────────────────────────────────────────────────

const databaseInclude = {
  properties: { orderBy: { sortOrder: 'asc' as const } },
  views: { orderBy: { sortOrder: 'asc' as const } },
} satisfies Prisma.NoteDatabaseInclude;

export async function listDatabases(userId: number, subjectId: number) {
  await assertSubjectAccess(userId, subjectId, false);
  return prisma.noteDatabase.findMany({
    where: { subjectId },
    orderBy: { updatedAt: 'desc' },
    include: {
      properties: { orderBy: { sortOrder: 'asc' } },
      views: { orderBy: { sortOrder: 'asc' } },
      _count: { select: { rows: true } },
    },
  });
}

/**
 * A database is unusable without a title column and somewhere to show it, so
 * both are created up front rather than left for the caller to remember.
 */
export async function createDatabase(
  userId: number,
  input: { subjectId?: unknown; title?: unknown; description?: unknown; icon?: unknown },
) {
  const subjectId = Number(input.subjectId);
  const access = await assertSubjectAccess(userId, subjectId, true);
  const title = cleanText(input.title ?? 'Cơ sở dữ liệu mới', 200, 'Tiêu đề');

  return prisma.$transaction(async (tx) => {
    const database = await tx.noteDatabase.create({
      data: {
        // Owned by the subject owner, matching how notes work, so a database
        // does not vanish from the folder when a collaborator's share ends.
        userId: access.ownerId,
        subjectId,
        title,
        description: input.description == null ? null : String(input.description).slice(0, 2000),
        icon: input.icon == null ? null : String(input.icon).slice(0, 30),
      },
    });
    await tx.noteDatabaseProperty.create({
      data: { databaseId: database.id, name: 'Tên', type: 'TITLE', isTitle: true, sortOrder: 0 },
    });
    await tx.noteDatabaseView.create({
      data: {
        databaseId: database.id,
        name: 'Bảng',
        type: 'TABLE',
        isDefault: true,
        sortOrder: 0,
        config: { hiddenPropertyIds: [], sorts: [], filters: [] },
      },
    });
    return tx.noteDatabase.findUniqueOrThrow({ where: { id: database.id }, include: databaseInclude });
  });
}

export async function getDatabase(userId: number, databaseId: number) {
  const { database } = await assertDatabaseAccess(userId, databaseId, false);
  const [full, rows] = await Promise.all([
    prisma.noteDatabase.findUniqueOrThrow({ where: { id: database.id }, include: databaseInclude }),
    prisma.noteDatabaseRow.findMany({
      where: { databaseId: database.id },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      include: { cells: { select: { propertyId: true, value: true } } },
      take: 5000,
    }),
  ]);

  // Flatten cells into a propertyId → value map so the client never has to
  // scan an array per cell to render one row.
  return {
    ...full,
    rows: rows.map((row) => withComputedValues({
      id: row.id,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      values: Object.fromEntries(row.cells.map((cell) => [cell.propertyId, cell.value])) as Record<string, unknown>,
    }, full.properties)),
  };
}

/**
 * Những người có thể gán vào cột PERSON của một bảng: chủ môn + mọi người
 * được chia sẻ môn đó.
 *
 * Gác bằng quyền truy cập BẢNG chứ không bằng quyền sở hữu môn. `listSubjectShares`
 * sẵn có chỉ cho chủ môn gọi, nên dùng nó thì một người được chia sẻ quyền sửa
 * sẽ thấy ô chọn người rỗng — họ sửa được bảng nhưng không gán được việc cho ai,
 * kể cả cho chính mình.
 */
export async function listDatabasePeople(userId: number, databaseId: number) {
  const { database } = await assertDatabaseAccess(userId, databaseId, false);

  const [subject, shares] = await Promise.all([
    prisma.noteSubject.findUniqueOrThrow({
      where: { id: database.subjectId },
      select: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
    }),
    prisma.noteSubjectShare.findMany({
      where: { subjectId: database.subjectId },
      select: { recipient: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
    }),
  ]);

  // `Map` theo id để chủ môn không xuất hiện hai lần khi họ cũng nằm trong
  // danh sách chia sẻ (tự chia sẻ cho chính mình là chuyện có thật).
  const people = new Map<number, { id: number; username: string; displayName: string | null; avatarUrl: string | null }>();
  people.set(subject.user.id, subject.user);
  for (const share of shares) {
    if (share.recipient) people.set(share.recipient.id, share.recipient);
  }
  return [...people.values()];
}

export async function updateDatabase(
  userId: number,
  databaseId: number,
  input: { title?: unknown; description?: unknown; icon?: unknown },
) {
  await assertDatabaseAccess(userId, databaseId, true);
  const data: Prisma.NoteDatabaseUncheckedUpdateInput = {};
  if (input.title !== undefined) data.title = cleanText(input.title, 200, 'Tiêu đề');
  if (input.description !== undefined) {
    data.description = input.description == null ? null : String(input.description).slice(0, 2000);
  }
  if (input.icon !== undefined) data.icon = input.icon == null ? null : String(input.icon).slice(0, 30);
  if (Object.keys(data).length === 0) {
    throw new AppError('Không có trường hợp lệ để cập nhật', 400, 'EMPTY_UPDATE');
  }
  return prisma.noteDatabase.update({ where: { id: databaseId }, data, include: databaseInclude });
}

export async function deleteDatabase(userId: number, databaseId: number) {
  await assertDatabaseAccess(userId, databaseId, true);
  await prisma.noteDatabase.delete({ where: { id: databaseId } });
  return { id: databaseId, deleted: true };
}

// ─── Properties (columns) ─────────────────────────────────────

export async function createProperty(
  userId: number,
  databaseId: number,
  input: { name?: unknown; type?: unknown; config?: unknown },
) {
  await assertDatabaseAccess(userId, databaseId, true);
  const name = cleanText(input.name, 120, 'Tên cột');
  const type = parsePropertyType(input.type);
  if (type === 'TITLE') {
    throw new AppError('Mỗi cơ sở dữ liệu chỉ có một cột tiêu đề', 400, 'TITLE_ALREADY_EXISTS');
  }

  const last = await prisma.noteDatabaseProperty.findFirst({
    where: { databaseId },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });
  try {
    return await prisma.noteDatabaseProperty.create({
      data: {
        databaseId,
        name,
        type,
        config: (input.config ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(`Đã có cột tên "${name}"`, 409, 'DUPLICATE_PROPERTY_NAME');
    }
    throw err;
  }
}

export async function updateProperty(
  userId: number,
  propertyId: number,
  input: { name?: unknown; type?: unknown; config?: unknown },
) {
  const property = await propertyDatabaseId(propertyId);
  await assertDatabaseAccess(userId, property.databaseId, true);

  const data: Prisma.NoteDatabasePropertyUncheckedUpdateInput = {};
  if (input.name !== undefined) data.name = cleanText(input.name, 120, 'Tên cột');
  if (input.config !== undefined) {
    data.config = (input.config ?? Prisma.JsonNull) as Prisma.InputJsonValue;
  }
  if (input.type !== undefined) {
    const type = parsePropertyType(input.type);
    if (property.isTitle && type !== 'TITLE') {
      throw new AppError('Không thể đổi kiểu của cột tiêu đề', 400, 'CANNOT_RETYPE_TITLE');
    }
    if (!property.isTitle && type === 'TITLE') {
      throw new AppError('Mỗi cơ sở dữ liệu chỉ có một cột tiêu đề', 400, 'TITLE_ALREADY_EXISTS');
    }
    data.type = type;
  }
  if (Object.keys(data).length === 0) {
    throw new AppError('Không có trường hợp lệ để cập nhật', 400, 'EMPTY_UPDATE');
  }

  // Re-coercing every existing cell keeps stored values honest after a type
  // change. Values that cannot survive the new type are dropped rather than
  // left behind as, say, the string "abc" sitting in a NUMBER column.
  const retype = data.type !== undefined && data.type !== property.type;

  return prisma.$transaction(async (tx) => {
    const updated = await tx.noteDatabaseProperty.update({ where: { id: propertyId }, data })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
          throw new AppError('Đã có cột trùng tên', 409, 'DUPLICATE_PROPERTY_NAME');
        }
        throw err;
      });
    if (!retype) return updated;

    const cells = await tx.noteDatabaseCell.findMany({
      where: { propertyId },
      select: { id: true, value: true },
    });
    for (const cell of cells) {
      let next: Prisma.InputJsonValue | null = null;
      try {
        next = normalizeCellValue(updated.type as DatabasePropertyType, cell.value, updated.config);
      } catch {
        next = null;
      }
      if (next === null) await tx.noteDatabaseCell.delete({ where: { id: cell.id } });
      else await tx.noteDatabaseCell.update({ where: { id: cell.id }, data: { value: next } });
    }
    return updated;
  });
}

export async function deleteProperty(userId: number, propertyId: number) {
  const property = await propertyDatabaseId(propertyId);
  await assertDatabaseAccess(userId, property.databaseId, true);
  if (property.isTitle) {
    throw new AppError('Không thể xóa cột tiêu đề', 400, 'CANNOT_DELETE_TITLE');
  }
  await prisma.noteDatabaseProperty.delete({ where: { id: propertyId } });
  return { id: propertyId, deleted: true };
}

export async function reorderProperties(userId: number, databaseId: number, orderedIds: unknown) {
  await assertDatabaseAccess(userId, databaseId, true);
  if (!Array.isArray(orderedIds)) {
    throw new AppError('orderedIds phải là mảng', 400, 'INVALID_ORDER');
  }
  const ids = orderedIds.map(Number).filter((id) => Number.isInteger(id) && id > 0);
  await prisma.$transaction(
    ids.map((id, index) => prisma.noteDatabaseProperty.updateMany({
      // databaseId in the filter stops a caller from reordering another
      // database's columns by passing foreign ids.
      where: { id, databaseId },
      data: { sortOrder: index },
    })),
  );
  return { reordered: ids.length };
}

// ─── Rows + cells ─────────────────────────────────────────────

export async function createRow(
  userId: number,
  databaseId: number,
  input: { values?: unknown } = {},
) {
  await assertDatabaseAccess(userId, databaseId, true);
  const properties = await prisma.noteDatabaseProperty.findMany({
    where: { databaseId },
    select: { id: true, type: true, config: true },
  });
  const byId = new Map(properties.map((property) => [property.id, property]));
  const values = (input.values && typeof input.values === 'object' && !Array.isArray(input.values))
    ? input.values as Record<string, unknown>
    : {};

  const cells: { propertyId: number; value: Prisma.InputJsonValue }[] = [];
  for (const [key, raw] of Object.entries(values)) {
    const property = byId.get(Number(key));
    if (!property) continue;
    const value = normalizeCellValue(property.type as DatabasePropertyType, raw, property.config);
    if (value !== null) cells.push({ propertyId: property.id, value });
  }

  const last = await prisma.noteDatabaseRow.findFirst({
    where: { databaseId },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });

  return prisma.$transaction(async (tx) => {
    const row = await tx.noteDatabaseRow.create({
      data: {
        databaseId,
        createdById: userId,
        updatedById: userId,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });
    if (cells.length > 0) {
      await tx.noteDatabaseCell.createMany({
        data: cells.map((cell) => ({ rowId: row.id, propertyId: cell.propertyId, value: cell.value })),
      });
    }
    await tx.noteDatabase.update({ where: { id: databaseId }, data: { updatedAt: new Date() } });
    return { id: row.id, sortOrder: row.sortOrder, values: Object.fromEntries(cells.map((c) => [c.propertyId, c.value])) };
  });
}

/** Write a partial map of propertyId → value. Absent keys are left alone. */
export async function updateRow(userId: number, rowId: number, values: unknown) {
  assertId(rowId, 'rowId');
  const row = await prisma.noteDatabaseRow.findUnique({
    where: { id: rowId },
    select: { id: true, databaseId: true },
  });
  if (!row) throw new AppError('Dòng không tồn tại', 404, 'ROW_NOT_FOUND');
  await assertDatabaseAccess(userId, row.databaseId, true);

  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    throw new AppError('values phải là một đối tượng', 400, 'INVALID_VALUES');
  }
  const properties = await prisma.noteDatabaseProperty.findMany({
    where: { databaseId: row.databaseId },
    select: { id: true, type: true, config: true },
  });
  const byId = new Map(properties.map((property) => [property.id, property]));

  const writes: { propertyId: number; value: Prisma.InputJsonValue | null }[] = [];
  for (const [key, raw] of Object.entries(values as Record<string, unknown>)) {
    const property = byId.get(Number(key));
    // Silently ignoring an unknown column would make a typo look like a
    // successful save, so it is an error.
    if (!property) throw new AppError(`Cột ${key} không thuộc bảng này`, 400, 'UNKNOWN_PROPERTY');
    writes.push({
      propertyId: property.id,
      value: normalizeCellValue(property.type as DatabasePropertyType, raw, property.config),
    });
  }

  await prisma.$transaction(async (tx) => {
    for (const write of writes) {
      if (write.value === null) {
        // Clearing removes the cell entirely — "empty" has one representation.
        await tx.noteDatabaseCell.deleteMany({ where: { rowId, propertyId: write.propertyId } });
      } else {
        await tx.noteDatabaseCell.upsert({
          // The schema declares @@unique([rowId, propertyId], map: "...").
          // `map:` renames the CONSTRAINT in Postgres only — the Prisma client
          // key stays the default `rowId_propertyId`. It would be
          // `uk_note_database_cell_row_property` only if the schema said
          // `name:` instead of `map:`.
          where: { rowId_propertyId: { rowId, propertyId: write.propertyId } },
          create: { rowId, propertyId: write.propertyId, value: write.value },
          update: { value: write.value },
        });
      }
    }
    await tx.noteDatabaseRow.update({ where: { id: rowId }, data: { updatedById: userId } });
    await tx.noteDatabase.update({ where: { id: row.databaseId }, data: { updatedAt: new Date() } });
  });

  const fresh = await prisma.noteDatabaseRow.findUniqueOrThrow({
    where: { id: rowId },
    include: { cells: { select: { propertyId: true, value: true } } },
  });
  return withComputedValues({
    id: fresh.id,
    sortOrder: fresh.sortOrder,
    createdAt: fresh.createdAt,
    updatedAt: fresh.updatedAt,
    values: Object.fromEntries(fresh.cells.map((cell) => [cell.propertyId, cell.value])) as Record<string, unknown>,
  }, properties);
}

export async function deleteRow(userId: number, rowId: number) {
  assertId(rowId, 'rowId');
  const row = await prisma.noteDatabaseRow.findUnique({
    where: { id: rowId },
    select: { id: true, databaseId: true },
  });
  if (!row) throw new AppError('Dòng không tồn tại', 404, 'ROW_NOT_FOUND');
  await assertDatabaseAccess(userId, row.databaseId, true);
  await prisma.noteDatabaseRow.delete({ where: { id: rowId } });
  return { id: rowId, deleted: true };
}

export async function reorderRows(userId: number, databaseId: number, orderedIds: unknown) {
  await assertDatabaseAccess(userId, databaseId, true);
  if (!Array.isArray(orderedIds)) {
    throw new AppError('orderedIds phải là mảng', 400, 'INVALID_ORDER');
  }
  const ids = orderedIds.map(Number).filter((id) => Number.isInteger(id) && id > 0);
  await prisma.$transaction(
    ids.map((id, index) => prisma.noteDatabaseRow.updateMany({
      where: { id, databaseId },
      data: { sortOrder: index },
    })),
  );
  return { reordered: ids.length };
}

// ─── Views ────────────────────────────────────────────────────

export async function createView(
  userId: number,
  databaseId: number,
  input: { name?: unknown; type?: unknown; config?: unknown },
) {
  await assertDatabaseAccess(userId, databaseId, true);
  const name = cleanText(input.name ?? 'Khung nhìn mới', 120, 'Tên khung nhìn');
  const type = parseViewType(input.type);
  const last = await prisma.noteDatabaseView.findFirst({
    where: { databaseId },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });
  return prisma.noteDatabaseView.create({
    data: {
      databaseId,
      name,
      type,
      config: (input.config ?? { hiddenPropertyIds: [], sorts: [], filters: [] }) as Prisma.InputJsonValue,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
}

export async function updateView(
  userId: number,
  viewId: number,
  input: { name?: unknown; type?: unknown; config?: unknown },
) {
  assertId(viewId, 'viewId');
  const view = await prisma.noteDatabaseView.findUnique({
    where: { id: viewId },
    select: { id: true, databaseId: true },
  });
  if (!view) throw new AppError('Khung nhìn không tồn tại', 404, 'VIEW_NOT_FOUND');
  await assertDatabaseAccess(userId, view.databaseId, true);

  const data: Prisma.NoteDatabaseViewUncheckedUpdateInput = {};
  if (input.name !== undefined) data.name = cleanText(input.name, 120, 'Tên khung nhìn');
  if (input.type !== undefined) data.type = parseViewType(input.type);
  if (input.config !== undefined) data.config = input.config as Prisma.InputJsonValue;
  if (Object.keys(data).length === 0) {
    throw new AppError('Không có trường hợp lệ để cập nhật', 400, 'EMPTY_UPDATE');
  }
  return prisma.noteDatabaseView.update({ where: { id: viewId }, data });
}

export async function deleteView(userId: number, viewId: number) {
  assertId(viewId, 'viewId');
  const view = await prisma.noteDatabaseView.findUnique({
    where: { id: viewId },
    select: { id: true, databaseId: true, isDefault: true },
  });
  if (!view) throw new AppError('Khung nhìn không tồn tại', 404, 'VIEW_NOT_FOUND');
  await assertDatabaseAccess(userId, view.databaseId, true);
  const remaining = await prisma.noteDatabaseView.count({ where: { databaseId: view.databaseId } });
  if (remaining <= 1) {
    throw new AppError('Phải giữ lại ít nhất một khung nhìn', 400, 'LAST_VIEW');
  }
  await prisma.noteDatabaseView.delete({ where: { id: viewId } });
  return { id: viewId, deleted: true };
}
