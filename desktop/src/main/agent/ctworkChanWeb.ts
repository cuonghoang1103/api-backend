/**
 * ============================================================
 * CT WORK KHÔNG ĐI QUA TRÌNH DUYỆT (20/10/2026)
 * ============================================================
 *
 * Chủ app: "nhờ đọc thẻ / thêm / sửa trên CT Work là nó mở Chrome bên ngoài rồi bấm từng bước trước mặt
 * mình — rất phiền". CT Work có đường MCP chính thức (`mcp__ctwork__*`, chạy ngầm bằng token trong kho của
 * máy) — trình duyệt chỉ là đường vòng: chậm, cần đăng nhập, và ở CLI/VS Code là cửa sổ Chrome thật.
 *
 * Nên tool trình duyệt nhắm trang CT Work (`cuongthai.com/work…`, máy chủ đang nối, `app://…/work…` — KHÔNG chặn localhost dev)
 * bị TỪ CHỐI ngay ở cửa chung `chayToolAgent` (ba nơi cùng mã) kèm đường đúng cho model. Chỉ chặn GIAO DIỆN
 * `/work`; đường tải `/api/…` (link export_file) vẫn đi được.
 */
import { API_ORIGIN } from '../config';

/** Tool trình duyệt bị chặn khi nhắm CT Work. `url` ⇒ đọc từ tham số; còn lại ⇒ trang đang mở. */
const TOOL_CO_URL = new Set(['web_mo', 'web_tai', 'trinh_duyet_hien']);
const TOOL_TRANG_HIEN = new Set(['web_doc', 'web_bam', 'web_go', 'web_anh', 'web_lien_ket']);

/** Địa chỉ này là GIAO DIỆN CT Work (`/work` hoặc `/work/…`) của CuongThai / máy chủ đang nối / localhost / app. */
export function laTrangCtworkWeb(url: unknown): boolean {
  if (typeof url !== 'string' || !url.trim()) return false;
  const tho = url.trim();
  let u: URL;
  try { u = new URL(tho); } catch {
    try { u = new URL(`https://${tho.replace(/^\/+/, '')}`); } catch { return false; }
  }
  // Chuẩn hoá trước khi so (QA 20/10): `//work`, `/%77ork`, chữ hoa; liên kết chia sẻ công khai `/work/share/…` không chặn.
  let p = u.pathname;
  try { p = decodeURIComponent(p); } catch { /* giữ nguyên */ }
  p = p.replace(/\/{2,}/g, '/').replace(/\/+$/, '').toLowerCase();
  if (p !== '/work' && !p.startsWith('/work/')) return false;
  if (p.startsWith('/work/share/')) return false;
  if (u.protocol === 'app:') return true;
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, ''); // `cuongthai.com.` (dấu chấm cuối)
  if (host === 'cuongthai.com' || host.endsWith('.cuongthai.com')) return true;
  /* localhost KHÔNG chặn: người dùng tự phát triển CT Work cần CuongMini thử giao diện local. So cả cổng với máy chủ
     đang nối ⇒ frontend dev (cổng khác backend) vẫn mở được. */
  try { return u.host.toLowerCase() === new URL(API_ORIGIN).host.toLowerCase(); } catch { return false; }
}

/**
 * Tool `ten` với `args` (trang đang mở = `urlHienTai`) có nhắm CT Work không ⇒ câu TỪ CHỐI cho model, hoặc `null`.
 * `daNoi` = server `ctwork` đang nối (đọc/ghi được ngầm).
 */
/**
 * 24/11/2026: trang HỌC LIỆU của cuongthai.com — bài khoá học (`/courses/…/learn`, `/academy/courses/…`), khoá sách
 * (`/language/<mã>/dekiru|jp|ch|ielts…|giao-tiep`), Code Lab, Exam Room. Trình duyệt ngầm của CuongMini KHÔNG đăng nhập
 * ⇒ gặp "Log in", không mở được mục bài (người dùng báo 24/11 khi nhờ dạy Dekiru Bài 1). Nội dung đọc thẳng bằng lệnh
 * MCP `hoc_tap` (action outline/lesson/exercises/exam/links/progress) — đúng quyền tài khoản, có đáp án để chấm.
 */
export function laTrangHocLieu(url: unknown): boolean {
  if (typeof url !== 'string' || !url.trim()) return false;
  let u: URL;
  try { u = new URL(url.trim()); } catch { try { u = new URL(`https://${url.trim().replace(/^\/+/, '')}`); } catch { return false; } }
  const host = u.hostname.toLowerCase().replace(/\.$/, '');
  if (host !== 'cuongthai.com' && !host.endsWith('.cuongthai.com')) return false;
  let p = u.pathname;
  try { p = decodeURIComponent(p); } catch { /* giữ */ }
  p = p.replace(/\/{2,}/g, '/').toLowerCase();
  return /^\/(academy\/)?courses\/[^/]+\/learn(\/|$)/.test(p)
    || /^\/language\/[a-z-]+\/(dekiru|jp|ch|ielts|giao-tiep)(\/|$)/.test(p)
    || /^\/(code-lab|exam)(\/|$)/.test(p);
}
/** Tool ĐỌC nội dung trang (mở trang cho người dùng xem thì vẫn được). */
const TOOL_DOC_TRANG = new Set(['web_tai', 'web_doc', 'web_bam', 'web_lien_ket']);

export function chanWebCtwork(ten: string, args: Record<string, unknown>, urlHienTai: string | null | undefined, daNoi: boolean): string | null {
  const hl = chanWebHocLieu(ten, args, urlHienTai, daNoi);
  if (hl) return hl;
  const ten0 = ten === 'web_tai_nhieu' ? 'web_tai' : ten;
  let dich: unknown[] = [];
  if (TOOL_CO_URL.has(ten0)) {
    const u = typeof args.url === 'string' && args.url.trim() ? args.url : null;
    dich = ten === 'web_tai_nhieu' && Array.isArray(args.urls) ? args.urls : [u ?? urlHienTai];
  } else if (TOOL_TRANG_HIEN.has(ten0)) dich = [urlHienTai];
  else return null;
  if (!dich.some(laTrangCtworkWeb)) return null;
  return daNoi
    ? 'TỪ CHỐI: không mở/lái giao diện CT Work bằng trình duyệt. Dùng tool mcp__ctwork__* — đọc/ghi CT Work chạy NGẦM trong CuongMini '
      + '(get_issue, search_issues, my_work, comment, transition, update_issue, create_issue, log_work, attach_file với `path` là file trên máy…). '
      + 'Tool chưa có trong danh sách ⇒ tìm trong MỤC LỤC rồi nap_tool_mcp. Đừng nhờ người dùng tự làm trên web.'
    : 'TỪ CHỐI: không mở/lái giao diện CT Work bằng trình duyệt. CT Work CHƯA nối với CuongMini — bảo người dùng gõ /ctwork '
      + '(một chạm, dùng tài khoản đang đăng nhập), rồi làm tiếp bằng tool mcp__ctwork__* (chạy ngầm, không mở trình duyệt).';
}

/** 24/11/2026: đọc trang học liệu bằng trình duyệt ⇒ chỉ sang lệnh `hoc_tap` (đọc thẳng nội dung, không cần đăng nhập web). */
export function chanWebHocLieu(ten: string, args: Record<string, unknown>, urlHienTai: string | null | undefined, daNoi: boolean): string | null {
  const ten0 = ten === 'web_tai_nhieu' ? 'web_tai' : ten;
  if (!TOOL_DOC_TRANG.has(ten0)) return null;
  const u = typeof args.url === 'string' && args.url.trim() ? args.url : null;
  const dich = ten === 'web_tai_nhieu' && Array.isArray(args.urls) ? args.urls : [ten0 === 'web_tai' ? (u ?? urlHienTai) : urlHienTai];
  if (!dich.some(laTrangHocLieu)) return null;
  return daNoi
    ? 'TỪ CHỐI: đừng đọc trang học liệu bằng trình duyệt (trình duyệt ngầm không đăng nhập ⇒ "Log in", không mở được mục bài). '
      + 'Đọc THẲNG bằng mcp__ctwork__hoc_tap: action outline (course=slug | book=dekiru&bai=N), lesson (course+lesson | book+bai+item), '
      + 'exercises, exam, links, progress — đúng quyền tài khoản, có đáp án để chấm. Luôn đưa người học link sâu trả về.'
    : 'TỪ CHỐI: trình duyệt ngầm không đăng nhập được trang học. Bảo người dùng gõ /ctwork (một chạm) rồi đọc bài bằng mcp__ctwork__hoc_tap.';
}
