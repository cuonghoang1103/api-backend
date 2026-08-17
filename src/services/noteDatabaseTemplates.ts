/**
 * Thư viện mẫu database dựng sẵn.
 *
 * ─── Mẫu là DỮ LIỆU, không phải mã ───
 * Mỗi mẫu ở đây chỉ mô tả "bảng này có những cột gì, vài dòng ví dụ ra sao".
 * Một hàm duy nhất (`applyTemplate`) đọc mô tả đó rồi gọi đúng các hàm tạo
 * bảng/cột/dòng sẵn có. Viết mỗi mẫu thành một hàm riêng sẽ nhân bản mười lần
 * cùng một đoạn tạo cột, và mỗi kiểu cột mới lại phải sửa mười chỗ.
 *
 * Bộ khung Dự án ↔ Công việc KHÔNG nằm ở đây (xem noteTaskWorkspace.ts): nó
 * dựng HAI bảng nối vào nhau, với thứ tự tạo cột bắt buộc giữa hai bảng. Ép nó
 * vào khuôn mô tả một-bảng sẽ làm khuôn đó phức tạp lên chỉ vì một trường hợp.
 */
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { createDatabase, createProperty, createRow, type DatabasePropertyType } from './notesDatabase.service.js';

interface TemplateColumn {
  name: string;
  type: DatabasePropertyType;
  config?: unknown;
}

interface TemplateDefinition {
  key: string;
  title: string;
  icon: string;
  /** Một câu nói rõ mẫu này dùng để làm gì — hiện trong danh sách chọn. */
  description: string;
  /** Cột đầu tiên LUÔN là cột tiêu đề có sẵn; ở đây chỉ khai các cột thêm. */
  titleName: string;
  columns: TemplateColumn[];
  /** Dòng ví dụ, khoá theo TÊN cột. Bảng rỗng không cho thấy cấu trúc vừa dựng. */
  samples: Record<string, unknown>[];
}

const status = (options: { name: string; group: 'todo' | 'doing' | 'done' }[]) => ({ options });
const select = (options: string[]) => ({ options });

export const DATABASE_TEMPLATES: TemplateDefinition[] = [
  {
    key: 'habit',
    title: 'Theo dõi thói quen',
    icon: '🔁',
    description: 'Mỗi dòng một thói quen, đánh dấu theo ngày và đếm chuỗi ngày liên tiếp.',
    titleName: 'Thói quen',
    columns: [
      { name: 'Ngày', type: 'DATE' },
      { name: 'Đã làm', type: 'CHECKBOX' },
      { name: 'Nhóm', type: 'SELECT', config: select(['Sức khoẻ', 'Học tập', 'Công việc', 'Cá nhân']) },
      { name: 'Ghi chú', type: 'TEXT' },
    ],
    samples: [
      { 'Thói quen': 'Đọc 20 trang sách', Ngày: 'today', 'Đã làm': true, Nhóm: 'Học tập' },
      { 'Thói quen': 'Chạy bộ 3km', Ngày: 'today', 'Đã làm': false, Nhóm: 'Sức khoẻ' },
    ],
  },
  {
    key: 'reading',
    title: 'Quản lý sách',
    icon: '📚',
    description: 'Sách đang đọc, đã đọc, muốn đọc — kèm tiến độ theo phần trăm.',
    titleName: 'Tên sách',
    columns: [
      { name: 'Tác giả', type: 'TEXT' },
      { name: 'Trạng thái', type: 'STATUS', config: status([
        { name: 'Muốn đọc', group: 'todo' },
        { name: 'Đang đọc', group: 'doing' },
        { name: 'Đã đọc', group: 'done' },
      ]) },
      { name: 'Số trang', type: 'NUMBER' },
      { name: 'Đã đọc tới', type: 'NUMBER' },
      { name: 'Tiến độ', type: 'FORMULA', config: {
        // Chia cho 0 trả null, nên `if(empty(...))` chặn trước để ô hiện "—"
        // thay vì trống trơn không rõ vì sao.
        expression: 'if(empty(prop("Số trang")), "—", concat(round(prop("Đã đọc tới") / prop("Số trang") * 100), "%"))',
      } },
      { name: 'Đánh giá', type: 'SELECT', config: select(['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐', '⭐⭐', '⭐']) },
    ],
    samples: [
      { 'Tên sách': 'Nhà giả kim', 'Tác giả': 'Paulo Coelho', 'Trạng thái': 'Đang đọc', 'Số trang': 224, 'Đã đọc tới': 120 },
    ],
  },
  {
    key: 'study',
    title: 'Kế hoạch học tập',
    icon: '🎓',
    description: 'Chia môn thành buổi học, theo dõi đã ôn tới đâu và còn bao lâu tới kỳ thi.',
    titleName: 'Nội dung',
    columns: [
      { name: 'Môn', type: 'SELECT', config: select(['Toán', 'Lập trình', 'Tiếng Anh', 'Khác']) },
      { name: 'Trạng thái', type: 'STATUS', config: status([
        { name: 'Chưa học', group: 'todo' },
        { name: 'Đang học', group: 'doing' },
        { name: 'Đã ôn', group: 'done' },
      ]) },
      { name: 'Ngày học', type: 'DATE' },
      { name: 'Hạn ôn xong', type: 'DATE' },
      { name: 'Còn lại', type: 'FORMULA', config: {
        expression: 'if(empty(prop("Hạn ôn xong")), "", concat(dateBetween(now(), prop("Hạn ôn xong"), "days"), " ngày"))',
      } },
      { name: 'Tài liệu', type: 'FILE' },
    ],
    samples: [
      { 'Nội dung': 'Ôn chương 1 — Giới hạn', 'Môn': 'Toán', 'Trạng thái': 'Chưa học', 'Ngày học': 'today', 'Hạn ôn xong': '+7d' },
    ],
  },
  {
    key: 'finance',
    title: 'Quản lý chi tiêu',
    icon: '💰',
    description: 'Ghi thu chi theo ngày và phân loại, để lọc và cộng theo tháng.',
    titleName: 'Khoản',
    columns: [
      { name: 'Ngày', type: 'DATE' },
      { name: 'Loại', type: 'SELECT', config: select(['Thu', 'Chi']) },
      { name: 'Danh mục', type: 'SELECT', config: select(['Ăn uống', 'Đi lại', 'Nhà ở', 'Học tập', 'Giải trí', 'Khác']) },
      { name: 'Số tiền', type: 'NUMBER' },
      { name: 'Đã thanh toán', type: 'CHECKBOX' },
      { name: 'Hoá đơn', type: 'FILE' },
    ],
    samples: [
      { 'Khoản': 'Cà phê sáng', Ngày: 'today', Loại: 'Chi', 'Danh mục': 'Ăn uống', 'Số tiền': 35000, 'Đã thanh toán': true },
    ],
  },
  {
    key: 'content',
    title: 'Lịch nội dung',
    icon: '📅',
    description: 'Bài viết, video, bản tin — từ ý tưởng tới lúc đăng.',
    titleName: 'Tiêu đề',
    columns: [
      { name: 'Kênh', type: 'MULTI_SELECT', config: select(['Blog', 'YouTube', 'Facebook', 'Bản tin']) },
      { name: 'Trạng thái', type: 'STATUS', config: status([
        { name: 'Ý tưởng', group: 'todo' },
        { name: 'Đang viết', group: 'doing' },
        { name: 'Chờ duyệt', group: 'doing' },
        { name: 'Đã đăng', group: 'done' },
      ]) },
      { name: 'Người viết', type: 'PERSON' },
      { name: 'Ngày đăng', type: 'DATE' },
      { name: 'Liên kết', type: 'URL' },
    ],
    samples: [
      { 'Tiêu đề': 'Bài đầu tiên', Kênh: ['Blog'], 'Trạng thái': 'Ý tưởng', 'Ngày đăng': '+3d' },
    ],
  },
  {
    key: 'crm',
    title: 'Khách hàng (CRM)',
    icon: '🤝',
    description: 'Theo dõi khách từ lúc liên hệ tới lúc chốt.',
    titleName: 'Khách hàng',
    columns: [
      { name: 'Giai đoạn', type: 'STATUS', config: status([
        { name: 'Mới', group: 'todo' },
        { name: 'Đang trao đổi', group: 'doing' },
        { name: 'Đã báo giá', group: 'doing' },
        { name: 'Chốt', group: 'done' },
        { name: 'Từ chối', group: 'done' },
      ]) },
      { name: 'Email', type: 'EMAIL' },
      { name: 'Website', type: 'URL' },
      { name: 'Giá trị', type: 'NUMBER' },
      { name: 'Liên hệ gần nhất', type: 'DATE' },
      { name: 'Phụ trách', type: 'PERSON' },
      { name: 'Cập nhật lúc', type: 'LAST_EDITED_TIME' },
    ],
    samples: [
      { 'Khách hàng': 'Công ty A', 'Giai đoạn': 'Mới', Email: 'lienhe@congty-a.vn', 'Giá trị': 20000000, 'Liên hệ gần nhất': 'today' },
    ],
  },
  {
    key: 'meeting',
    title: 'Ghi chú cuộc họp',
    icon: '🗣️',
    description: 'Mỗi cuộc họp một dòng, kèm người dự và việc cần làm sau họp.',
    titleName: 'Cuộc họp',
    columns: [
      { name: 'Ngày', type: 'DATE' },
      { name: 'Người dự', type: 'PERSON' },
      { name: 'Chủ đề', type: 'MULTI_SELECT', config: select(['Kế hoạch', 'Kỹ thuật', 'Sản phẩm', 'Khách hàng']) },
      { name: 'Đã chốt', type: 'CHECKBOX' },
      { name: 'Tài liệu', type: 'FILE' },
      { name: 'Tạo lúc', type: 'CREATED_TIME' },
    ],
    samples: [
      { 'Cuộc họp': 'Họp đầu tuần', Ngày: 'today', 'Đã chốt': false },
    ],
  },
  {
    key: 'curriculum',
    title: 'Giáo trình',
    icon: '📖',
    description: 'Chia môn thành chương và bài, theo dõi đã soạn/đã dạy tới đâu.',
    titleName: 'Bài',
    columns: [
      { name: 'Chương', type: 'TEXT' },
      { name: 'Thứ tự', type: 'NUMBER' },
      { name: 'Trạng thái', type: 'STATUS', config: status([
        { name: 'Chưa soạn', group: 'todo' },
        { name: 'Đang soạn', group: 'doing' },
        { name: 'Đã soạn', group: 'done' },
        { name: 'Đã dạy', group: 'done' },
      ]) },
      { name: 'Thời lượng (phút)', type: 'NUMBER' },
      { name: 'Ngày dạy', type: 'DATE' },
      { name: 'Slide', type: 'FILE' },
      { name: 'Video', type: 'URL' },
    ],
    samples: [
      { 'Bài': 'Bài 1 — Nhập môn', 'Chương': 'Chương 1', 'Thứ tự': 1, 'Trạng thái': 'Chưa soạn', 'Thời lượng (phút)': 90 },
    ],
  },
];

/**
 * Giải nghĩa giá trị mẫu.
 *
 * Mẫu KHÔNG ghi ngày cứng: một mẫu ghi "2026-08-17" sẽ nằm mãi trong quá khứ
 * kể từ ngày mai, và cột "Còn lại" của nó hiện số âm ngay lần đầu người dùng
 * mở ra — trông như tính năng hỏng. `today` và `+7d` được quy đổi lúc tạo.
 */
function resolveSampleValue(raw: unknown): unknown {
  if (raw === 'today') return new Date().toISOString();
  if (typeof raw === 'string') {
    const match = /^\+(\d+)d$/.exec(raw);
    if (match) return new Date(Date.now() + Number(match[1]) * 86_400_000).toISOString();
  }
  return raw;
}

export interface ApplyTemplateResult {
  databaseId: number;
  title: string;
}

export async function applyTemplate(
  userId: number,
  subjectId: number,
  templateKey: string,
): Promise<ApplyTemplateResult> {
  const template = DATABASE_TEMPLATES.find((t) => t.key === templateKey);
  if (!template) throw new AppError(`Mẫu không tồn tại: ${templateKey}`, 400, 'TEMPLATE_NOT_FOUND');

  // `createDatabase` tự kiểm quyền trên môn học — không lặp lại ở đây.
  const database = await createDatabase(userId, {
    subjectId, title: template.title, icon: template.icon, description: template.description,
  });

  // Đổi tên cột tiêu đề có sẵn cho hợp mẫu ("Tên sách" thay vì "Tên").
  const titleProperty = await prisma.noteDatabaseProperty.findFirst({
    where: { databaseId: database.id, isTitle: true }, select: { id: true },
  });
  if (titleProperty) {
    await prisma.noteDatabaseProperty.update({
      where: { id: titleProperty.id }, data: { name: template.titleName },
    });
  }

  /* Tạo cột TUẦN TỰ, không dùng Promise.all.
   *
   * `createProperty` đặt `sortOrder` bằng "lớn nhất hiện có + 1", nên chạy
   * song song sẽ đọc cùng một giá trị lớn nhất và cho ra một loạt cột cùng
   * sortOrder — thứ tự cột trên bảng thành ngẫu nhiên. */
  const idByName = new Map<string, number>();
  if (titleProperty) idByName.set(template.titleName, titleProperty.id);
  for (const column of template.columns) {
    const created = await createProperty(userId, database.id, {
      name: column.name,
      type: column.type,
      ...(column.config !== undefined ? { config: column.config } : {}),
    });
    idByName.set(column.name, created.id);
  }

  for (const sample of template.samples) {
    const values: Record<number, unknown> = {};
    for (const [name, raw] of Object.entries(sample)) {
      const id = idByName.get(name);
      // Bỏ qua trường không khớp cột nào thay vì ném lỗi: một mẫu gõ sai tên
      // cột chỉ nên mất dòng ví dụ, không nên chặn cả việc tạo bảng.
      if (id !== undefined) values[id] = resolveSampleValue(raw);
    }
    await createRow(userId, database.id, { values });
  }

  return { databaseId: database.id, title: template.title };
}

/** Danh sách mẫu cho giao diện chọn — không kèm phần định nghĩa cột. */
export function listTemplates() {
  return DATABASE_TEMPLATES.map(({ key, title, icon, description }) => ({ key, title, icon, description }));
}
