/**
 * ============================================================
 * NGUỒN TIN CHO ROBOT NỔI
 * ============================================================
 *
 * Con robot chỉ có ích nếu nó BÁO được. Người dùng đang ở Chrome, ở VS Code, ở
 * đâu đó — và cái duy nhất của CuongThai còn nhìn thấy là con robot ở góc màn
 * hình. Nếu nó chỉ ngồi im thì nó là đồ trang trí.
 *
 * ─── VÌ SAO HỎI THĂM (POLL) CHỨ KHÔNG PHẢI SOCKET ───
 * App đã có socket, nhưng nó sống trong RENDERER của cửa sổ chính. Cửa sổ đó có
 * thể đã đóng (macOS) trong khi app vẫn chạy — đúng cái tình huống người dùng
 * mô tả ("chạy ngầm hoặc chưa quit"). Một vòng hỏi thăm ở MAIN thì độc lập với
 * mọi cửa sổ. Hai lời gọi GET mỗi 25 giây là cái giá rẻ để đổi lấy điều đó.
 *
 * ─── BA CHỖ DỄ LÀM SAI ───
 *
 *  1. **Lần hỏi ĐẦU TIÊN chỉ để lấy mốc, KHÔNG được báo.** Không thì mỗi lần mở
 *     app là một bong bóng "có 7 tin nhắn mới" cho những tin đã đọc từ hôm qua.
 *  2. **Chỉ báo khi số TĂNG.** Đọc bớt tin làm số giảm; báo theo "số > 0" thì
 *     robot lải nhải mỗi 25 giây tới khi người dùng đọc sạch hộp thư.
 *  3. **Im khi cửa sổ chính đang được nhìn.** Người dùng đang ở trong app thì họ
 *     THẤY chuông rồi; một bong bóng nữa chỉ là nói lại thứ đã hiển thị.
 */
import { API_ORIGIN } from './config';
import { readStoredSession } from './ipc/auth';
import { baoRobot, cuaSoChinh, robotDangMo } from './robotNoi';

/** Nhịp hỏi thăm. Đủ nhanh để "mới" còn nghĩa là mới, đủ chậm để không tốn gì. */
const NHIP_MS = 25_000;
/** Gặp lỗi thì giãn ra — mạng chết không đáng bị đấm 2 lần mỗi phút. */
const NHIP_LOI_MS = 120_000;

interface Dem { tinNhan: number; thongBao: number }

let dongHo: ReturnType<typeof setTimeout> | null = null;
/** `null` = chưa có mốc. Xem chú thích (1) ở đầu file. */
let mocTruoc: Dem | null = null;
let dangChay = false;

async function docSo(duong: string, khoa: string, token: string): Promise<number | null> {
  try {
    const res = await fetch(`${API_ORIGIN}${duong}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { data?: Record<string, unknown> };
    const v = j.data?.[khoa];
    return typeof v === 'number' ? v : null;
  } catch {
    return null;
  }
}

/**
 * ⚠️ Hai endpoint, HAI TÊN TRƯỜNG KHÁC NHAU: tin nhắn trả `count`, thông báo
 * trả `unreadCount`. Dùng nhầm thì `undefined` → `null` → im lặng vĩnh viễn,
 * và không có lỗi nào để lần ra.
 */
async function demHienTai(token: string): Promise<Dem | null> {
  const [tinNhan, thongBao] = await Promise.all([
    docSo('/api/v1/messages/unread-count', 'count', token),
    docSo('/api/v1/social/notifications/unread-count', 'unreadCount', token),
  ]);
  if (tinNhan === null && thongBao === null) return null; // mất mạng, giữ nguyên mốc
  return { tinNhan: tinNhan ?? mocTruoc?.tinNhan ?? 0, thongBao: thongBao ?? mocTruoc?.thongBao ?? 0 };
}

function dangNhinApp(): boolean {
  const w = cuaSoChinh();
  return !!w && !w.isMinimized() && w.isVisible() && w.isFocused();
}

function chu(n: number, mot: string): string {
  return n === 1 ? mot : `${n} ${mot}`;
}

async function motVong(): Promise<number> {
  if (!robotDangMo()) return NHIP_MS;

  const phien = readStoredSession();
  if (!phien) { mocTruoc = null; return NHIP_MS; } // đăng xuất ⇒ quên mốc cũ

  const nay = await demHienTai(phien.sessionToken);
  if (!nay) return NHIP_LOI_MS;

  const truoc = mocTruoc;
  mocTruoc = nay;
  if (!truoc) return NHIP_MS; // lần đầu: chỉ lấy mốc

  // Đang nhìn app thì cập nhật mốc nhưng KHÔNG báo — nếu không, mở app ra đọc
  // xong quay đi là ăn một bong bóng nhắc lại thứ vừa đọc.
  if (dangNhinApp()) return NHIP_MS;

  const themTin = nay.tinNhan - truoc.tinNhan;
  const themBao = nay.thongBao - truoc.thongBao;

  if (themTin > 0) {
    baoRobot('robot:tin', { loai: 'tin-nhan', chu: `Có ${chu(themTin, 'tin nhắn mới')}` });
  } else if (themBao > 0) {
    // `else if`: hai bong bóng chồng nhau thì cái sau đè cái trước ngay lập tức,
    // người dùng chỉ kịp thấy một cái nháy. Tin nhắn được ưu tiên.
    baoRobot('robot:tin', { loai: 'thong-bao', chu: `Có ${chu(themBao, 'thông báo mới')}` });
  }
  return NHIP_MS;
}

function hen(ms: number): void {
  dongHo = setTimeout(() => { void chay(); }, ms);
  // Vòng hỏi thăm KHÔNG được giữ tiến trình sống. Không có dòng này thì
  // `app.quit()` vẫn thoát (Electron không đợi timer), nhưng mọi kiểm thử chạy
  // Node thuần sẽ treo tới khi bị giết — và đó là kiểu treo khó hiểu nhất.
  dongHo.unref?.();
}

async function chay(): Promise<void> {
  if (!dangChay) return;
  let ms = NHIP_LOI_MS;
  try {
    ms = await motVong();
  } catch {
    // Một vòng hỏng KHÔNG được giết cả vòng lặp — nếu không, một trục trặc mạng
    // thoáng qua sẽ làm robot câm vĩnh viễn tới lần khởi động sau.
  }
  if (dangChay) hen(ms);
}

export function batTheoDoiTin(): void {
  if (dangChay) return;
  dangChay = true;
  hen(NHIP_MS);
}

export function dungTheoDoiTin(): void {
  dangChay = false;
  if (dongHo) clearTimeout(dongHo);
  dongHo = null;
  mocTruoc = null;
}

/**
 * Nhạc đang phát — do renderer báo lên, không hỏi thăm được.
 *
 * Chỉ hiện khi người dùng ĐANG Ở CHỖ KHÁC. Đứng ngay trong trang nhạc mà robot
 * còn thông báo tên bài đang phát thì đó là nói lại điều hiển nhiên.
 */
export function baoNhac(ten: string): void {
  if (dangNhinApp()) return;
  baoRobot('robot:tin', { loai: 'nhac', chu: `♪ ${ten}` });
}

/** Việc của agent chạy xong. Cũng chỉ báo khi người dùng đã đi chỗ khác. */
export function baoAgentXong(chuThich: string): void {
  if (dangNhinApp()) return;
  baoRobot('robot:tin', { loai: 'agent', chu: chuThich });
}

/**
 * Có bản app mới, đã tải sẵn, chỉ chờ khởi động lại.
 *
 * Cũng chỉ báo khi người dùng ĐANG Ở CHỖ KHÁC — ngồi ngay trong app thì đã có
 * hộp nhắc ở góc và dải ở cạnh tài khoản, robot nói thêm là làm phiền.
 *
 * Đây là mảnh cuối để tin "có bản mới" tới được người dùng ở MỌI tình huống:
 *  • đang nhìn app  → hộp nhắc góc phải dưới + dải cạnh tài khoản
 *  • đang làm việc khác → robot nổi ngoài app (chính hàm này)
 *  • không để ý gì   → lần mở app sau, kiểm sau 15 giây là thấy
 */
export function baoBanMoi(version: string): void {
  if (dangNhinApp()) return;
  baoRobot('robot:tin', { loai: 'thong-bao', chu: `Có bản ${version} — bấm để khởi động lại` });
}

/** Dùng cho kiểm thử: ép một vòng chạy ngay thay vì đợi 25 giây. */
export async function _motVongChoKiemThu(): Promise<void> {
  await motVong();
}
