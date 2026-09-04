/**
 * ============================================================
 * ĐĂNG NHẬP OAUTH CHO APP — CỔNG VÒNG (loopback)
 * ============================================================
 *
 * Google/GitHub/Apple đăng nhập trên TRÌNH DUYỆT, rồi token phải quay về APP.
 * Đây là chỗ nhận nó.
 *
 * ─── Vì sao cổng vòng, không phải deep link `cuongthai://` ───
 * App ĐÃ CÓ sẵn hạ tầng deep link, nên đó là đường dễ hơn. Nhưng token đi qua
 * một URL của HỆ ĐIỀU HÀNH: nó lọt vào log hệ thống, vào lịch sử trình duyệt,
 * và bất kỳ app nào cũng có thể đăng ký cùng scheme để cướp. Đây là RFC 8252
 * (OAuth cho ứng dụng gốc) khuyên dùng cổng vòng, và đó cũng là cách mọi CLI
 * làm.
 *
 * Token đi từ trình duyệt tới `127.0.0.1` — KHÔNG ra khỏi máy.
 *
 * ─── Ba chốt, thiếu cái nào cũng thành cửa mở ───
 *  1. `nonce` NGẪU NHIÊN cho mỗi lượt. Cổng vòng thì app khác trên cùng máy
 *     cũng gọi được — không có nonce thì bất kỳ trang web nào bạn đang mở cũng
 *     nã `127.0.0.1:<port>/xong?token=<token-của-nó>` và app nhận bừa.
 *  2. CHỈ nghe trên `127.0.0.1`, không phải `0.0.0.0`. Nghe trên mọi giao diện
 *     là máy khác trong cùng mạng LAN cũng gửi được.
 *  3. HẾT GIỜ và ĐÓNG NGAY sau lượt đầu. Một cổng mở mãi là một cửa mở mãi.
 *  4. Trả token về ĐÚNG cửa sổ đã bấm đăng nhập (`event.sender`), không phải
 *     `getAllWindows()[0]`. App này có HAI cửa sổ — `index.html` và cửa sổ
 *     robot `robot.html` — và thứ tự trong mảng đó KHÔNG cố định. Đo thật
 *     24/08/2026: hai lần chạy y hệt nhau, chỉ khác thời gian chờ, một lần
 *     renderer nhận được token và một lần nhận `[]`; lần hỏng là lần cửa sổ
 *     robot đứng đầu mảng nên token bay vào con robot. Người dùng thấy trình
 *     duyệt báo "Đã đăng nhập" còn app thì đứng nguyên ở màn đăng nhập.
 */
import { createServer, type Server } from 'node:http';
import { randomBytes } from 'node:crypto';
import { BrowserWindow, shell } from 'electron';
import { WEB_ORIGIN } from '../config';
import { handle } from './index';

/** Bỏ cuộc sau ngần này. Đủ dài để đăng nhập thong thả, đủ ngắn để không quên. */
const HET_GIO_MS = 5 * 60 * 1000;

interface Luot {
  may: Server;
  nonce: string;
  hetGio: NodeJS.Timeout;
  /** Cửa sổ đã bấm đăng nhập — token phải quay về ĐÚNG nó. Xem chốt 4. */
  cuaSo: BrowserWindow;
}

/** MỘT lượt tại một thời điểm. Hai cổng cùng mở là hai cửa cùng mở. */
let dangCho: Luot | null = null;

function dongLuot(): void {
  if (!dangCho) return;
  clearTimeout(dangCho.hetGio);
  /*
   * ⚠️ `close()` KHÔNG ĐỦ — nó chỉ ngừng nhận kết nối MỚI, còn kết nối
   * keep-alive đang mở vẫn phục vụ tiếp. Đo thật 24/08/2026: sau lượt đăng
   * nhập đầu tiên, gọi lại `127.0.0.1:<cong>/xong` VẪN VÀO ĐƯỢC, vì `fetch`
   * dùng lại đúng kết nối cũ. Nghĩa là cổng tưởng đã đóng thực ra còn mở.
   *
   * `closeAllConnections()` cắt cả những kết nối đang mở. Không có nó thì mọi
   * lời hứa "đóng ngay sau lượt đầu" ở đầu tệp này là nói suông.
   */
  dangCho.may.closeAllConnections();
  dangCho.may.close();
  dangCho = null;
}

/** Trang mỏng hiện trong trình duyệt sau khi xong — người dùng cần biết quay lại app. */
function trangXong(ok: boolean): string {
  const tieuDe = ok ? 'Đã đăng nhập' : 'Không nhận được đăng nhập';
  const than = ok
    ? 'Bạn có thể đóng thẻ này và quay lại app CuongThai.'
    : 'Yêu cầu không khớp phiên đang chờ. Hãy thử lại từ app.';
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<title>${tieuDe}</title><style>
body{margin:0;height:100vh;display:grid;place-items:center;background:#0f0f14;color:#e8e8f0;
font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-align:center}
h1{font-size:19px;margin:0 0 6px}p{margin:0;color:#a0a0b0;font-size:13.5px}
</style></head><body><div><h1>${tieuDe}</h1><p>${than}</p></div></body></html>`;
}

export function registerOauthHandlers(): void {
  handle('oauth:batDau', async ({ provider }, event) => {
    dongLuot(); // lượt cũ còn treo thì bỏ, người dùng vừa bấm lại

    const cuaSo = BrowserWindow.fromWebContents(event.sender);
    if (!cuaSo) throw new Error('Không xác định được cửa sổ gọi đăng nhập.');

    const nonce = randomBytes(24).toString('hex');

    const may = createServer((req, res) => {
      /* `req.url` là đường dẫn tương đối; cần một gốc giả để phân tích. Gốc này
         KHÔNG được dùng để đi đâu cả, chỉ để `URL` chịu phân tích. */
      const u = new URL(req.url ?? '/', 'http://127.0.0.1');
      if (u.pathname !== '/xong') { res.writeHead(404).end(); return; }

      const token = u.searchParams.get('token') ?? '';
      const n = u.searchParams.get('nonce') ?? '';
      /* `dangCho` có thể đã null (hết giờ, hoặc lượt này vừa xong) — lúc đó
         mọi thứ tới đây đều KHÔNG hợp lệ, kể cả nonce đúng. */
      const hopLe = Boolean(token) && Boolean(dangCho) && n === nonce;

      res.writeHead(hopLe ? 200 : 400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(trangXong(hopLe));

      if (!hopLe || !dangCho) return;
      /* Gửi cho renderer RỒI mới đóng: đóng trước thì phản hồi trên có thể
         chưa kịp bay đi và người dùng thấy một thẻ trắng. */
      /* Cửa sổ có thể đã bị đóng trong lúc người dùng đăng nhập ở trình duyệt
         (5 phút là dài). `isDestroyed()` chặn một lần ném làm chết cả handler. */
      if (!dangCho.cuaSo.isDestroyed()) {
        dangCho.cuaSo.webContents.send('oauth:xong', { token });
      }
      dongLuot();
    });

    await new Promise<void>((giai, tuChoi) => {
      may.once('error', tuChoi);
      // Cổng 0 = để hệ điều hành chọn cổng rảnh. Đặt cứng một cổng là hỏng
      // ngay khi có thứ khác đang chiếm nó.
      may.listen(0, '127.0.0.1', giai);
    });

    const cong = (may.address() as { port: number }).port;
    dangCho = { may, nonce, cuaSo, hetGio: setTimeout(dongLuot, HET_GIO_MS) };

    /* Mở TRÌNH DUYỆT HỆ THỐNG, không mở cửa sổ Electron: người dùng phải nhìn
       thấy thanh địa chỉ thật của Google/Apple để biết mình đang gõ mật khẩu
       vào đâu. Một cửa sổ trong app thì không chứng minh được điều đó — và đó
       chính là hình dạng của một trang lừa đảo. */
    const url = new URL('/login', WEB_ORIGIN);
    url.searchParams.set('dt_cong', String(cong));
    url.searchParams.set('dt_nonce', nonce);
    url.searchParams.set('dt_nha', provider);
    await shell.openExternal(url.toString());

    return { ok: true, cong };
  });

  handle('oauth:huy', () => { dongLuot(); return { ok: true }; });
}

/** Gọi lúc thoát app — không để lại cổng nào đang nghe. */
export function dongOauthDangCho(): void { dongLuot(); }
