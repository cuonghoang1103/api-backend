/**
 * Bộ khung quản lý công việc dựng sẵn, và "Việc của tôi".
 *
 * ─── Vì sao cần dựng sẵn ───
 * Mọi nguyên liệu đã có: cột trạng thái có nhóm, cột người, dòng thời gian kéo
 * được, quan hệ giữa hai bảng, tổng hợp % hoàn thành, công thức cảnh báo trễ
 * hạn. Nhưng lắp chúng lại đúng cách là mười mấy bước, và bước nào cũng cần
 * biết trước rằng bước sau sẽ dùng tới. Người dùng mở bảng rỗng ra thì không
 * có cách nào đoán được điều đó — họ sẽ dựng một bảng phẳng có vài cột chữ,
 * đúng như cái họ đã có trước khi có database.
 *
 * Hàm này dựng đủ trong MỘT lượt bấm, rồi người dùng sửa tiếp từ đó.
 *
 * ─── Thứ tự tạo là BẮT BUỘC ───
 * Quan hệ cần bảng đích tồn tại trước; tổng hợp cần cột quan hệ tồn tại trước;
 * công thức cần cột tổng hợp tồn tại trước (nó gọi `prop("% hoàn thành")`).
 * Đảo thứ tự thì cột sau trỏ vào một id chưa có và im lặng không tính gì.
 */
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  createDatabase,
  createProperty,
  createRow,
} from './notesDatabase.service.js';

/** Trạng thái công việc, kèm NHÓM để Board xếp cột và rollup biết đâu là xong. */
const TASK_STATUS_OPTIONS = [
  { name: 'Chưa làm', group: 'todo' },
  { name: 'Đang làm', group: 'doing' },
  { name: 'Chờ duyệt', group: 'doing' },
  { name: 'Xong', group: 'done' },
];

const PRIORITY_OPTIONS = ['Cao', 'Trung bình', 'Thấp'];

export interface TaskWorkspaceResult {
  projectDatabaseId: number;
  taskDatabaseId: number;
}

/**
 * Dựng cặp bảng "Dự án" ↔ "Công việc" đã nối sẵn.
 *
 * Trả về id hai bảng để giao diện mở thẳng bảng Công việc — đó là chỗ người
 * dùng làm việc hằng ngày, còn bảng Dự án chỉ để nhìn tổng.
 */
export async function createTaskWorkspace(
  userId: number,
  subjectId: number,
): Promise<TaskWorkspaceResult> {
  if (!Number.isInteger(subjectId) || subjectId <= 0) {
    throw new AppError('subjectId không hợp lệ', 400, 'INVALID_ID');
  }

  // 1. Hai bảng. `createDatabase` tự kiểm quyền trên môn học.
  const projects = await createDatabase(userId, { subjectId, title: 'Dự án', icon: '📁' });
  const tasks = await createDatabase(userId, { subjectId, title: 'Công việc', icon: '✅' });

  // 2. Cột của bảng Công việc.
  const status = await createProperty(userId, tasks.id, {
    name: 'Trạng thái', type: 'STATUS', config: { options: TASK_STATUS_OPTIONS },
  });
  const assignee = await createProperty(userId, tasks.id, { name: 'Người phụ trách', type: 'PERSON' });
  await createProperty(userId, tasks.id, {
    name: 'Độ ưu tiên', type: 'SELECT', config: { options: PRIORITY_OPTIONS },
  });
  const start = await createProperty(userId, tasks.id, { name: 'Bắt đầu', type: 'DATE' });
  const due = await createProperty(userId, tasks.id, { name: 'Hạn chót', type: 'DATE' });
  await createProperty(userId, tasks.id, { name: 'Ước lượng (giờ)', type: 'NUMBER' });

  /* Quan hệ NGƯỢC từ Công việc về Dự án.
   *
   * Đặt cột quan hệ ở bảng CÔNG VIỆC chứ không ở bảng Dự án: người dùng gán
   * việc vào dự án khi đang tạo việc, chứ hiếm khi mở dự án ra rồi đi tick
   * từng việc. Bảng liên kết phục vụ cả hai chiều nên đặt ở đâu cũng tra
   * ngược được — chọn theo thói quen thao tác, không theo mô hình dữ liệu. */
  await createProperty(userId, tasks.id, {
    name: 'Thuộc dự án', type: 'RELATION', config: { targetDatabaseId: projects.id },
  });

  /* Cảnh báo trễ hạn, tính ngay trên bảng Công việc.
   *
   * `dateBetween(now(), Hạn chót)` âm nghĩa là hạn đã qua. Bọc trong `if` để
   * việc đã Xong không bị gắn cờ đỏ — một việc xong muộn thì vẫn là xong. */
  await createProperty(userId, tasks.id, {
    name: 'Cảnh báo',
    type: 'FORMULA',
    config: {
      expression:
        'if(prop("Trạng thái") == "Xong", "✅",'
        + ' if(empty(prop("Hạn chót")), "",'
        + ' if(dateBetween(now(), prop("Hạn chót"), "days") < 0, "🔴 Trễ hạn",'
        + ' if(dateBetween(now(), prop("Hạn chót"), "days") <= 2, "🟡 Sắp tới hạn", "🟢 Còn thời gian"))))',
    },
  });

  // 3. Cột của bảng Dự án — quan hệ tới Công việc, rồi các số tổng hợp.
  const projectTasks = await createProperty(userId, projects.id, {
    name: 'Công việc', type: 'RELATION', config: { targetDatabaseId: tasks.id },
  });
  await createProperty(userId, projects.id, {
    name: 'Số việc', type: 'ROLLUP',
    config: { relationPropertyId: projectTasks.id, fn: 'count' },
  });
  await createProperty(userId, projects.id, {
    name: '% hoàn thành', type: 'ROLLUP',
    config: { relationPropertyId: projectTasks.id, targetPropertyId: status.id, fn: 'percentDone' },
  });
  await createProperty(userId, projects.id, {
    name: 'Hạn cuối', type: 'ROLLUP',
    config: { relationPropertyId: projectTasks.id, targetPropertyId: due.id, fn: 'latestDate' },
  });
  // Công thức này đọc kết quả của rollup ngay phía trên — hợp lệ vì công thức
  // được tính SAU rollup trong cùng một lượt đọc (xem getDatabase).
  await createProperty(userId, projects.id, {
    name: 'Tình trạng',
    type: 'FORMULA',
    config: {
      expression:
        'if(prop("Số việc") == 0, "Chưa có việc",'
        + ' if(prop("% hoàn thành") == 100, "✅ Hoàn thành",'
        + ' if(prop("% hoàn thành") >= 50, "🟢 Đúng tiến độ", "🟡 Cần đẩy nhanh")))',
    },
  });

  /* 4. Một dòng mẫu ở mỗi bảng.
   *
   * Bảng rỗng hoàn toàn khiến người dùng không thấy được cấu trúc vừa dựng —
   * mọi cột đều trống nên không rõ cột nào làm gì. Một dòng có dữ liệu là lời
   * giải thích ngắn nhất. */
  const projectTitle = await prisma.noteDatabaseProperty.findFirst({
    where: { databaseId: projects.id, isTitle: true }, select: { id: true },
  });
  const taskTitle = await prisma.noteDatabaseProperty.findFirst({
    where: { databaseId: tasks.id, isTitle: true }, select: { id: true },
  });
  if (projectTitle) {
    await createRow(userId, projects.id, { values: { [projectTitle.id]: 'Dự án đầu tiên' } });
  }
  if (taskTitle) {
    const inAWeek = new Date(Date.now() + 7 * 86_400_000).toISOString();
    await createRow(userId, tasks.id, {
      values: {
        [taskTitle.id]: 'Việc đầu tiên',
        [status.id]: 'Chưa làm',
        [assignee.id]: [userId],
        [start.id]: new Date().toISOString(),
        [due.id]: inAWeek,
      },
    });
  }

  return { projectDatabaseId: projects.id, taskDatabaseId: tasks.id };
}

// ─── Việc của tôi ──────────────────────────────────────────────

export interface MyTask {
  rowId: number;
  databaseId: number;
  databaseTitle: string;
  subjectId: number;
  subjectName: string;
  title: string;
  status: string | null;
  statusGroup: 'todo' | 'doing' | 'done' | null;
  due: string | null;
  priority: string | null;
}

/** Nhóm của một tuỳ chọn STATUS, tra trong config của cột. */
function groupOf(config: unknown, optionName: string | null): 'todo' | 'doing' | 'done' | null {
  if (!optionName || !config || typeof config !== 'object' || Array.isArray(config)) return null;
  const options = (config as Record<string, unknown>).options;
  if (!Array.isArray(options)) return null;
  for (const option of options) {
    if (option && typeof option === 'object') {
      const o = option as Record<string, unknown>;
      if (o.name === optionName && (o.group === 'todo' || o.group === 'doing' || o.group === 'done')) {
        return o.group;
      }
    }
  }
  return null;
}

/**
 * Mọi công việc được gán cho người này, gom từ MỌI bảng họ truy cập được.
 *
 * ─── Vì sao lọc trong SQL chứ không lấy hết rồi lọc ───
 * Ô kiểu PERSON lưu mảng id trong JSONB. Postgres có toán tử `@>` cho JSONB,
 * nên "ô này có chứa id của tôi không" hỏi được thẳng trong truy vấn. Lấy hết
 * ô PERSON của mọi bảng rồi lọc ở Node nghĩa là kéo về hàng chục nghìn dòng
 * để giữ lại vài chục.
 *
 * ─── Phạm vi quyền ───
 * Chỉ lấy bảng thuộc môn mà người này SỞ HỮU hoặc ĐƯỢC CHIA SẺ. Không kiểm thì
 * một ai đó gán id của bạn vào bảng riêng của họ là bạn thấy nội dung bảng đó
 * trong danh sách việc của mình.
 */
export async function listMyTasks(userId: number, limit = 200): Promise<MyTask[]> {
  // Môn mà người này với tới được — sở hữu hoặc được chia sẻ.
  const [owned, shared] = await Promise.all([
    prisma.noteSubject.findMany({ where: { userId }, select: { id: true } }),
    prisma.noteSubjectShare.findMany({
      where: { recipientId: userId },
      select: { subjectId: true },
    }),
  ]);
  const subjectIds = [...new Set([...owned.map((s) => s.id), ...shared.map((s) => s.subjectId)])];
  if (subjectIds.length === 0) return [];

  // Cột PERSON của các bảng trong những môn đó.
  const personProperties = await prisma.noteDatabaseProperty.findMany({
    where: { type: 'PERSON', database: { subjectId: { in: subjectIds } } },
    select: { id: true, databaseId: true },
  });
  if (personProperties.length === 0) return [];

  const cells = await prisma.noteDatabaseCell.findMany({
    where: {
      propertyId: { in: personProperties.map((p) => p.id) },
      // `array_contains` của Prisma dịch thành `@>` của Postgres — dùng được
      // chỉ mục GIN nếu sau này bảng lớn cần thêm.
      value: { array_contains: [userId] },
    },
    select: { rowId: true },
    take: limit,
  });
  if (cells.length === 0) return [];

  const rowIds = [...new Set(cells.map((c) => c.rowId))];
  const rows = await prisma.noteDatabaseRow.findMany({
    where: { id: { in: rowIds } },
    select: {
      id: true,
      database: {
        select: { id: true, title: true, subject: { select: { id: true, name: true } } },
      },
      cells: {
        select: {
          value: true,
          property: { select: { id: true, name: true, type: true, isTitle: true, config: true } },
        },
      },
    },
  });

  const tasks: MyTask[] = rows.map((row) => {
    let title = '';
    let status: string | null = null;
    let statusGroup: 'todo' | 'doing' | 'done' | null = null;
    let due: string | null = null;
    let priority: string | null = null;

    for (const cell of row.cells) {
      const { property } = cell;
      const text = cell.value === null || cell.value === undefined ? null : String(cell.value);
      if (property.isTitle) title = text ?? '';
      else if (property.type === 'STATUS') {
        status = text;
        statusGroup = groupOf(property.config, text);
      } else if (property.type === 'DATE' && due === null) {
        // Cột ngày ĐẦU TIÊN được coi là hạn. Đoán theo tên ("Hạn chót") sẽ hỏng
        // ngay khi người dùng đổi tên cột, mà đổi tên là chuyện bình thường.
        due = text;
      } else if (property.type === 'SELECT' && priority === null) {
        priority = text;
      }
    }

    return {
      rowId: row.id,
      databaseId: row.database.id,
      databaseTitle: row.database.title,
      subjectId: row.database.subject.id,
      subjectName: row.database.subject.name,
      title: title || `Dòng #${row.id}`,
      status,
      statusGroup,
      due,
      priority,
    };
  });

  /* Sắp xếp: việc CHƯA xong lên trước, rồi tới hạn gần nhất.
   *
   * Việc không có hạn xếp SAU việc có hạn thay vì lên đầu: một việc chưa đặt
   * hạn thường là việc chưa được lên lịch, còn thứ người dùng cần nhìn thấy
   * đầu tiên là cái sắp đến hạn. */
  return tasks.sort((a, b) => {
    const doneA = a.statusGroup === 'done' ? 1 : 0;
    const doneB = b.statusGroup === 'done' ? 1 : 0;
    if (doneA !== doneB) return doneA - doneB;
    const timeA = a.due ? new Date(a.due).getTime() : Number.POSITIVE_INFINITY;
    const timeB = b.due ? new Date(b.due).getTime() : Number.POSITIVE_INFINITY;
    if (timeA !== timeB) return timeA - timeB;
    return a.title.localeCompare(b.title, 'vi');
  });
}
