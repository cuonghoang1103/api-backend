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
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CircleStop, FolderOpen, FolderPlus, History, Loader2, MessageSquare, Plus, Send, Trash2, X,
} from 'lucide-react';
import { useSession } from '../../auth/session';
import { ChuAgent } from './markdown';
import {
  DaiDinhKem, DinhKemDaGui, NutDinhKem, ODinhKem, useDinhKem, type TepDinhKem,
} from './DinhKem';

interface ThuMuc {
  id: string;
  ten: string;
  mau: string | null;
  _count?: { sessions: number };
}

interface PhienChat {
  id: string;
  title: string | null;
  updatedAt: string;
  folderId: string | null;
  _count?: { messages: number };
  folder?: { id: string; ten: string; mau: string | null } | null;
}

/**
 * Bộ lọc thư mục đang chọn.
 *
 * Ba trạng thái, cố ý phân biệt: `null` = xem TẤT CẢ · `'none'` = chỉ những
 * cuộc chưa xếp vào đâu · `<id>` = một thư mục cụ thể. Gộp "tất cả" với "chưa
 * phân loại" là mất đường xem toàn bộ.
 */
type LocThuMuc = null | 'none' | string;

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
  /**
   * Đã chờ bao nhiêu giây.
   *
   * ⚠️ Đây là phần vá cảm giác "load mãi", và nó là vá THẬT chứ không phải trang
   * trí. Đo 17/08: chữ đầu tiên về sau 3–4s là bình thường, nhưng cổng có lúc
   * vọt lên 35s. Một con quay không đếm thì 4 giây và 40 giây trông y hệt nhau,
   * nên người dùng không phân biệt được "đang chạy" với "treo rồi".
   */
  const [choGiay, datChoGiay] = useState(0);
  const [loi, datLoi] = useState<string | null>(null);
  /** Máy chủ đã HẠ BẬC lượt này chưa, và vì sao — xem khung `model` của SSE. */
  const [roiBac, datRoiBac] = useState<string | null>(null);
  /**
   * Phiên chat đang mở, và danh sách phiên cũ.
   *
   * ⚠️ Trước bản này chế độ Trò chuyện KHÔNG lưu gì: rời trang là mất sạch hội
   * thoại — đúng lỗi đã sửa cho chế độ Lập trình, chỉ là ở đây chưa sửa. Máy
   * chủ vốn đã có sẵn `/ai/chat/sessions` + `/ai/chat/history/:id` và BẢN WEB
   * dùng từ lâu; app chỉ đơn giản là chưa gọi.
   */
  const [phienId, datPhienId] = useState<string | null>(null);
  const [dsPhien, datDsPhien] = useState<PhienChat[]>([]);
  const [moLichSu, datMoLichSu] = useState(false);
  const [dsThuMuc, datDsThuMuc] = useState<ThuMuc[]>([]);
  const [loc, datLoc] = useState<LocThuMuc>(null);
  const [tenMoi, datTenMoi] = useState('');
  const huyRef = useRef<AbortController | null>(null);
  const cuonRef = useRef<HTMLDivElement>(null);
  const dk = useDinhKem();

  useEffect(() => {
    const el = cuonRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight;
  }, [luot, dangCho]);

  useEffect(() => {
    if (!dangCho) { datChoGiay(0); return; }
    const t0 = Date.now();
    const id = setInterval(() => datChoGiay(Math.round((Date.now() - t0) / 1000)), 500);
    return () => clearInterval(id);
  }, [dangCho]);

  const napDsPhien = useCallback(async () => {
    if (!api) return;
    try {
      // ⚠️ `api.request` ĐÃ bóc `envelope.data` (xem `unwrap` trong api/client.ts),
      // nên đây là mảng luôn — bóc `.data` lần nữa cho ra `undefined`, và danh
      // sách rỗng vĩnh viễn trong khi máy chủ trả về đủ dữ liệu.
      const q = loc ? `?folderId=${encodeURIComponent(loc)}` : '';
      const r = await api.request<PhienChat[]>(`/api/v1/ai/chat/sessions${q}`);
      datDsPhien(Array.isArray(r) ? r : []);
    } catch { /* mất mạng — danh sách rỗng, không phải lỗi chặn đường */ }
  }, [api, loc]);

  const napThuMuc = useCallback(async () => {
    if (!api) return;
    try {
      const r = await api.request<ThuMuc[]>('/api/v1/ai/chat/folders');
      datDsThuMuc(Array.isArray(r) ? r : []);
    } catch { /* chưa đăng nhập hoặc mất mạng */ }
  }, [api]);

  const taoThuMuc = useCallback(async () => {
    const ten = tenMoi.trim();
    if (!ten || !api) return;
    try {
      await api.request('/api/v1/ai/chat/folders', { method: 'POST', body: { ten } });
      datTenMoi('');
      await napThuMuc();
    } catch (err) {
      datLoi(`Không tạo được thư mục: ${(err as Error).message}`);
    }
  }, [api, tenMoi, napThuMuc]);

  const xoaThuMuc = useCallback(async (id: string) => {
    if (!api) return;
    try {
      await api.request(`/api/v1/ai/chat/folders/${id}`, { method: 'DELETE' });
      // Cuộc bên trong KHÔNG mất — máy chủ đặt `folderId` về null. Nếu đang lọc
      // theo đúng thư mục vừa xoá thì quay về xem tất cả, không để màn hình
      // trống trơn mà người dùng tưởng mất hết.
      if (loc === id) datLoc(null);
      await Promise.all([napThuMuc(), napDsPhien()]);
    } catch (err) {
      datLoi(`Không xoá được thư mục: ${(err as Error).message}`);
    }
  }, [api, loc, napThuMuc, napDsPhien]);

  const xepVaoThuMuc = useCallback(async (sid: string, folderId: string | null) => {
    if (!api) return;
    try {
      await api.request(`/api/v1/ai/chat/sessions/${sid}/folder`, { method: 'PATCH', body: { folderId } });
      await Promise.all([napThuMuc(), napDsPhien()]);
    } catch (err) {
      datLoi(`Không xếp được: ${(err as Error).message}`);
    }
  }, [api, napThuMuc, napDsPhien]);

  useEffect(() => { void napDsPhien(); }, [napDsPhien]);
  useEffect(() => { void napThuMuc(); }, [napThuMuc]);

  /** Mở một phiên cũ: nạp lịch sử từ máy chủ và gõ tiếp vào chính phiên đó. */
  const moPhien = useCallback(async (id: string) => {
    if (!api) return;
    try {
      const r = await api.request<Array<{ role: string; content: string }>>(
        `/api/v1/ai/chat/history/${id}`,
      );
      const ds = Array.isArray(r) ? r : [];
      datLuot(ds.map((m) => ({
        vai: m.role === 'user' ? 'user' as const : 'assistant' as const,
        text: String(m.content ?? ''),
      })));
      datPhienId(id);
      datMoLichSu(false);
      datLoi(null);
    } catch (err) {
      datLoi(`Không mở được việc cũ: ${(err as Error).message}`);
    }
  }, [api]);

  const xoaPhien = useCallback(async (id: string) => {
    if (!api) return;
    try {
      await api.request(`/api/v1/ai/chat/sessions/${id}`, { method: 'DELETE' });
      if (id === phienId) { datPhienId(null); datLuot([]); }
      await napDsPhien();
    } catch (err) {
      datLoi(`Không xoá được: ${(err as Error).message}`);
    }
  }, [api, phienId, napDsPhien]);

  const chatMoi = (): void => {
    huyRef.current?.abort();
    datPhienId(null);
    datLuot([]);
    datLoi(null);
    datRoiBac(null);
    dk.xoaHet();
  };

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
      /**
       * Tạo phiên TRƯỚC nếu chưa có.
       *
       * ⚠️ Máy chủ KHÔNG tự tạo: `/ai/chat` lấy `sessionId` thẳng từ body, và
       * không có thì nó bỏ qua bước lưu tin nhắn (`if (sessionId) saveUserMessage`).
       * Khung `connected` vẫn trả về một trường `sessionId` — nhưng đó chính là
       * thứ client vừa gửi, nên tin vào nó là tin vào `undefined`. Bản đầu của
       * tôi làm đúng như vậy và hội thoại không bao giờ được lưu, trong khi mọi
       * thứ trên màn hình trông hoàn toàn bình thường.
       */
      let phienDung = phienId;
      if (!phienDung) {
        const r = await api.request<{ sessionId?: string }>(
          '/api/v1/ai/chat/sessions', { method: 'POST', body: { title: text.slice(0, 60) || 'Cuộc mới' } },
        );
        phienDung = r?.sessionId ?? null;
        if (phienDung) datPhienId(phienDung);
      }

      const anh = tep.filter((t) => t.loai === 'image');
      const tai = tep.filter((t) => t.loai === 'tailieu');
      const res = await fetch(`${api.baseUrlForForms()}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...api.authHeaders() },
        signal: dieuKhien.signal,
        body: JSON.stringify({
          message: text,
          model: bac,
          // Có phiên thì gõ tiếp vào phiên đó; chưa có thì để máy chủ tự tạo và
          // nhặt id nó trả về ở khung `connected`.
          ...(phienDung ? { sessionId: phienDung } : {}),
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
      // Cập nhật danh sách SAU khi xong: tiêu đề phiên do máy chủ đặt từ câu
      // hỏi đầu, và nó chỉ có sau khi lượt chạy.
      void napDsPhien();
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

      <div className="ct-chat-thanh">
        <button type="button" className="ct-agent-icon" data-nut="chatMoi" onClick={chatMoi} title="Bắt đầu cuộc mới">
          <Plus size={14} aria-hidden />
        </button>
        <button
          type="button" className="ct-agent-icon" data-nut="chatLichSu"
          onClick={() => { datMoLichSu((v) => !v); void napDsPhien(); }}
          title={`Cuộc đã lưu (${dsPhien.length})`}
        >
          <History size={14} aria-hidden />
        </button>
        <span className="ct-chat-chan-chu">
          {phienId ? 'Đang lưu vào máy chủ' : 'Cuộc mới — sẽ được lưu khi bạn gửi'}
        </span>
      </div>

      {moLichSu && (
        <div className="ct-lichsu" role="dialog" aria-label="Cuộc trò chuyện đã lưu">
          <div className="ct-lichsu-dau">
            <strong>Cuộc đã lưu</strong>
            <button type="button" className="ct-agent-icon" onClick={() => datMoLichSu(false)} aria-label="Đóng">
              <X size={14} aria-hidden />
            </button>
          </div>
          {/* Dải thư mục. "Tất cả" và "Chưa phân loại" là HAI mục khác nhau —
              gộp lại là mất đường xem toàn bộ. */}
          <div className="ct-tm-dai">
            <button type="button" className="ct-tm-nut" data-chon={loc === null} onClick={() => datLoc(null)}>
              Tất cả
            </button>
            <button type="button" className="ct-tm-nut" data-chon={loc === 'none'} onClick={() => datLoc('none')}>
              Chưa phân loại
            </button>
            {dsThuMuc.map((f) => (
              <span key={f.id} className="ct-tm-o">
                <button
                  type="button" className="ct-tm-nut" data-chon={loc === f.id}
                  onClick={() => datLoc(f.id)} title={`${f._count?.sessions ?? 0} cuộc`}
                >
                  <FolderOpen size={11} aria-hidden />
                  {f.ten}
                  {!!f._count?.sessions && <span className="ct-tm-dem">{f._count.sessions}</span>}
                </button>
                <button
                  type="button" className="ct-tm-xoa"
                  onClick={() => void xoaThuMuc(f.id)}
                  title={`Xoá thư mục "${f.ten}" — các cuộc bên trong KHÔNG bị xoá, chúng về Chưa phân loại`}
                  aria-label={`Xoá thư mục ${f.ten}`}
                >
                  <X size={10} aria-hidden />
                </button>
              </span>
            ))}
          </div>

          <div className="ct-tm-tao">
            <input
              className="ct-td-o"
              value={tenMoi}
              placeholder="tên thư mục mới, ví dụ Java…"
              maxLength={80}
              onChange={(e) => datTenMoi(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter') { e.preventDefault(); void taoThuMuc(); }
              }}
            />
            <button type="button" className="ct-btn ct-mcp-nho" disabled={!tenMoi.trim()} onClick={() => void taoThuMuc()}>
              <FolderPlus size={12} aria-hidden />
              Tạo
            </button>
          </div>

          {dsPhien.length === 0 ? (
            <p className="ct-mcp-trong">
              {loc ? 'Thư mục này chưa có cuộc nào.' : 'Chưa có cuộc nào được lưu.'}
            </p>
          ) : (
            <ul className="ct-lichsu-ds">
              {dsPhien.map((p) => (
                <li key={p.id} className="ct-lichsu-muc" data-dang={p.id === phienId}>
                  <button type="button" className="ct-lichsu-mo" onClick={() => void moPhien(p.id)}>
                    <span className="ct-lichsu-tieude">{p.title?.trim() || 'Cuộc chưa đặt tên'}</span>
                    {/* ⚠️ KHÔNG dùng `ct-lichsu-phu`: tên đó đã có nghĩa khác —
                        tấm phủ toàn màn hình (`position:absolute; inset:0`) của
                        bảng lịch sử agent. Đặt nó lên một dòng chữ biến mỗi
                        dòng thành một tấm chắn vô hình nuốt mọi cú bấm. */}
                    <span className="ct-chat-phien-phu">
                      {p._count?.messages ?? 0} tin · {new Date(p.updatedAt).toLocaleDateString('vi-VN')}
                      {p.folder && <span className="ct-tm-nhan">{p.folder.ten}</span>}
                    </span>
                  </button>

                  {/* Xếp cuộc vào thư mục. Dùng `select` chứ không phải menu tự
                      vẽ: nó ngắn gọn, hệ điều hành tự lo bàn phím và cuộn, và
                      không cần một lớp phủ nữa chồng lên bảng lịch sử. */}
                  {dsThuMuc.length > 0 && (
                    <select
                      className="ct-tm-chon"
                      value={p.folderId ?? ''}
                      onChange={(e) => void xepVaoThuMuc(p.id, e.target.value || null)}
                      title="Xếp cuộc này vào thư mục"
                    >
                      <option value="">— chưa phân loại —</option>
                      {dsThuMuc.map((f) => <option key={f.id} value={f.id}>{f.ten}</option>)}
                    </select>
                  )}
                  <button
                    type="button" className="ct-dk-bo ct-wt-xoa"
                    onClick={() => void xoaPhien(p.id)} aria-label={`Xoá ${p.title ?? 'cuộc này'}`}
                  >
                    <Trash2 size={11} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
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
          /* ⚠️ PHẢI giữ lớp bọc `.ct-agent-may` — `ChuAgent` chỉ dựng phần chữ
             (`.ct-md`), còn bong bóng, khoảng cách và màu nền là của lớp này.
             Bỏ nó đi thì markdown vẫn đúng nhưng câu trả lời mất hẳn khung, và
             nhìn như chữ rơi tự do giữa trang. Giống hệt cách `AgentMode` bọc. */
          <div key={i} className="ct-agent-may">
            <ChuAgent text={l.text} />
          </div>
        )))}

        {dangCho && (
          <div className="ct-agent-nghi">
            <Loader2 size={13} aria-hidden className="ct-spin" />
            <span>
              Đang trả lời… {choGiay}s
              {/* Quá 10s thì nói RÕ nguyên nhân. Người dùng đang ngồi đoán xem
                  app hỏng hay mạng hỏng; nói thật là "cổng AI đang chậm" vừa
                  đúng vừa cho họ một lựa chọn (đổi bậc, hoặc chờ). */}
              {choGiay >= 10 && ' — cổng AI đang chậm, không phải app treo. Bấm Dừng nếu muốn thử lại.'}
            </span>
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
