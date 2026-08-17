/**
 * Chế độ Trò chuyện — chat thường, chảy chữ theo thời gian thực.
 *
 * Gọi `POST /api/v1/ai/chat` (SSE) bằng `fetch` thẳng chứ không qua
 * `api.request()`: `request()` đọc trọn thân rồi `JSON.parse`, tức là nó sẽ
 * ngồi chờ tới khi máy chủ đóng kết nối — đúng thứ mà stream sinh ra để tránh.
 *
 * ─── ĐÍNH KÈM: MÁY CHỦ VỐN ĐÃ LÀM ĐƯỢC TỪ TRƯỚC ───
 * `/ai/chat` nhận `images` + `documents` từ lâu (4 ảnh ≤4MB, 3 tài liệu ≤6MB:
 * PDF/Word/txt/md/csv), tự rút chữ khỏi PDF ở backend và tự ép lượt có ảnh lên
 * model nhìn được thật. Bản desktop chỉ đơn giản là chưa gửi. Nên phần việc ở
 * đây là NỐI DÂY cho đúng, không phải dựng tính năng mới.
 *
 * ⛔ KHÔNG CÓ "TẠO ẢNH", và đó không phải thiếu sót.
 * Cổng có liệt kê `gpt-image-2` / `gpt-image-1.5` trong `GET /v1/models`, nhưng
 * gọi thật (17/08/2026) trả **HTTP 403 "Image generation is not enabled for
 * this group"** — cả hai model, chặn ở cấp nhóm khoá. Dựng nút cho nó là dựng
 * một nút chết. Mở kênh sinh ảnh trong Console của cổng thì mới làm được.
 */
import { useEffect, useRef, useState } from 'react';
import { CircleStop, Loader2, MessageSquare, Send } from 'lucide-react';
import { useSession } from '../../auth/session';
import { ChuAgent } from './markdown';
import {
  DaiDinhKem, DinhKemDaGui, NutDinhKem, ODinhKem, useDinhKem, type TepDinhKem,
} from './DinhKem';

interface Luot {
  vai: 'user' | 'assistant';
  text: string;
  /** Đính kèm của lượt này — giữ lại để bảng ghi còn thấy đã gửi gì. */
  tep?: TepDinhKem[];
}

/** Số lượt cũ gửi kèm làm ngữ cảnh. Đủ để nhớ mạch, không đủ để phình hoá đơn. */
const SO_LUOT_NGU_CANH = 10;

/**
 * Ba bậc model máy chủ mở (`CHAT_MODELS` trong `ai.service.ts`).
 *
 * Trước đây app luôn dùng bậc mặc định và không cho chọn — trong khi web thì
 * có. Bậc Pro/Max là đường đi qua tuyến Anthropic, tức là **chỗ duy nhất xử lý
 * được ảnh + tài liệu tử tế**, nên giấu nó đi là giấu mất nửa giá trị của việc
 * vừa thêm đính kèm.
 */
const BAC = [
  { id: 'cuongmini-3.11', nhan: 'Thường', canPro: false, mo: 'Nhanh, đủ cho hỏi đáp hằng ngày' },
  { id: 'cuongmini-pro', nhan: 'Pro', canPro: true, mo: 'Suy luận sâu hơn — cần tài khoản Pro' },
  { id: 'cuongmini-max', nhan: 'Max', canPro: true, mo: 'Mạnh nhất, đọc ảnh và tài liệu — cần Pro' },
] as const;

export function ChatMode({ pro }: { pro: boolean }) {
  const { api } = useSession();
  const [luot, datLuot] = useState<Luot[]>([]);
  const [nhap, datNhap] = useState('');
  const [bac, datBac] = useState<string>('cuongmini-3.11');
  const [dangChay, datDangChay] = useState(false);
  const [dangCho, datDangCho] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  /** Máy chủ đã HẠ BẬC lượt này chưa, và vì sao — xem khung `model` của SSE. */
  const [roiBac, datRoiBac] = useState<string | null>(null);
  const huyRef = useRef<AbortController | null>(null);
  const cuonRef = useRef<HTMLDivElement>(null);
  const dk = useDinhKem();

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
    const tep = dk.tep;
    // Có đính kèm thì KHÔNG bắt buộc phải gõ chữ — máy chủ cũng cho vậy. Thả
    // một ảnh lỗi vào rồi bấm gửi là một câu hỏi hoàn chỉnh.
    if ((!text && tep.length === 0) || dangChay || !api) return;

    const truoc: Luot[] = [...luot, { vai: 'user', text, ...(tep.length ? { tep } : {}) }];
    datLuot(truoc);
    datNhap('');
    dk.xoaHet();
    datLoi(null);
    datRoiBac(null);
    datDangChay(true);
    datDangCho(true);

    const dieuKhien = new AbortController();
    huyRef.current = dieuKhien;

    try {
      const anh = tep.filter((t) => t.loai === 'image');
      const tai = tep.filter((t) => t.loai === 'tailieu');
      const res = await fetch(`${api.baseUrlForForms()}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...api.authHeaders() },
        signal: dieuKhien.signal,
        body: JSON.stringify({
          message: text,
          model: bac,
          history: truoc.slice(-SO_LUOT_NGU_CANH - 1, -1).map((l) => ({ role: l.vai, content: l.text })),
          // Máy chủ nhận data URL đầy đủ và tự tách phần base64 (`parseChatImages`
          // / `parseChatDocuments`). Gửi kèm TÊN FILE vì nó là nhãn duy nhất
          // model có để nói "trong file hợp-đồng.pdf thì…".
          ...(anh.length ? { images: anh.map((t) => t.url) } : {}),
          ...(tai.length ? { documents: tai.map((t) => t.url), documentNames: tai.map((t) => t.ten) } : {}),
        }),
      });
      if (!res.ok || !res.body) {
        // Lỗi đính kèm trả về JSON thường (400) chứ không phải khung SSE — đọc
        // nó ra để nói đúng file nào sai, thay vì "Máy chủ trả về 400".
        const than = await res.json().catch(() => null) as { message?: string } | null;
        throw new Error(than?.message ?? `Máy chủ trả về ${res.status}`);
      }

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
          let e: { type?: string; text?: string; error?: string; fellBack?: boolean; reason?: string };
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
          } else if (e.type === 'model' && e.fellBack) {
            /**
             * ⚠️ MÁY CHỦ CÓ THỂ HẠ BẬC MÀ KHÔNG BÁO LỖI.
             *
             * Bậc Pro/Max là đặc quyền Pro, và đó cũng là ĐƯỜNG DUY NHẤT xử lý
             * ảnh + tài liệu. Không Pro ⇒ máy chủ lặng lẽ quay về bậc thường và
             * **bỏ luôn file đính kèm**, rồi trả lời như chưa từng thấy file
             * nào. Đo thật 17/08: gửi ảnh đỏ + hỏi "màu gì" → "Tôi chưa thấy
             * ảnh đính kèm".
             *
             * Đó là kiểu hỏng tệ nhất: có câu trả lời, nghe trôi chảy, và sai
             * vì thiếu đúng thứ người dùng vừa gửi. Nên phải nói ra.
             */
            datRoiBac(
              e.reason === 'pro_required'
                ? 'Bậc Pro/Max cần tài khoản Pro. Lượt này đã dùng bậc Thường, và file đính kèm KHÔNG được đọc.'
                : e.reason === 'claude_not_configured'
                  ? 'Máy chủ chưa cấu hình bậc cao. Lượt này dùng bậc Thường; file đính kèm không được đọc.'
                  : 'Bậc cao gặp lỗi nên lượt này rơi về bậc Thường — file đính kèm có thể không được đọc.',
            );
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

  const coGiDeGui = Boolean(nhap.trim()) || dk.tep.length > 0;

  return (
    <div
      className="ct-agent"
      data-keo={dk.dangKeo}
      onDragOver={pro ? dk.keoVao : undefined}
      onDragLeave={pro ? dk.keoRa : undefined}
      onDrop={pro ? dk.thaVao : undefined}
    >
      {/* Lớp phủ chỉ hiện khi con trỏ đang MANG FILE — xem `keoVao`. */}
      {dk.dangKeo && (
        <div className="ct-dk-phu">
          <span>Thả file vào đây</span>
        </div>
      )}

      <div className="ct-agent-scroll" ref={cuonRef}>
        {luot.length === 0 && (
          <div className="ct-agent-trong">
            <MessageSquare size={26} aria-hidden className="ct-empty-icon" />
            <h2>Hỏi gì cũng được</h2>
            <p className="ct-muted">
              Kéo thả, dán hoặc bấm 📎 để gửi kèm ảnh và tài liệu (PDF, Word, txt, md, csv).
            </p>
          </div>
        )}

        {luot.map((l, i) => (l.vai === 'user' ? (
          <div key={i} className="ct-agent-nguoi">
            <DinhKemDaGui tep={l.tep ?? []} />
            {l.text}
          </div>
        ) : (
          /* Dựng markdown thay vì chữ thuần: câu trả lời có khối mã, danh sách,
             bảng — hiện thô thì người đọc phải tự giải mã dấu ```. Bộ dựng thoát
             HTML TRƯỚC rồi mới định dạng, nên nội dung máy chủ trả về không thể
             sinh ra thẻ nào. */
          <ChuAgent key={i} text={l.text} />
        )))}

        {dangCho && (
          <div className="ct-agent-nghi">
            <Loader2 size={13} aria-hidden className="ct-spin" />
            <span>Đang trả lời…</span>
          </div>
        )}
        {loi && <div className="ct-notice" data-tone="err"><span>{loi}</span></div>}
        {roiBac && <div className="ct-notice" data-tone="warn"><span>{roiBac}</span></div>}
        {dk.loi && <div className="ct-notice" data-tone="warn"><span>{dk.loi}</span></div>}
      </div>

      <DaiDinhKem tep={dk.tep} bo={dk.bo} />

      <div className="ct-agent-soan">
        <ODinhKem oFileRef={dk.oFileRef} nhanTuO={dk.nhanTuO} />
        {/* Không Pro ⇒ khoá nút và NÓI RÕ vì sao. Cho bấm rồi để máy chủ lặng
            lẽ bỏ file là đúng cái bẫy vừa đo được. */}
        <NutDinhKem onBam={dk.moChonTep} khoa={dangChay || !pro} khongPro={!pro} />
        <textarea
          className="ct-agent-o"
          rows={2}
          value={nhap}
          placeholder="Nhắn cho trợ lý…  (dán hoặc kéo thả ảnh, PDF, Word)"
          onChange={(e) => datNhap(e.target.value)}
          onPaste={pro ? dk.danVao : undefined}
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
          <button type="button" className="ct-btn" onClick={() => void guiDi()} disabled={!coGiDeGui}>
            <Send size={14} aria-hidden />
            Gửi
          </button>
        )}
      </div>

      <div className="ct-chat-chan">
        <div className="ct-noluc" role="group" aria-label="Bậc model">
          {BAC.map((b) => (
            <button
              key={b.id}
              type="button"
              className="ct-noluc-nut"
              data-chon={b.id === bac}
              disabled={dangChay || (b.canPro && !pro)}
              onClick={() => datBac(b.id)}
              title={b.canPro && !pro ? `${b.mo} (bạn chưa có Pro)` : b.mo}
            >
              {b.nhan}
            </button>
          ))}
        </div>
        <span className="ct-chat-chan-chu">
          {pro ? 'Tối đa 4 ảnh · 3 tài liệu mỗi lượt' : 'Đính kèm ảnh/tài liệu cần tài khoản Pro'}
        </span>
      </div>
    </div>
  );
}
