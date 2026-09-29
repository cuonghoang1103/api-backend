/**
 * ============================================================
 * Đo tốc độ mạng — download / upload / ping
 * ============================================================
 *
 * Ba endpoint tối giản để app desktop và web đo tốc độ đường truyền của người
 * dùng TỚI máy chủ cuongthai.com. Không phải "tốc độ Internet tuyệt đối" (thứ
 * đó cần nhiều máy chủ ở nhiều nơi), mà là tốc độ thực dụng: mạng nhà bạn tải
 * về / gửi lên máy chủ này nhanh cỡ nào. Đúng cái người dùng cần để biết
 * "mạng đang yếu vì ai đó tải nặng".
 *
 * Vì sao có auth + rate limit:
 *   Ba endpoint này bơm/nuốt băng thông thật của VPS. Không khoá thì bất kỳ ai
 *   cũng gọi `/tai-xuong?bytes=...` liên tục để rút băng thông máy chủ (một
 *   kiểu DoS rẻ tiền). Nên: bắt đăng nhập, chặn theo người, và CHẶN TRẦN
 *   `bytes` mỗi lượt. Client muốn đo nhanh thì gọi nhiều lượt / nhiều luồng
 *   song song, nhưng mỗi lượt vẫn có trần và cả cụm vẫn dưới rate limit.
 *
 * Vì sao KHÔNG nén: dữ liệu tải về là byte NGẪU NHIÊN, không nén được — nếu
 * nén thì phép đo thành đo tốc độ nén, không phải tốc độ mạng. Header
 * `Cache-Control: no-store` để proxy/nginx không trả bản cache (đo phải chạm
 * máy chủ thật mỗi lượt).
 */
import { Router, type Response, type Request } from 'express';
import crypto from 'node:crypto';
import { authenticate } from '../middleware/auth.js';
import { tocDoTaiXuongLimiter, tocDoTaiLenLimiter } from '../middleware/orderRateLimit.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

/** Trần mỗi lượt tải về. 50 MB đủ để đo đường ~vài trăm Mbps trong ~1 giây. */
const MAX_TAI_XUONG = 50 * 1024 * 1024;
/** Kích thước mỗi khối random sinh ra. 64 KB: đủ lớn để rẻ, đủ nhỏ để mượt. */
const KHOI = 64 * 1024;

/**
 * Ping: trả về mốc thời gian máy chủ, gói tin bé nhất có thể. Client gọi nhiều
 * lần, đo round-trip và độ lệch (jitter). `no-store` là bắt buộc — cache một
 * lần là mọi ping sau đo nhầm tốc độ đọc cache của trình duyệt.
 */
router.get('/ping', authenticate, (_req: Request, res: Response<ApiResponse>) => {
  res.set('Cache-Control', 'no-store');
  res.json({ success: true, data: { t: Date.now() } });
});

/**
 * Tải về `bytes` byte ngẫu nhiên (mặc định 10 MB, trần 50 MB). Ghi theo dòng
 * (stream) để không giữ cả khối trong RAM — 50 MB × nhiều người cùng lúc là đủ
 * làm sập tiến trình nếu dựng cả buffer.
 */
router.get('/tai-xuong', authenticate, tocDoTaiXuongLimiter, (req: Request, res: Response) => {
  const yeuCau = Number.parseInt(String(req.query.bytes ?? ''), 10);
  const tong = Number.isFinite(yeuCau) && yeuCau > 0 ? Math.min(yeuCau, MAX_TAI_XUONG) : 10 * 1024 * 1024;

  res.set('Cache-Control', 'no-store');
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Length', String(tong));

  let daGui = 0;
  // Ghi theo nhịp thoát backpressure: chỉ ghi tiếp khi buffer socket đã vơi,
  // nếu không thì một client chậm làm RAM máy chủ phình theo tốc độ sinh dữ
  // liệu chứ không theo tốc độ mạng.
  const bom = (): void => {
    while (daGui < tong) {
      const con = Math.min(KHOI, tong - daGui);
      const khoi = crypto.randomBytes(con);
      daGui += con;
      const conCho = !res.write(khoi);
      if (conCho) {
        res.once('drain', bom);
        return;
      }
    }
    res.end();
  };
  // Client đóng giữa chừng (bấm Dừng) — ngừng sinh dữ liệu.
  req.on('close', () => { daGui = tong; });
  bom();
});

/**
 * Tải lên: nuốt toàn bộ body, đếm byte, trả về số byte nhận được. Client gửi
 * một khối random và bấm giờ. Không lưu gì — chỉ đo.
 *
 * ⚠️ `express.raw` phải được gắn cho riêng route này ở index.ts TRƯỚC
 * `express.json`, nếu không bộ đọc JSON sẽ nuốt body trước và cố phân tích một
 * khối nhị phân.
 */
const MAX_TAI_LEN = 50 * 1024 * 1024;

router.post('/tai-len', authenticate, tocDoTaiLenLimiter, (req: Request, res: Response<ApiResponse>) => {
  res.set('Cache-Control', 'no-store');

  // Nếu một body-parser phía trước ĐÃ đọc body thành Buffer thì dùng luôn.
  if (Buffer.isBuffer(req.body) && req.body.length > 0) {
    res.json({ success: true, data: { nhan: req.body.length } });
    return;
  }

  // ⚠️ NGƯỢC LẠI PHẢI TỰ ĐỌC VÀ RÚT CẠN STREAM. Đây là bài học đắt: nếu handler
  // trả lời mà KHÔNG đọc hết body của request, nginx/Cloudflare giữ kết nối chờ
  // client gửi nốt rồi mới đóng — với body có dữ liệu thì treo mãi (đo thật:
  // POST rỗng 200 nhanh, POST 100 byte treo 20s, cả curl lẫn fetch). Đọc stream
  // ở đây vừa đếm byte vừa rút cạn, nên luôn trả lời được.
  let nhan = 0;
  let xong = false;
  const tra = (): void => {
    if (xong) return;
    xong = true;
    res.json({ success: true, data: { nhan } });
  };
  req.on('data', (khuc: Buffer) => {
    nhan += khuc.length;
    if (nhan > MAX_TAI_LEN) req.destroy();
  });
  req.on('end', tra);
  // Client đóng/huỷ giữa chừng: vẫn chốt bằng số đã nhận, không để treo.
  req.on('close', tra);
  req.on('error', () => {
    if (!res.headersSent) res.status(400).json({ success: false, message: 'Tải lên lỗi.' });
  });
});

export default router;
