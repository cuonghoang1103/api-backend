/**
 * Hộp thư admin — mọi việc cần admin biết đổ về MỘT chỗ.
 * ─────────────────────────────────────────────────────────────────────────
 * Vấn đề nó giải: sidebar /admin có 43 mục, thứ CẦN XỬ LÝ nằm rải rác trong
 * đó (đơn xin key lẫn trong một tab của /admin/commerce), và không có chỗ nào
 * trả lời được câu "bây giờ có gì đang chờ tôi?". Người dùng nói nguyên văn:
 * *"xin duyệt key nãy tôi phải mò mãi mới thấy"*.
 *
 * Một lời gọi `baoAdmin()` đi ra BA nơi:
 *   1. bảng `admin_notifications` — nguồn sự thật, có lịch sử, bấm vào là tới
 *      đúng chỗ xử lý;
 *   2. socket `admin:thong-bao` — chuông trong /admin sáng ngay;
 *   3. Telegram — đẩy ra điện thoại, để không phải mở web mới biết.
 *
 * ⚠️⚠️ NGUYÊN TẮC SỐ MỘT: BÁO HỎNG THÌ KHÔNG ĐƯỢC LÀM HỎNG VIỆC CHÍNH.
 * Hàm này được gọi ngay sau khi đặt đơn / thanh toán xong. Ném lỗi ra ngoài ở
 * đây nghĩa là một lần Telegram chậm mạng cũng làm rớt một đơn hàng đã trả
 * tiền. Nên MỌI đường đều nuốt lỗi và chỉ ghi log. Cùng nguyên tắc đã viết ở
 * `viTien.ts`: cái khoá tự sập khi đồng hồ đo hỏng thì tệ hơn là không có khoá.
 *
 * ⚠️ Gọi nó NGOÀI `prisma.$transaction`. Nằm trong giao dịch thì nó giữ kết
 * nối suốt thời gian chờ mạng Telegram, và nếu giao dịch bị cuộn lại thì
 * Telegram đã trót gửi rồi — admin nhận báo "đã thanh toán" cho một đơn không
 * tồn tại.
 */
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

export type LoaiThongBao =
  | 'XIN_KEY'                // người dùng xin key OpenCode
  | 'DON_MOI'                // đơn hàng shop vừa được đặt
  | 'DA_THANH_TOAN'          // đơn đã trả tiền xong
  | 'CHUYEN_KHOAN_CHO_DUYET' // chuyển khoản tay, chờ admin xác nhận
  | 'DOI_KEY'                // khách báo key hỏng, xin đổi
  | 'BAO_CAO'                // báo cáo vi phạm
  | 'XOA_TAI_KHOAN'          // yêu cầu xoá tài khoản
  | 'NAP_DIEM'               // nạp ví điểm
  | 'MUA_PRO'                // mua gói Pro
  | 'KHAC';

export interface ThongBaoAdmin {
  loai: LoaiThongBao;
  tieuDe: string;
  noiDung?: string | null;
  /** Đường dẫn trong /admin. Thiếu nó thì admin lại phải đi mò — cố gắng luôn có. */
  duongDan?: string | null;
  /** `can_xu_ly` hiện số đỏ và đếm riêng; `thuong` chỉ để biết. */
  mucDo?: 'can_xu_ly' | 'thuong';
  userId?: number | null;
  entityId?: number | null;
  /** Chặn trùng khi webhook gọi lại. Ví dụ `DA_THANH_TOAN:shop:1234`. */
  khoaChongTrung?: string | null;
}

/** Biểu tượng cho tin Telegram — nhìn một cái biết loại việc. */
const BIEU_TUONG: Record<LoaiThongBao, string> = {
  XIN_KEY: '🔑',
  DON_MOI: '📦',
  DA_THANH_TOAN: '💰',
  CHUYEN_KHOAN_CHO_DUYET: '🏦',
  DOI_KEY: '🛠️',
  BAO_CAO: '🚩',
  XOA_TAI_KHOAN: '🗑️',
  NAP_DIEM: '🪙',
  MUA_PRO: '👑',
  KHAC: '🔔',
};

const WEB = (process.env.PUBLIC_WEB_URL || 'https://cuongthai.com').replace(/\/+$/, '');

// ─────────────────────────── Telegram ───────────────────────────
//
// Thiếu cấu hình ⇒ TẮT LẶNG LẼ, không phải lỗi. Kênh Telegram là phần thêm;
// hộp thư trong /admin mới là nguồn sự thật. Ghi log đúng MỘT lần để người
// vận hành biết nó đang tắt, chứ không rải cảnh báo mỗi lượt.
let daKeuThieuTelegram = false;

function cauHinhTelegram(): { token: string; chatId: string } | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID?.trim();
  if (!token || !chatId) {
    if (!daKeuThieuTelegram) {
      daKeuThieuTelegram = true;
      logger.info('[thong-bao-admin] chưa cắm TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID — bỏ qua kênh Telegram');
    }
    return null;
  }
  return { token, chatId };
}

/** Telegram HTML chỉ cho vài thẻ; thoát ba ký tự bắt buộc kẻo tin bị từ chối. */
function thoatHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function guiTelegram(tb: ThongBaoAdmin): Promise<void> {
  const cau = cauHinhTelegram();
  if (!cau) return;
  const dong = [`${BIEU_TUONG[tb.loai] ?? '🔔'} <b>${thoatHtml(tb.tieuDe)}</b>`];
  if (tb.noiDung) dong.push(thoatHtml(tb.noiDung));
  if (tb.duongDan) dong.push(`${WEB}${tb.duongDan}`);
  try {
    const r = await fetch(`https://api.telegram.org/bot${cau.token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: cau.chatId,
        text: dong.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!r.ok) {
      // Đọc thân lỗi: Telegram nói rõ "chat not found" / "bot was blocked",
      // mà chỉ có mã 400 thì không ai đoán ra đang sai cái gì.
      const chu = await r.text().catch(() => '');
      logger.warn('[thong-bao-admin] Telegram từ chối', { http: r.status, than: chu.slice(0, 200) });
    }
  } catch (err) {
    logger.warn('[thong-bao-admin] không gửi được Telegram', { error: (err as Error).message });
  }
}

// ─────────────────────────── Socket ───────────────────────────
//
// Nạp động để module này KHÔNG kéo theo cả tầng socket lúc chạy kiểm thử hay
// script CLI. Không có socket ⇒ bỏ qua, chuông vẫn tự làm mới khi mở trang.
async function banSocket(payload: unknown): Promise<void> {
  try {
    const mod = (await import('../socket/messaging.socket.js')) as {
      getIO?: () => { to: (phong: string) => { emit: (su: string, d: unknown) => void } } | null;
    };
    mod.getIO?.()?.to('admin')?.emit('admin:thong-bao', payload);
  } catch {
    /* không có socket thì thôi */
  }
}

/**
 * Ghi một việc vào hộp thư admin và đẩy ra mọi kênh.
 *
 * Trả về `null` khi trùng (đã có bản ghi cùng `khoaChongTrung`) — nơi gọi
 * không cần quan tâm, nhưng nhờ đó webhook gọi lại mười lần vẫn chỉ một tin.
 */
export async function baoAdmin(tb: ThongBaoAdmin): Promise<{ id: number } | null> {
  try {
    if (tb.khoaChongTrung) {
      const daCo = await prisma.adminNotification.findUnique({
        where: { khoaChongTrung: tb.khoaChongTrung },
        select: { id: true },
      });
      if (daCo) return null;
    }

    const row = await prisma.adminNotification.create({
      data: {
        loai: tb.loai,
        tieuDe: tb.tieuDe.slice(0, 200),
        noiDung: tb.noiDung?.slice(0, 4000) ?? null,
        duongDan: tb.duongDan?.slice(0, 300) ?? null,
        mucDo: tb.mucDo ?? 'thuong',
        userId: tb.userId ?? null,
        entityId: tb.entityId ?? null,
        khoaChongTrung: tb.khoaChongTrung ?? null,
      },
      select: { id: true, loai: true, tieuDe: true, noiDung: true, duongDan: true, mucDo: true, createdAt: true },
    });

    // Hai kênh phụ chạy song song và KHÔNG chặn nơi gọi.
    void Promise.allSettled([banSocket(row), guiTelegram(tb)]);
    return { id: row.id };
  } catch (err) {
    // Kể cả P2002 (hai lượt webhook chạy song song cùng lọt qua bước kiểm
    // trên) cũng chỉ là "đã có tin rồi" — không phải lỗi cần dội lên trên.
    const ma = (err as { code?: string }).code;
    if (ma === 'P2002') return null;
    logger.error('[thong-bao-admin] không ghi được thông báo', {
      loai: tb.loai, error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/** Số việc đang chờ — dùng cho con số đỏ trên chuông. */
export async function demChuaDoc(): Promise<{ chuaDoc: number; canXuLy: number }> {
  const [chuaDoc, canXuLy] = await Promise.all([
    prisma.adminNotification.count({ where: { daDoc: false } }),
    prisma.adminNotification.count({ where: { mucDo: 'can_xu_ly', daXuLy: false } }),
  ]);
  return { chuaDoc, canXuLy };
}
