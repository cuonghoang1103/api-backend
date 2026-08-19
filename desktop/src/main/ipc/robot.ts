/**
 * IPC của cửa sổ robot nổi.
 *
 * Mỏng có chủ ý — mọi quyết định về cửa sổ nằm ở `main/robotNoi.ts`.
 */
import {
  datNacCo, doiCo, doiKichThuoc, keoBatDau, keoToi, keoXong, moTrangChinh,
} from '../robotNoi';
import { baoNhac } from '../robotTin';
import { API_ORIGIN } from '../config';
import { readStoredSession } from './auth';
import { getSettings } from '../store';
import { tachCau } from '../../renderer/features/odin/tachCau';
import { handle } from './index';

export function registerRobotHandlers(): void {
  handle('robot:doiKichThuoc', ({ rong }) => doiKichThuoc(rong));

  handle('robot:doiCo', ({ co }) => doiCo(co));

  handle('robot:baoNhac', ({ ten }) => baoNhac(ten));

  handle('robot:datCo', ({ nac }) => { datNacCo(nac); });

  /* Kéo cửa sổ robot. Ba nhịp: chốt gốc, dời theo độ lệch, buông. Xem chú
     thích ở `robotNoi.ts` — vì sao không dùng `-webkit-app-region: drag`. */
  handle('robot:keoBatDau', () => { keoBatDau(); });
  handle('robot:keoToi', ({ dx, dy }) => { keoToi(Number(dx) || 0, Number(dy) || 0); });
  handle('robot:keoXong', () => { keoXong(); });

  handle('robot:moChinh', ({ duongDan }) => {
    // Chỉ nhận đường dẫn TRONG app, không nhận URL. Một chuỗi `https://…` lọt
    // vào đây sẽ được renderer chính coi là đích điều hướng.
    const sach = duongDan.startsWith('/') && !duongDan.startsWith('//') ? duongDan : '/chat';
    // Mở /chat mà đang có phiên nói thì mở ĐÚNG cuộc đó — đấy là toàn bộ lý do
    // người dùng bấm hai lần vào robot: họ muốn đọc lại thứ vừa nghe.
    moTrangChinh(sach, sach === '/chat' && phienNoi ? `phien=${encodeURIComponent(phienNoi)}` : '');
  });

  /**
   * Hỏi nhanh từ khung chat mini.
   *
   * KHÔNG chảy chữ: khung này chỉ vài dòng và người dùng đang làm việc khác,
   * nên một câu trả lời hoàn chỉnh xuất hiện một lần đọc dễ hơn là chữ nhảy
   * dần trong một ô nhỏ ở góc màn hình.
   *
   * Gọi từ MAIN chứ không từ cửa sổ robot: renderer của robot chạy ở origin
   * `app://` và mọi lời gọi từ đó phải qua CORS, trong khi main thì không.
   */
  handle('robot:hoi', async ({ chu }) => {
    const phien = readStoredSession();
    if (!phien) return { chu: 'Chưa đăng nhập. Mở app chính để đăng nhập trước.' };
    return { chu: await hoiTroLy(phien.sessionToken, chu, false) };
  });

  /**
   * NÓI với robot nổi — thu ở cửa sổ robot, ba chặng còn lại chạy ở đây.
   *
   * ─── VÌ SAO CẢ BA CHẶNG Ở MAIN ───
   * Cửa sổ robot chạy ở origin `app://cuongthai`. Mọi lời gọi từ đó ra máy chủ
   * phải qua CORS, và nó cũng không giữ phiên đăng nhập — `robot:hoi` đã đi
   * đường main vì đúng lý do này. Nhận dạng tiếng và máy đọc thì cùng cảnh.
   *
   * Renderer chỉ làm đúng một việc nó buộc phải làm: bật micro. `getUserMedia`
   * không tồn tại ở tiến trình main.
   */
  handle('robot:noi', async ({ tiengBase64 }) => {
    const phien = readStoredSession();
    if (!phien) return { cauHoi: '', traLoi: 'Chưa đăng nhập. Mở app chính để đăng nhập trước.', cau: [] };

    const token = phien.sessionToken;
    try {
      // ── 1. Nghe ──
      const byte = Buffer.from(tiengBase64, 'base64');
      const form = new FormData();
      form.append('audio', new Blob([byte], { type: 'audio/webm' }), 'noi.webm');
      const rNghe = await fetch(`${API_ORIGIN}/api/v1/ai/stt`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form,
      });
      const jNghe = await rNghe.json() as { message?: string; data?: { text?: string } };
      if (!rNghe.ok) return { cauHoi: '', traLoi: jNghe.message ?? `Nghe hỏng (${rNghe.status}).`, cau: [] };
      const cauHoi = jNghe.data?.text?.trim() ?? '';
      // Im lặng hoặc tiếng ồn ⇒ DỪNG ở đây. Đưa một chuỗi rỗng cho model thì nó
      // sẽ bịa ra một câu trả lời cho một câu hỏi không tồn tại.
      if (!cauHoi) return { cauHoi: '', traLoi: 'Mình chưa nghe rõ. Bạn nói lại giúp nhé.', cau: [] };

      // ── 2. Nghĩ ──
      const traLoi = await hoiTroLy(token, cauHoi, true);

      // ── 3. Trả về CÂU, không trả tiếng ──
      //
      // Renderer tự đặt hàng từng câu qua `robot:docCau` để dựng dây chuyền:
      // đang phát câu N thì đã sinh câu N+1. Trả sẵn một cục tiếng ở đây thì
      // không làm được điều đó, và bong bóng cũng không hiện theo nhịp đọc
      // được — nó chỉ biết cả bài.
      return { cauHoi, traLoi, cau: tachCau(traLoi) };
    } catch (err) {
      const loi = `Không gọi được máy chủ: ${(err as Error).message}`;
      return { cauHoi: '', traLoi: loi, cau: [loi] };
    }
  });

  handle('robot:docCau', async ({ cau }) => {
    const phien = readStoredSession();
    if (!phien || getSettings().odinNoiThanhTieng === false) return { tiengBase64: null };
    // Đọc hỏng thì KHÔNG làm hỏng cả lượt: người dùng vẫn còn chữ, và mất
    // tiếng một câu còn hơn mất cả câu trả lời.
    return { tiengBase64: await docThanhTieng(phien.sessionToken, cau).catch(() => null) };
  });
}

/** Nhịp hỏi máy đọc. Xem chú thích trong `docThanhTieng`. */
const NHIP_DAU_MS = 120;
const NHIP_TOI_DA_MS = 600;
const TRAN_DOC_MS = 45_000;

/**
 * Gọi máy đọc, trả tiếng dạng base64 (hoặc ném lỗi).
 *
 * ⚠️ NHỊP HỎI TĂNG DẦN, KHÔNG PHẢI 700ms CỐ ĐỊNH.
 *
 * Bản ở renderer hỏi lại mỗi 700ms. Một câu ngắn thường xong trong ~300ms, mà
 * lần hỏi đầu (ngay lập tức) gần như luôn nhận 202 — nên nó ngồi chờ đủ 700ms
 * rồi mới lấy được tiếng. Tức là **gần 400ms chờ suông** cho mỗi câu, và đó
 * chính là quãng người dùng thấy "chữ ra rồi mà giọng chưa ra".
 *
 * Bắt đầu 120ms rồi nhân 1,5 lần: câu ngắn lấy được gần như ngay, câu dài vẫn
 * không đấm máy chủ liên tục.
 */
async function docThanhTieng(token: string, chu: string): Promise<string> {
  const giong = ngonNguHienTai() === 'en' ? getSettings().odinGiongEn : getSettings().odinGiongVi;
  const dat = await fetch(`${API_ORIGIN}/api/v1/voice-mini/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text: chu, ...(typeof giong === 'string' && giong ? { voice: giong } : {}) }),
  });
  if (!dat.ok) throw new Error(`Máy đọc từ chối (${dat.status})`);
  const { data } = await dat.json() as { data?: { jobId?: string } };
  const jobId = data?.jobId;
  if (!jobId) throw new Error('Máy đọc không trả mã việc.');

  const hetHan = Date.now() + TRAN_DOC_MS;
  let nhip = NHIP_DAU_MS;
  for (;;) {
    if (Date.now() > hetHan) throw new Error('Máy đọc không trả kết quả kịp.');
    const lay = await fetch(`${API_ORIGIN}/api/v1/voice-mini/tts/${encodeURIComponent(jobId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (lay.status === 202) {
      await new Promise((x) => setTimeout(x, nhip));
      nhip = Math.min(Math.round(nhip * 1.5), NHIP_TOI_DA_MS);
      continue;
    }
    if (!lay.ok) throw new Error(`Lấy tiếng hỏng (${lay.status})`);
    return Buffer.from(await lay.arrayBuffer()).toString('base64');
  }
}

/**
 * PHIÊN CHAT CHO CÁC LƯỢT NÓI.
 *
 * ⚠️ TRƯỚC 18/08/2026 LƯỢT NÓI KHÔNG ĐƯỢC LƯU Ở ĐÂU CẢ. Máy chủ chỉ ghi
 * khi yêu cầu có `sessionId` (`if (sessionId)` trong `ai.service.ts`), mà
 * robot không gửi — nên mọi câu hỏi bằng giọng nói bay đi sau khi đọc
 * xong. Người dùng thấy bong bóng cắt mất chữ và không có đường nào xem
 * lại: "chữ nó không hiện hết, tôi kéo không xem được".
 *
 * Nay mọi lượt nói đi vào MỘT phiên chat, nên bấm hai lần vào robot là mở
 * đúng cuộc đó trong app với chữ đầy đủ và toàn bộ lịch sử.
 *
 * Giữ trong bộ nhớ, KHÔNG lưu xuống đĩa: mở app một lần là một cuộc trò
 * chuyện. Nối tiếp cuộc của hôm qua thì lịch sử thành một dải vô tận không
 * ai đọc lại.
 */
let phienNoi: string | null = null;

export function phienNoiHienTai(): string | null {
  return phienNoi;
}

/** Ngôn ngữ người dùng đã khoá trong thiết đặt. */
function ngonNguHienTai(): 'vi' | 'en' {
  return getSettings().odinNgonNgu === 'en' ? 'en' : 'vi';
}

/**
 * Hỏi trợ lý, trả về câu đã gom đủ.
 *
 * @param laLoiNoi Câu trả lời sẽ được ĐỌC THÀNH TIẾNG ⇒ gửi `voice: true` để
 *   máy chủ áp `VOICE_RULES` (2–4 câu, không markdown). Thiếu cờ này chính là
 *   lỗi 18/08/2026: bong bóng robot hiện nguyên một bài so sánh Spring Boot
 *   với Node.js kèm cả khối ```javascript, che gần hết màn hình.
 */
async function hoiTroLy(token: string, chu: string, laLoiNoi: boolean): Promise<string> {
    // Chưa có phiên thì tạo. Hỏng thì KHÔNG chặn đường: mất lịch sử còn hơn
    // mất câu trả lời — người dùng đang chờ nghe, không đang xem lịch sử.
    if (!phienNoi) {
      phienNoi = await fetch(`${API_ORIGIN}/api/v1/ai/chat/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: 'Trò chuyện bằng giọng nói' }),
      })
        .then((r) => (r.ok ? r.json() as Promise<{ data?: { sessionId?: string } }> : null))
        .then((j) => j?.data?.sessionId ?? null)
        .catch(() => null);
    }

    try {
      const res = await fetch(`${API_ORIGIN}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          message: chu,
          ngonNgu: ngonNguHienTai(),
          ...(phienNoi ? { sessionId: phienNoi } : {}),
          ...(laLoiNoi ? { voice: true } : {}),
        }),
      });
      if (!res.ok || !res.body) return `Máy chủ trả về ${res.status}.`;

      // Đọc hết SSE rồi mới trả — khung mini không chảy chữ.
      const giaiMa = new TextDecoder();
      let dem = '';
      let ra = '';
      for await (const mau of res.body as unknown as AsyncIterable<Uint8Array>) {
        dem += giaiMa.decode(mau, { stream: true });
        const dong = dem.split('\n');
        dem = dong.pop() ?? '';
        for (const d of dong) {
          if (!d.startsWith('data: ')) continue;
          try {
            const e = JSON.parse(d.slice(6)) as { type?: string; text?: string; error?: string };
            if (e.type === 'chunk' && e.text) ra += e.text;
            if (e.type === 'error' && e.error) ra += `\n[lỗi] ${e.error}`;
          } catch { /* khung lạ — bỏ qua, app cũ không được vỡ vì khung mới */ }
        }
      }
      return ra.trim() || '(không có nội dung)';
    } catch (err) {
      return `Không gọi được máy chủ: ${(err as Error).message}`;
    }
}
