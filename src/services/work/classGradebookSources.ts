/**
 * CT Work — CTW đợt 9 — HỢP ĐỒNG NGUỒN ĐIỂM của Sổ điểm lớp (chủ: 9b · người cắm: 9b bài tập, 9c quiz).
 *
 * Sổ điểm (`classGradebook.service.ts`, tab Grades) KHÔNG biết bảng của quiz hay bài tập — nó hỏi mọi nguồn đã đăng ký:
 *   - `items(ctx)`  : các CỘT (bài tập / quiz) người xem được thấy. Sinh viên: chỉ mục đã giao + giao cho mình.
 *   - `cells(ctx, items)` : các Ô điểm (người × mục). Nguồn TỰ lọc theo người xem — sinh viên chỉ nhận ô của CHÍNH MÌNH
 *     và chỉ điểm ĐÃ CÔNG BỐ/TRẢ (`released: true`). Sổ điểm còn lọc lần hai (không tin nguồn).
 *   - `importCells?` : nhận điểm nhập từ xlsx cho mục `importable` (quiz tự chấm thì không cần — để trống).
 *
 * Đăng ký lúc nạp module: `registerGradebookSource({...})` ở cuối service của nguồn. Tuyến của nguồn được gắn khi khởi động
 * nên mọi nguồn đều đã nạp trước khi có yêu cầu sổ điểm; trong test thì import service của nguồn trước.
 *
 * Quy ước khoá: `item.key` = `<kind>:<id>` (vd `assignment:12`, `quiz:7`) — duy nhất trong lớp.
 * Điểm luôn là ĐIỂM CUỐI (đã trừ muộn…) trên thang `maxPoints` của mục; sổ điểm tự quy về hệ 10.
 */

export interface GradebookViewer {
  userId: number;
  /** OWNER/TEACHER của lớp. */
  manage: boolean;
}

export interface GradebookCtx {
  classId: number;
  viewer: GradebookViewer;
  /** Người (userId) có dòng trong sổ — sinh viên xem ⇒ chỉ [chính mình]. */
  userIds: number[];
  now: Date;
}

export interface GradebookItem {
  key: string;
  kind: string;
  refId: number;
  title: string;
  /** Loại — trọng số theo loại (vd 'Assignment', 'Quiz', 'Lab', 'Project'). */
  category: string;
  /** Chủ đề / tuần — trọng số theo chủ đề. */
  topic: string | null;
  maxPoints: number;
  dueAt: Date | null;
  /** Nhận điểm nhập từ xlsx không. */
  importable: boolean;
  /** Mở mục từ sổ điểm: tab + tham số phụ của trang lớp (vd { tab: 'classwork', a: '12' }). */
  link?: Record<string, string>;
}

export type GradebookCellState = 'RETURNED' | 'GRADED' | 'TURNED_IN' | 'LATE' | 'MISSING' | 'ASSIGNED' | 'NOT_ASSIGNED';

export interface GradebookCell {
  itemKey: string;
  userId: number;
  /** Điểm cuối trên thang maxPoints; null = chưa có. */
  points: number | null;
  /** true = sinh viên được thấy (đã trả / đã công bố). false = điểm nháp — CHỈ giảng viên thấy. */
  released: boolean;
  state: GradebookCellState;
  late?: boolean;
}

export interface GradebookSource {
  kind: string;
  items(ctx: GradebookCtx): Promise<GradebookItem[]>;
  cells(ctx: GradebookCtx, items: GradebookItem[]): Promise<GradebookCell[]>;
  /** Ghi điểm nhập (giảng viên, đã kiểm quyền ở sổ điểm). Trả số ô đã ghi. */
  importCells?(ctx: GradebookCtx, cells: Array<{ itemKey: string; userId: number; points: number }>): Promise<number>;
}

const sources = new Map<string, GradebookSource>();

export function registerGradebookSource(src: GradebookSource): void {
  sources.set(src.kind, src);
}

export function gradebookSources(): GradebookSource[] {
  return [...sources.values()];
}
