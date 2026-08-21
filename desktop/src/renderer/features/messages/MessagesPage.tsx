/**
 * ============================================================
 * TIN NHẮN
 * ============================================================
 *
 * Đối chiếu `src/routes/messages.routes.ts` (mount `/api/v1/messages`):
 *   GET   /threads?limit=            → [{ id, type, peer, lastMessage, unreadCount }]
 *   GET   /threads/:id/messages      → [{ id, senderId, content, sender, createdAt, recalled }]
 *   POST  /threads/:id/messages      → { content }
 *   PATCH /threads/:id/read          → đánh dấu đã đọc
 *   GET   /unread-count              → { count }
 *
 * ⚠️ `api.request` BÓC SẴN phong bì (`ApiClient.unwrap` trả `envelope.data`),
 * nên các lời gọi ở đây nhận THẲNG mảng — đừng đọc `.data` một lần nữa. Đã
 * dính đúng lỗi này ở trang Bảng tin: giao diện hiện 0 mục dù máy chủ trả đủ,
 * và không có lỗi nào trên màn hình.
 *
 * ─── VÌ SAO HỎI THĂM CHỨ KHÔNG PHẢI SOCKET ───
 * Web dùng socket.io cho tin nhắn thời gian thực. Ở app, mở thêm một kết nối
 * socket nữa là thêm một đường có thể hỏng, thêm một chỗ phải dọn khi đổi
 * trang, và thêm một trạng thái "đang kết nối" phải vẽ. Trang này hỏi lại mỗi
 * 8 giây KHI ĐANG MỞ — đủ nhanh cho một cuộc trò chuyện, và không để lại gì
 * khi người dùng đi chỗ khác. Đổi sang socket sau vẫn được, không đụng giao diện.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, CloudOff, MessageSquare, Phone, RefreshCw, Send } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import KhungGoi from './KhungGoi';
import { laySocket } from '../../realtime/socket';
import { OfflineUnavailableError, swr } from '../../offline/cache';

interface NguoiKia {
  id: number;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  alias?: string | null;
}

interface Cuoc {
  id: number;
  type: string;
  peer?: NguoiKia | null;
  unreadCount: number;
  lastMessageAt?: string | null;
  lastMessage?: { id: number; content?: string | null; senderId: number; createdAt: string; hasAttachment?: boolean } | null;
}

interface TinNhan {
  id: number;
  threadId: number;
  senderId: number;
  content?: string | null;
  createdAt: string;
  recalled?: boolean;
  deleted?: boolean;
  mediaUrl?: string | null;
  sender?: { id: number; username: string; displayName?: string | null; avatarUrl?: string | null } | null;
}

/** Nhịp hỏi lại khi trang đang mở. Đủ nhanh cho hội thoại, đủ chậm để không tốn gì. */
/** Lưới đỡ khi socket đứt mà không ai biết — xem ghi chú ở chỗ dùng.
 *  Trước 21/08/2026 đây là nhịp CHÍNH và bằng 8 giây; nay socket lo phần
 *  chính nên nó thưa hẳn. */
const NHIP_LUOI_DO_MS = 45000;

function ten(p?: NguoiKia | null): string {
  return p?.alias || p?.displayName || p?.username || 'Không rõ';
}

function gioNgan(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return '';
  const homNay = new Date();
  const cungNgay = d.toDateString() === homNay.toDateString();
  const p = (n: number) => String(n).padStart(2, '0');
  return cungNgay ? `${p(d.getHours())}:${p(d.getMinutes())}` : `${d.getDate()}/${d.getMonth() + 1}`;
}

export function MessagesPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();
  /** Bộ đếm bấm nút gọi — xem ghi chú ở `KhungGoi`. */
  const [lanBamGoi, datLanBamGoi] = useState(0);

  const [ds, datDs] = useState<Cuoc[]>([]);
  const [dangMo, datDangMo] = useState<number | null>(null);
  const [tin, datTin] = useState<TinNhan[]>([]);
  const [nhap, datNhap] = useState('');
  const [dangGui, datDangGui] = useState(false);
  const [dangTai, datDangTai] = useState(true);
  const [loi, datLoi] = useState<string | null>(null);
  const cuonRef = useRef<HTMLDivElement>(null);

  const napDs = useCallback(async () => {
    if (userId === null || !api) return;
    datLoi(null);
    try {
      const kq = await swr<Cuoc[]>({
        userId,
        key: 'messages:threads',
        fetcher: () => api.request('/api/v1/messages/threads?limit=50'),
        online,
        ttlMs: 30_000,
        onRefreshed: (v) => datDs(v ?? []),
      });
      datDs(kq.value ?? []);
    } catch (e) {
      datLoi(e instanceof OfflineUnavailableError
        ? 'Chưa từng tải tin nhắn nên không xem được khi ngoại tuyến.'
        : e instanceof Error ? e.message : String(e));
    } finally {
      datDangTai(false);
    }
  }, [api, userId, online]);

  useEffect(() => { void napDs(); }, [napDs]);

  const napTin = useCallback(async (cuocId: number) => {
    if (!api) return;
    try {
      const kq = await api.request<TinNhan[]>(`/api/v1/messages/threads/${cuocId}/messages?limit=60`);
      datTin(kq ?? []);
    } catch { /* giữ nguyên tin đang hiện, đừng xoá trắng vì một lần hỏng mạng */ }
  }, [api]);

  const mo = async (c: Cuoc) => {
    datDangMo(c.id);
    datTin([]);
    await napTin(c.id);
    if (!api) return;
    // Đánh dấu đã đọc và trừ ngay số chưa đọc trên danh sách — chờ máy chủ mới
    // xoá chấm đỏ thì người dùng thấy nó nhấp nháy quay lại.
    datDs((x) => x.map((t) => (t.id === c.id ? { ...t, unreadCount: 0 } : t)));
    void api.request(`/api/v1/messages/threads/${c.id}/read`, { method: 'PATCH' }).catch(() => {});
  };

  // ── Tin mới về NGAY qua socket ───────────────────────────────
  //
  // Trước 21/08/2026 màn này chỉ hỏi lại mỗi 8 giây (xem ghi chú đầu file).
  // Gọi thoại buộc phải có socket, nên tin nhắn dùng ké luôn — hết cảnh trễ.
  useEffect(() => {
    const s = laySocket();
    if (!s) return;
    const coTinMoi = (p: { threadId: number }) => {
      // Đang mở đúng cuộc đó thì nạp cả tin; cuộc khác thì chỉ cần danh sách
      // đổi dòng xem trước là đủ.
      if (p.threadId === dangMo) void napTin(dangMo);
      void napDs();
    };
    s.on('thread:new-message', coTinMoi);
    return () => { s.off('thread:new-message', coTinMoi); };
  }, [dangMo, napTin, napDs]);

  // Nhịp hỏi lại GIỮ NGUYÊN làm lưới đỡ, nhưng thưa hẳn: socket có thể đứt mà
  // không ai biết (máy ngủ, mạng chập), và mất tin nhắn thì người dùng không
  // có cách nào phát hiện. 8 giây → 45 giây: đủ để tự lành, đủ thưa để không
  // phí băng thông khi socket đang chạy tốt.
  useEffect(() => {
    if (dangMo === null || !online) return;
    const id = setInterval(() => { void napTin(dangMo); void napDs(); }, NHIP_LUOI_DO_MS);
    return () => clearInterval(id);
  }, [dangMo, online, napTin, napDs]);

  // Cuộn xuống cuối mỗi khi có tin mới.
  useEffect(() => {
    const el = cuonRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [tin]);

  const gui = async () => {
    const chu = nhap.trim();
    if (!chu || !api || dangMo === null || dangGui) return;
    datDangGui(true);
    // Hiện ngay tin của mình rồi mới gửi. Gõ xong mà phải chờ mạng mới thấy chữ
    // hiện ra là cảm giác app đơ — và đây là thứ người dùng gõ liên tục.
    const tam: TinNhan = {
      id: -Date.now(), threadId: dangMo, senderId: userId ?? -1,
      content: chu, createdAt: new Date().toISOString(),
    };
    datTin((c) => [...c, tam]);
    datNhap('');
    try {
      await api.request(`/api/v1/messages/threads/${dangMo}/messages`, { method: 'POST', body: { content: chu } });
      await napTin(dangMo);
      void napDs();
    } catch (e) {
      // Gửi hỏng ⇒ bỏ tin tạm và TRẢ LẠI chữ để gõ tiếp, đừng nuốt mất câu họ viết.
      datTin((c) => c.filter((t) => t.id !== tam.id));
      datNhap(chu);
      datLoi(e instanceof Error ? e.message : String(e));
    } finally {
      datDangGui(false);
    }
  };

  const cuocDangMo = ds.find((c) => c.id === dangMo) ?? null;

  return (
    <div className="ct-page ct-tn" style={{ maxWidth: 1000 }}>
      <div className="ct-page-head" style={{ marginBottom: 12 }}>
        <div>
          <h1>Tin nhắn</h1>
          <p className="ct-muted" style={{ margin: 0 }}>
            {ds.length ? `${ds.length} cuộc trò chuyện` : 'Trò chuyện với bạn bè và hỗ trợ'}
          </p>
        </div>
        <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void napDs()} disabled={dangTai}>
          <RefreshCw size={14} aria-hidden className={dangTai ? 'ct-spin' : undefined} /> Làm mới
        </button>
      </div>

      {loi && (
        <div className="ct-notice" data-tone="warn" style={{ marginBottom: 12 }}>
          <CloudOff size={15} aria-hidden /> <span>{loi}</span>
        </div>
      )}

      <div className="ct-tn-khung" data-mo={dangMo !== null}>
        {/* ── Danh sách cuộc ── */}
        <aside className="ct-tn-ds">
          {dangTai && ds.length === 0 && <p className="ct-muted" style={{ padding: 12, fontSize: 13 }}>Đang tải…</p>}
          {!dangTai && ds.length === 0 && (
            <div className="ct-empty" style={{ padding: 24 }}>
              <MessageSquare size={26} aria-hidden className="ct-empty-icon" />
              <p>Chưa có cuộc trò chuyện nào.</p>
            </div>
          )}
          {ds.map((c) => (
            <button
              key={c.id}
              type="button"
              className="ct-tn-cuoc"
              data-chon={c.id === dangMo}
              onClick={() => void mo(c)}
            >
              <Avatar p={c.peer ?? null} />
              <div className="ct-tn-cuoc-chu">
                <div className="ct-tn-cuoc-dau">
                  <strong>{c.type === 'ADMIN' ? 'Hỗ trợ CuongThai' : ten(c.peer)}</strong>
                  {c.lastMessageAt && <span>{gioNgan(c.lastMessageAt)}</span>}
                </div>
                <p>
                  {c.lastMessage?.senderId === userId && 'Bạn: '}
                  {c.lastMessage?.content
                    || (c.lastMessage?.hasAttachment ? '📎 Tệp đính kèm' : 'Chưa có tin nhắn')}
                </p>
              </div>
              {c.unreadCount > 0 && <span className="ct-tn-cham">{c.unreadCount}</span>}
            </button>
          ))}
        </aside>

        {/* ── Khung trò chuyện ── */}
        <section className="ct-tn-hoi">
          {dangMo === null ? (
            <div className="ct-empty" style={{ margin: 'auto' }}>
              <MessageSquare size={28} aria-hidden className="ct-empty-icon" />
              <p>Chọn một cuộc trò chuyện để bắt đầu.</p>
            </div>
          ) : (
            <>
              <header className="ct-tn-hoi-dau">
                {/* Nút quay lại chỉ có nghĩa khi cửa sổ hẹp (một cột) — CSS ẩn
                    nó ở cửa sổ rộng, nơi hai cột hiện cùng lúc. */}
                <button type="button" className="ct-tn-lui" onClick={() => datDangMo(null)} aria-label="Quay lại">
                  <ArrowLeft size={16} aria-hidden />
                </button>
                <Avatar p={cuocDangMo?.peer ?? null} nho />
                <strong>{cuocDangMo?.type === 'ADMIN' ? 'Hỗ trợ CuongThai' : ten(cuocDangMo?.peer)}</strong>
                {/* Không gọi được cho luồng HỖ TRỢ: bên kia là một vai trò,
                    không phải một người đang ngồi trước máy. */}
                {cuocDangMo?.type !== 'ADMIN' && cuocDangMo?.peer && (
                  <button
                    type="button"
                    className="ct-btn ct-btn-ghost ct-tn-goi"
                    onClick={() => datLanBamGoi((n) => n + 1)}
                    aria-label="Gọi thoại"
                    title="Gọi thoại"
                  >
                    <Phone size={15} aria-hidden />
                  </button>
                )}
              </header>

              <div className="ct-tn-cuon" ref={cuonRef}>
                {tin.length === 0 && (
                  <p className="ct-muted" style={{ fontSize: 13, textAlign: 'center', padding: 20 }}>
                    Chưa có tin nhắn. Gõ câu đầu tiên bên dưới.
                  </p>
                )}
                {tin.map((t) => {
                  const cuaToi = t.senderId === userId;
                  if (t.recalled || t.deleted) {
                    return (
                      <div key={t.id} className="ct-tn-tin" data-toi={cuaToi}>
                        <em className="ct-tn-thu-hoi">Tin nhắn đã được thu hồi</em>
                      </div>
                    );
                  }
                  return (
                    <div key={t.id} className="ct-tn-tin" data-toi={cuaToi} title={new Date(t.createdAt).toLocaleString('vi-VN')}>
                      <div className="ct-tn-bong">
                        {t.mediaUrl && <img src={t.mediaUrl} alt="" loading="lazy" />}
                        {t.content && <p>{t.content}</p>}
                      </div>
                      <span className="ct-tn-gio">{gioNgan(t.createdAt)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="ct-tn-soan">
                <input
                  value={nhap}
                  placeholder="Nhắn tin…"
                  maxLength={4000}
                  onChange={(e) => datNhap(e.target.value)}
                  onKeyDown={(e) => {
                    // Bộ gõ tiếng Việt dùng Enter để chốt chữ đang gõ.
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === 'Enter') { e.preventDefault(); void gui(); }
                  }}
                />
                <button type="button" className="ct-btn" onClick={() => void gui()} disabled={!nhap.trim() || dangGui}>
                  <Send size={14} aria-hidden />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
      <KhungGoi
        threadId={dangMo}
        peerId={cuocDangMo?.peer?.id ?? null}
        peerTen={ten(cuocDangMo?.peer)}
        lanBamGoi={lanBamGoi}
      />
    </div>
  );
}

function Avatar({ p, nho }: { p?: NguoiKia | null; nho?: boolean }) {
  if (p?.avatarUrl) return <img className="ct-tn-avt" data-nho={!!nho} src={p.avatarUrl} alt="" loading="lazy" />;
  const chu = ten(p).trim().charAt(0).toUpperCase() || '?';
  return <span className="ct-tn-avt" data-nho={!!nho} data-chu="true">{chu}</span>;
}
