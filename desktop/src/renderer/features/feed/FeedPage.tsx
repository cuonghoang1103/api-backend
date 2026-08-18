/**
 * ============================================================
 * BẢNG TIN
 * ============================================================
 *
 * Đối chiếu `src/routes/social.routes.ts` (mount `/api/v1/feed`, src/index.ts:552):
 *   GET    /posts?limit=&cursor=   → { data: Post[], pagination: { nextCursor, hasNextPage } }
 *   POST   /posts                  → đăng bài
 *   POST   /posts/:id/like         · DELETE /posts/:id/like
 *   POST   /posts/:id/save         · DELETE /posts/:id/save
 *   GET    /posts/:id/comments     → { data: Comment[] }
 *   POST   /comments               → { postId, content }
 *
 * ─── PHÂN TRANG THEO CON TRỎ, KHÔNG PHẢI THEO TRANG ───
 * Dùng số trang thì mỗi bài mới đăng đẩy cả danh sách xuống một nấc, và người
 * đang cuộn sẽ thấy lại đúng bài vừa đọc ở đầu trang sau. Con trỏ neo vào bài
 * cuối nên không bao giờ trùng.
 *
 * ⚠️ CON TRỎ SUY TỪ BÀI CUỐI, không đọc `pagination` được.
 * `ApiClient.unwrap` trả về `envelope.data ?? envelope` (client.ts:191), nên
 * `request()` đưa lại THẲNG mảng bài — `pagination` là anh em của `data` trong
 * phong bì nên rơi mất trên đường. Đo thật: đọc `kq.data` ra `undefined` và
 * bảng tin hiện 0 bài dù máy chủ trả đủ. May là `nextCursor` của máy chủ chính
 * bằng id bài cuối, và "còn nữa" = lấy về đủ `limit`.
 *
 * ─── ẢNH/VIDEO PHẢI THEO TỈ LỆ THẬT ───
 * Mỗi media mang sẵn `width`/`height`. Ép mọi thứ vào một khung dọc cao là cách
 * làm ảnh ngang bị viền đen kín trên dưới — đã hỏng đúng vậy ở bản web
 * (02/07/2026). Khung dọc CHỈ dành cho media dọc.
 */
import { useCallback, useEffect, useState } from 'react';
import {
  Bookmark, CloudOff, Heart, ImageOff, MapPin, MessageCircle, RefreshCw, Send,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';

interface TacGia {
  id: number;
  username: string;
  fullName?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

interface Media {
  id: number;
  type: 'IMAGE' | 'VIDEO' | string;
  url: string;
  thumbnail?: string | null;
  width?: number | null;
  height?: number | null;
}

interface Bai {
  id: number;
  content?: string | null;
  createdAt: string;
  author: TacGia;
  media: Media[];
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  locationName?: string | null;
  youtubeUrl?: string | null;
  poll?: { question?: string; options?: Array<{ id: number; text: string; votesCount?: number }> } | null;
}

interface BinhLuan {
  id: number;
  content?: string | null;
  createdAt: string;
  author?: TacGia | null;
  user?: TacGia | null;
}

const MOI_TRANG = 12;

/**
 * Chuẩn hoá bài về đúng kiểu đã khai.
 *
 * ⚠️ Máy chủ trả `isLiked`/`isSaved` là SỐ 0/1, không phải boolean. Dùng thẳng
 * thì `data-bat={0}` render ra `data-bat="0"`, mà CSS bắt `[data-bat='true']`
 * — nên trái tim KHÔNG BAO GIỜ sáng dù đã thích. Mọi phép `!isLiked` vẫn chạy
 * đúng nên lỗi này không lộ ra ở đâu khác; chỉ có màu là sai, im lặng.
 */
function chuanHoa(b: Bai): Bai {
  return { ...b, isLiked: !!b.isLiked, isSaved: !!b.isSaved };
}

/** Tên hiển thị: ưu tiên tên người dùng tự đặt, cuối cùng mới tới username. */
function ten(t?: TacGia | null): string {
  return t?.displayName || t?.fullName || t?.username || 'Ẩn danh';
}

/**
 * "3 phút trước". Không dùng `Intl.RelativeTimeFormat` cho mọi mốc: quá một
 * tuần thì "2 tuần trước" mơ hồ hơn hẳn một ngày tháng cụ thể.
 */
function khiNao(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const giay = Math.floor((Date.now() - t) / 1000);
  if (giay < 60) return 'vừa xong';
  if (giay < 3600) return `${Math.floor(giay / 60)} phút trước`;
  if (giay < 86400) return `${Math.floor(giay / 3600)} giờ trước`;
  if (giay < 604800) return `${Math.floor(giay / 86400)} ngày trước`;
  const d = new Date(t);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export function FeedPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [bai, datBai] = useState<Bai[]>([]);
  const [conTro, datConTro] = useState<number | null>(null);
  const [conNua, datConNua] = useState(false);
  const [dangTai, datDangTai] = useState(true);
  const [dangThem, datDangThem] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [soan, datSoan] = useState('');
  const [dangDang, datDangDang] = useState(false);

  const nap = useCallback(async () => {
    if (userId === null || !api) return;
    datLoi(null);
    try {
      const nhan = (ds: Bai[]) => {
        datBai(ds.map(chuanHoa));
        datConTro(ds.length ? (ds[ds.length - 1]!.id) : null);
        datConNua(ds.length >= MOI_TRANG);
      };
      const kq = await swr<Bai[]>({
        userId,
        key: 'feed:posts',
        fetcher: () => api.request(`/api/v1/feed/posts?limit=${MOI_TRANG}`),
        online,
        ttlMs: 2 * 60_000,
        onRefreshed: (v) => nhan(v ?? []),
      });
      nhan(kq.value ?? []);
    } catch (e) {
      datLoi(e instanceof OfflineUnavailableError
        ? 'Chưa từng tải bảng tin nên không xem được khi ngoại tuyến.'
        : e instanceof Error ? e.message : String(e));
    } finally {
      datDangTai(false);
    }
  }, [api, userId, online]);

  useEffect(() => { void nap(); }, [nap]);

  const themTrang = async () => {
    if (!api || !conNua || conTro === null || dangThem) return;
    datDangThem(true);
    try {
      const ds = await api.request<Bai[]>(`/api/v1/feed/posts?limit=${MOI_TRANG}&cursor=${conTro}`) ?? [];
      // Lọc trùng theo id: máy chủ có thể trả lại một bài đã có nếu ai đó vừa
      // đăng bài mới ngay lúc cuộn, và React sẽ than key trùng.
      datBai((c) => {
        const daCo = new Set(c.map((b) => b.id));
        return [...c, ...ds.filter((b) => !daCo.has(b.id)).map(chuanHoa)];
      });
      datConTro(ds.length ? (ds[ds.length - 1]!.id) : null);
      datConNua(ds.length >= MOI_TRANG);
    } catch (e) {
      datLoi(e instanceof Error ? e.message : String(e));
    } finally {
      datDangThem(false);
    }
  };

  /** Thích / bỏ thích. Đổi giao diện TRƯỚC — chờ mạng mới đổi tim thì cảm giác như app đơ. */
  const thich = async (b: Bai) => {
    if (!api) return;
    const moi = !b.isLiked;
    datBai((c) => c.map((x) => (x.id === b.id
      ? { ...x, isLiked: moi, likesCount: Math.max(0, x.likesCount + (moi ? 1 : -1)) } : x)));
    try {
      await api.request(`/api/v1/feed/posts/${b.id}/like`, { method: moi ? 'POST' : 'DELETE' });
    } catch {
      datBai((c) => c.map((x) => (x.id === b.id
        ? { ...x, isLiked: !moi, likesCount: Math.max(0, x.likesCount + (moi ? -1 : 1)) } : x)));
    }
  };

  const luu = async (b: Bai) => {
    if (!api) return;
    const moi = !b.isSaved;
    datBai((c) => c.map((x) => (x.id === b.id ? { ...x, isSaved: moi } : x)));
    try {
      await api.request(`/api/v1/feed/posts/${b.id}/save`, { method: moi ? 'POST' : 'DELETE' });
    } catch {
      datBai((c) => c.map((x) => (x.id === b.id ? { ...x, isSaved: !moi } : x)));
    }
  };

  const dang = async () => {
    const chu = soan.trim();
    if (!chu || !api || dangDang) return;
    datDangDang(true);
    try {
      await api.request('/api/v1/feed/posts', {
        method: 'POST',
        // ⚠️ KHÔNG `JSON.stringify` — `api.request` tự tuần tự hoá `body`.
        // Đưa vào chuỗi đã stringify là mã hoá hai lần và máy chủ trả 400.
        body: { content: chu, visibility: 'PUBLIC' },
      });
      datSoan('');
      await nap();
    } catch (e) {
      datLoi(e instanceof Error ? e.message : String(e));
    } finally {
      datDangDang(false);
    }
  };

  return (
    <div className="ct-page ct-bt">
      <div className="ct-page-head" style={{ marginBottom: 14 }}>
        <div>
          <h1>Bảng tin</h1>
          <p className="ct-muted" style={{ margin: 0 }}>Bài mới từ cuongthai.com</p>
        </div>
        <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()} disabled={dangTai}>
          <RefreshCw size={14} aria-hidden className={dangTai ? 'ct-spin' : undefined} /> Làm mới
        </button>
      </div>

      {/* ── Soạn bài ── */}
      <div className="ct-bt-soan">
        <textarea
          value={soan}
          placeholder="Bạn đang nghĩ gì?"
          rows={soan ? 3 : 1}
          maxLength={5000}
          onChange={(e) => datSoan(e.target.value)}
        />
        <div className="ct-bt-soan-chan">
          {/* Đăng KÈM ẢNH chưa làm ở app — nói thẳng thay vì để một nút ảnh
              bấm vào không có gì xảy ra. */}
          <span className="ct-muted" style={{ fontSize: 11 }}>
            Đăng kèm ảnh/video thì mở trên web
          </span>
          <button type="button" className="ct-btn" onClick={() => void dang()} disabled={!soan.trim() || dangDang}>
            <Send size={14} aria-hidden /> Đăng
          </button>
        </div>
      </div>

      {loi && (
        <div className="ct-notice" data-tone="warn" style={{ marginBottom: 12 }}>
          <CloudOff size={15} aria-hidden />
          <span>{loi}</span>
        </div>
      )}

      {dangTai && bai.length === 0 && <p className="ct-muted">Đang tải bảng tin…</p>}

      {!dangTai && bai.length === 0 && !loi && (
        <div className="ct-empty">
          <ImageOff size={28} aria-hidden className="ct-empty-icon" />
          <p>Chưa có bài nào.</p>
        </div>
      )}

      <div className="ct-bt-ds">
        {bai.map((b) => (
          <BaiViet key={b.id} bai={b} onThich={() => void thich(b)} onLuu={() => void luu(b)} />
        ))}
      </div>

      {conNua && (
        <button type="button" className="ct-btn ct-btn-ghost ct-bt-them"
          onClick={() => void themTrang()} disabled={dangThem}>
          {dangThem ? 'Đang tải…' : 'Tải thêm bài'}
        </button>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════

function BaiViet({ bai, onThich, onLuu }: { bai: Bai; onThich: () => void; onLuu: () => void }) {
  const { api } = useSession();
  const [moBinhLuan, datMoBinhLuan] = useState(false);
  const [ds, datDs] = useState<BinhLuan[] | null>(null);
  const [nhap, datNhap] = useState('');
  const [dangGui, datDangGui] = useState(false);

  const napBinhLuan = useCallback(async () => {
    if (!api) return;
    try {
      const ds = await api.request<BinhLuan[]>(`/api/v1/feed/posts/${bai.id}/comments?limit=20`);
      datDs(ds ?? []);
    } catch { datDs([]); }
  }, [api, bai.id]);

  const bat = () => {
    const moi = !moBinhLuan;
    datMoBinhLuan(moi);
    // Chỉ tải khi người dùng THỰC SỰ mở. Tải sẵn bình luận của mọi bài là hàng
    // chục lời gọi cho thứ phần lớn không ai mở.
    if (moi && ds === null) void napBinhLuan();
  };

  const gui = async () => {
    const chu = nhap.trim();
    if (!chu || !api || dangGui) return;
    datDangGui(true);
    try {
      await api.request('/api/v1/feed/comments', { method: 'POST', body: { postId: bai.id, content: chu } });
      datNhap('');
      await napBinhLuan();
    } catch { /* giữ nguyên chữ đã gõ để người dùng thử lại */ }
    finally { datDangGui(false); }
  };

  return (
    <article className="ct-bt-bai">
      <header className="ct-bt-dau">
        <Avatar t={bai.author} />
        <div className="ct-bt-dau-chu">
          <strong>{ten(bai.author)}</strong>
          <span>
            {khiNao(bai.createdAt)}
            {bai.locationName && <> · <MapPin size={10} aria-hidden /> {bai.locationName}</>}
          </span>
        </div>
      </header>

      {bai.content && <p className="ct-bt-chu">{bai.content}</p>}

      {bai.media.length > 0 && <LuoiAnh media={bai.media} />}

      {bai.poll?.options?.length ? (
        <div className="ct-bt-poll">
          {bai.poll.question && <strong>{bai.poll.question}</strong>}
          {bai.poll.options.map((o) => (
            <div key={o.id} className="ct-bt-poll-muc">
              <span>{o.text}</span>
              <em>{o.votesCount ?? 0}</em>
            </div>
          ))}
          <span className="ct-muted" style={{ fontSize: 11 }}>Bình chọn thì mở trên web</span>
        </div>
      ) : null}

      <footer className="ct-bt-nut">
        <button type="button" onClick={onThich} data-bat={bai.isLiked} aria-label="Thích">
          <Heart size={15} aria-hidden fill={bai.isLiked ? 'currentColor' : 'none'} />
          {bai.likesCount > 0 && bai.likesCount}
        </button>
        <button type="button" onClick={bat} data-bat={moBinhLuan} aria-label="Bình luận">
          <MessageCircle size={15} aria-hidden />
          {bai.commentsCount > 0 && bai.commentsCount}
        </button>
        <button type="button" onClick={onLuu} data-bat={bai.isSaved} aria-label="Lưu" className="ct-bt-luu">
          <Bookmark size={15} aria-hidden fill={bai.isSaved ? 'currentColor' : 'none'} />
        </button>
      </footer>

      {moBinhLuan && (
        <div className="ct-bt-bl">
          {ds === null && <p className="ct-muted" style={{ fontSize: 12 }}>Đang tải bình luận…</p>}
          {ds?.length === 0 && <p className="ct-muted" style={{ fontSize: 12 }}>Chưa có bình luận nào.</p>}
          {ds?.map((c) => {
            const t = c.author ?? c.user ?? null;
            return (
              <div key={c.id} className="ct-bt-bl-muc">
                <Avatar t={t} nho />
                <div>
                  <strong>{ten(t)}</strong>
                  <p>{c.content}</p>
                  <span>{khiNao(c.createdAt)}</span>
                </div>
              </div>
            );
          })}
          <div className="ct-bt-bl-soan">
            <input
              value={nhap}
              placeholder="Viết bình luận…"
              maxLength={2000}
              onChange={(e) => datNhap(e.target.value)}
              onKeyDown={(e) => {
                // Bộ gõ tiếng Việt dùng Enter để chốt chữ đang gõ.
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter') { e.preventDefault(); void gui(); }
              }}
            />
            <button type="button" className="ct-btn" onClick={() => void gui()} disabled={!nhap.trim() || dangGui}>
              <Send size={13} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function Avatar({ t, nho }: { t?: TacGia | null; nho?: boolean }) {
  const chu = ten(t).trim().charAt(0).toUpperCase() || '?';
  if (t?.avatarUrl) {
    return <img className="ct-bt-avt" data-nho={!!nho} src={t.avatarUrl} alt="" loading="lazy" />;
  }
  return <span className="ct-bt-avt" data-nho={!!nho} data-chu="true">{chu}</span>;
}

/**
 * Lưới ảnh/video.
 *
 * ⚠️ TỈ LỆ THẬT, không ép khung. Bản web từng nhét mọi video vào một khung dọc
 * cố định `min(88vh, 880px)` kèm `object-contain`, nên video NGANG hiện ra với
 * hai vệt đen kín trên dưới (02/07/2026). Media đã mang sẵn `width`/`height` —
 * dùng đúng nó, và chỉ kẹp lại khi ảnh quá dài để một bài không chiếm cả màn.
 */
function LuoiAnh({ media }: { media: Media[] }) {
  if (media.length === 1) {
    const m = media[0]!;
    const w = m.width ?? 0;
    const h = m.height ?? 0;
    // Ảnh dọc quá khổ (truyện tranh, ảnh chụp màn hình dài) bị kẹp ở 4:5, phần
    // dư cắt bớt — thà thấy một phần đẹp còn hơn phải cuộn ba màn hình.
    const tiLe = w > 0 && h > 0 ? Math.max(w / h, 0.8) : 1.6;
    return (
      <div className="ct-bt-anh-mot" style={{ aspectRatio: String(tiLe) }}>
        <MotMedia m={m} />
      </div>
    );
  }
  return (
    <div className="ct-bt-luoi" data-so={Math.min(media.length, 4)}>
      {media.slice(0, 4).map((m, i) => (
        <div key={m.id} className="ct-bt-luoi-o">
          <MotMedia m={m} />
          {i === 3 && media.length > 4 && <span className="ct-bt-them-anh">+{media.length - 4}</span>}
        </div>
      ))}
    </div>
  );
}

function MotMedia({ m }: { m: Media }) {
  if (m.type === 'VIDEO') {
    return (
      <video
        src={m.url}
        poster={m.thumbnail ?? undefined}
        controls
        preload="none"
        playsInline
      />
    );
  }
  return <img src={m.url} alt="" loading="lazy" />;
}
