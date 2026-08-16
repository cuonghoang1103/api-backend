/**
 * Chế độ Trò chuyện — chat thường, chảy chữ theo thời gian thực.
 *
 * Gọi `POST /api/v1/ai/chat` (SSE) bằng `fetch` thẳng chứ không qua
 * `api.request()`: `request()` đọc trọn thân rồi `JSON.parse`, tức là nó sẽ
 * ngồi chờ tới khi máy chủ đóng kết nối — đúng thứ mà stream sinh ra để tránh.
 *
 * ─── CỐ Ý KHÔNG CÓ Ở ĐÂY ───
 * Đính kèm ảnh và PDF. Đường đó ở backend còn phải rút chữ từ PDF, ép model
 * lên bậc nhìn được ảnh, và có trần dung lượng riêng — cả một mảng riêng, và
 * làm dở nó thì người dùng đính kèm file rồi nhận về câu trả lời như chưa từng
 * thấy file nào. Bản web đã làm đủ; ở đây nói thẳng là chưa có, kèm đường dẫn
 * sang web.
 */
import { useEffect, useRef, useState } from 'react';
import { CircleStop, Loader2, MessageSquare, Send } from 'lucide-react';
import { useSession } from '../../auth/session';

interface Luot { vai: 'user' | 'assistant'; text: string }

/** Số lượt cũ gửi kèm làm ngữ cảnh. Đủ để nhớ mạch, không đủ để phình hoá đơn. */
const SO_LUOT_NGU_CANH = 10;

export function ChatMode() {
  const { api } = useSession();
  const [luot, datLuot] = useState<Luot[]>([]);
  const [nhap, datNhap] = useState('');
  const [dangChay, datDangChay] = useState(false);
  const [dangCho, datDangCho] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const huyRef = useRef<AbortController | null>(null);
  const cuonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cuonRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight;
  }, [luot, dangCho]);

  // Rời trang giữa chừng ⇒ cắt kết nối. Không cắt thì stream chạy tiếp tới cùng
  // và vẫn bị tính tiền, chỉ khác là không còn ai đọc.
  useEffect(() => () => huyRef.current?.abort(), []);

  const guiDi = async (): Promise<void> => {
    const text = nhap.trim();
    if (!text || dangChay || !api) return;

    const truoc = [...luot, { vai: 'user' as const, text }];
    datLuot(truoc);
    datNhap('');
    datLoi(null);
    datDangChay(true);
    datDangCho(true);

    const dieuKhien = new AbortController();
    huyRef.current = dieuKhien;

    try {
      const res = await fetch(`${api.baseUrlForForms()}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...api.authHeaders() },
        signal: dieuKhien.signal,
        body: JSON.stringify({
          message: text,
          history: truoc.slice(-SO_LUOT_NGU_CANH - 1, -1).map((l) => ({ role: l.vai, content: l.text })),
        }),
      });
      if (!res.ok || !res.body) throw new Error(`Máy chủ trả về ${res.status}`);

      const doc = res.body.getReader();
      const giaiMa = new TextDecoder();
      let dem = '';
      let daMo = false;

      for (;;) {
        const { done, value } = await doc.read();
        if (done) break;
        dem += giaiMa.decode(value, { stream: true });
        const dong = dem.split('\n');
        dem = dong.pop() ?? '';

        for (const d of dong) {
          if (!d.startsWith('data: ')) continue;
          let e: { type?: string; text?: string; error?: string };
          try { e = JSON.parse(d.slice(6)); } catch { continue; }

          if (e.type === 'chunk' && e.text) {
            datDangCho(false);
            const mieng = e.text;
            datLuot((cu) => {
              if (!daMo) { daMo = true; return [...cu, { vai: 'assistant', text: mieng }]; }
              const cuoi = cu[cu.length - 1];
              if (!cuoi || cuoi.vai !== 'assistant') return [...cu, { vai: 'assistant', text: mieng }];
              return [...cu.slice(0, -1), { vai: 'assistant', text: cuoi.text + mieng }];
            });
          } else if (e.type === 'error') {
            datLoi(e.error ?? 'Lỗi không rõ.');
          }
          // 'connected' | 'model' | 'reasoning' | 'figure_fix' | 'done' — bản
          // này không dùng tới, bỏ qua im lặng là đúng: thêm khung mới ở máy
          // chủ không được phép làm vỡ app cũ đang cài trên máy người dùng.
        }
      }
    } catch (err) {
      if (!dieuKhien.signal.aborted) datLoi((err as Error).message);
    } finally {
      huyRef.current = null;
      datDangChay(false);
      datDangCho(false);
    }
  };

  return (
    <div className="ct-agent">
      <div className="ct-agent-scroll" ref={cuonRef}>
        {luot.length === 0 && (
          <div className="ct-agent-trong">
            <MessageSquare size={26} aria-hidden className="ct-empty-icon" />
            <h2>Hỏi gì cũng được</h2>
            <p className="ct-muted">Đính kèm ảnh và PDF thì dùng bản web — bản desktop chưa có.</p>
          </div>
        )}

        {luot.map((l, i) => (
          <div key={i} className={l.vai === 'user' ? 'ct-agent-nguoi' : 'ct-agent-may'}>{l.text}</div>
        ))}

        {dangCho && (
          <div className="ct-agent-nghi">
            <Loader2 size={13} aria-hidden className="ct-spin" />
            <span>Đang trả lời…</span>
          </div>
        )}
        {loi && <div className="ct-notice" data-tone="err"><span>{loi}</span></div>}
      </div>

      <div className="ct-agent-soan">
        <textarea
          className="ct-agent-o"
          rows={2}
          value={nhap}
          placeholder="Nhắn cho trợ lý…"
          onChange={(e) => datNhap(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return; // nhường Enter cho bộ gõ tiếng Việt
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void guiDi(); }
          }}
          disabled={dangChay}
        />
        {dangChay ? (
          <button type="button" className="ct-btn ct-agent-dung" onClick={() => huyRef.current?.abort()}>
            <CircleStop size={14} aria-hidden />
            Dừng
          </button>
        ) : (
          <button type="button" className="ct-btn" onClick={() => void guiDi()} disabled={!nhap.trim()}>
            <Send size={14} aria-hidden />
            Gửi
          </button>
        )}
      </div>
    </div>
  );
}
