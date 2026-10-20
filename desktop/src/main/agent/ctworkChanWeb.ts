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
export function chanWebCtwork(ten: string, args: Record<string, unknown>, urlHienTai: string | null | undefined, daNoi: boolean): string | null {
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
