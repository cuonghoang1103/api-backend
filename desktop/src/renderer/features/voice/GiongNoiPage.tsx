/**
 * Giọng nói — vlog / reaction / podcast / hướng dẫn, kèm bình luận và thích.
 *
 * Đối chiếu `src/routes/voiceHub.routes.ts` (mount `/api/v1/voice`):
 *   GET  /meta                  — danh sách loại và kiểu media
 *   GET  /series                — các series
 *   GET  /?page&size&type&q&series&featured
 *   GET  /posts/:slug?view=1    — chi tiết + bài liên quan, đếm lượt xem
 *   POST /posts/:id/like        — bật/tắt thích (cần đăng nhập)
 *   GET  /posts/:id/comments
 *   POST /posts/:id/comments    — { content, parentId? }
 *   POST /comments/:cid/like
 *
 * ⚠️ ĐO THẬT 20/08/2026: production đang có **0 bài và 0 series**. Trang này
 * vì thế sẽ trống khi mở lần đầu — đó KHÔNG phải lỗi. Trạng thái trống nói
 * thẳng ra điều đó thay vì quay vòng hay báo "không tải được", vì hai thứ ấy
 * làm người dùng đi tìm một sự cố không tồn tại.
 *
 * ─── Vì sao KHÔNG phát video ngay trong app ───
 * `mediaKind` có ba dạng: YOUTUBE, R2_VIDEO, AUDIO. YouTube chỉ nhúng được
 * bằng iframe, mà CSP của app đặt `frame-src 'none'` — cố nhúng thì khung
 * trắng, không lỗi nào hiện ra. Nới CSP cho YouTube là mở iframe cho cả app
 * chỉ vì một trang. Nên: video R2 và audio phát TẠI CHỖ (chúng là tệp media
 * thật, `media-src` đã cho phép), còn YouTube thì mở ra trình duyệt ngoài —
 * nói rõ trên nút để không ai bấm nhầm rồi ngơ ngác.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, CloudOff, ExternalLink, Eye, Heart, MessageCircle, Play,
  RefreshCw, Search, Send,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';

interface Nguoi {
  id?: number;
  username?: string;
  fullName?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

interface Series {
  id: number;
  title: string;
  slug: string;
  postCount?: number;
}

interface BaiTom {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  type: string;
  mediaKind: string;
  youtubeId?: string | null;
  thumbnailUrl?: string | null;
  durationSec?: number | null;
  tags?: string[];
  isPinned?: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  publishedAt?: string | null;
  series?: Series | null;
  author?: Nguoi | null;
}

interface BaiDay extends BaiTom {
  description?: string | null;
  descriptionHtml?: string | null;
  videoUrl?: string | null;
  audioUrl?: string | null;
  chapters?: Array<{ t: number; label: string }> | null;
  likedByMe?: boolean;
}

interface BinhLuan {
  id: number;
  content: string;
  createdAt: string;
  likeCount?: number;
  likedByMe?: boolean;
  user?: Nguoi | null;
  author?: Nguoi | null;
  replies?: BinhLuan[];
}

/** Nhãn tiếng Việt cho `type`. Backend trả mã, app hiện chữ người đọc được. */
const NHAN_LOAI: Record<string, string> = {
  VLOG: 'Vlog',
  REACTION: 'Reaction',
  CODE_EXP: 'Giải thích code',
  PODCAST: 'Podcast',
  TUTORIAL: 'Hướng dẫn',
};

const SIZE = 12;

function tenNguoi(n: Nguoi | null | undefined): string {
  return n?.displayName || n?.fullName || n?.username || 'Ẩn danh';
}

function phut(giay: number | null | undefined): string | null {
  if (!giay || giay <= 0) return null;
  const p = Math.floor(giay / 60);
  const s = Math.floor(giay % 60);
  return `${p}:${String(s).padStart(2, '0')}`;
}

function ngay(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('vi-VN');
}

/** Backend bọc danh sách trong `{ posts, pagination }`; chấp cả mảng trần. */
function docDanhSach(p: unknown): { posts: BaiTom[]; total: number } {
  if (Array.isArray(p)) return { posts: p as BaiTom[], total: p.length };
  const w = p as { posts?: unknown; pagination?: { total?: number } };
  return {
    posts: Array.isArray(w?.posts) ? (w.posts as BaiTom[]) : [],
    total: w?.pagination?.total ?? 0,
  };
}

export function GiongNoiPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [bai, setBai] = useState<BaiTom[]>([]);
  const [tong, setTong] = useState(0);
  const [trang, setTrang] = useState(1);
  const [loai, setLoai] = useState<string | null>(null);
  const [seriesChon, setSeriesChon] = useState<string | null>(null);
  const [tim, setTim] = useState('');
  const [timDaGui, setTimDaGui] = useState('');
  const [seriesDs, setSeriesDs] = useState<Series[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [cu, setCu] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [moSlug, setMoSlug] = useState<string | null>(null);

  const truyVan = useMemo(() => {
    const q = new URLSearchParams({ page: String(trang), size: String(SIZE) });
    if (loai) q.set('type', loai);
    if (seriesChon) q.set('series', seriesChon);
    if (timDaGui.trim()) q.set('q', timDaGui.trim());
    return q.toString();
  }, [trang, loai, seriesChon, timDaGui]);

  const napDanhSach = useCallback(async () => {
    if (userId === null || !api) return;
    setDangTai(true);
    setLoi(null);
    try {
      const kq = await swr<unknown>({
        userId,
        // Khoá cache mang cả bộ lọc: nếu không, lọc "Podcast" sẽ ghi đè bản
        // cache của "tất cả" và lần mở sau ngoại tuyến chỉ còn podcast.
        key: `voice:list:${truyVan}`,
        fetcher: () => api.request(`/api/v1/voice?${truyVan}`),
        online,
        ttlMs: 10 * 60 * 1000,
        onRefreshed: (moi) => {
          const d = docDanhSach(moi);
          setBai(d.posts);
          setTong(d.total);
          setCu(false);
        },
      });
      const d = docDanhSach(kq.value);
      setBai(d.posts);
      setTong(d.total);
      setCu(kq.isStale);
    } catch (e) {
      setLoi(
        e instanceof OfflineUnavailableError
          ? 'Chưa từng tải danh sách này về máy nên không xem được khi ngoại tuyến.'
          : e instanceof Error
            ? e.message
            : String(e),
      );
    } finally {
      setDangTai(false);
    }
  }, [api, userId, online, truyVan]);

  useEffect(() => { void napDanhSach(); }, [napDanhSach]);

  /* Series là dữ liệu phụ: hỏng thì ẩn hàng lọc đi, KHÔNG được làm hỏng trang.
     Đó là lý do nó có khối try riêng thay vì gộp vào lời gọi danh sách. */
  useEffect(() => {
    if (userId === null || !api) return;
    let huy = false;
    void swr<unknown>({
      userId,
      key: 'voice:series',
      fetcher: () => api.request('/api/v1/voice/series'),
      online,
      ttlMs: 60 * 60 * 1000,
      onRefreshed: (moi) => { if (!huy && Array.isArray(moi)) setSeriesDs(moi as Series[]); },
    })
      .then((kq) => { if (!huy && Array.isArray(kq.value)) setSeriesDs(kq.value as Series[]); })
      .catch(() => { /* không có series thì thôi, hàng lọc tự ẩn */ });
    return () => { huy = true; };
  }, [api, userId, online]);

  const doiLoc = (fn: () => void) => { fn(); setTrang(1); };

  if (moSlug) {
    return <ChiTietBai slug={moSlug} onQuayLai={() => setMoSlug(null)} onMoBai={setMoSlug} />;
  }

  const soTrang = Math.max(1, Math.ceil(tong / SIZE));

  return (
    <div className="ct-page ct-gn">
      <header className="ct-gn-dau">
        <div>
          <h1>Giọng nói</h1>
          <p className="ct-muted">Vlog, reaction, podcast và hướng dẫn — có bình luận và lượt thích.</p>
        </div>
        <div className="ct-gn-dau-nut">
          {cu && <span className="ct-gn-cu"><CloudOff size={13} aria-hidden /> bản đã lưu</span>}
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void napDanhSach()}>
            <RefreshCw size={14} aria-hidden /> Tải lại
          </button>
        </div>
      </header>

      <div className="ct-gn-loc">
        <form
          className="ct-music-search ct-gn-tim"
          onSubmit={(e) => { e.preventDefault(); doiLoc(() => setTimDaGui(tim)); }}
        >
          <Search size={14} aria-hidden />
          <input
            value={tim}
            onChange={(e) => setTim(e.target.value)}
            placeholder="Tìm theo tiêu đề, tóm tắt hoặc thẻ…"
            aria-label="Tìm bài"
          />
        </form>

        <div className="ct-gn-chip" role="group" aria-label="Lọc theo loại">
          <button type="button" data-active={loai === null} onClick={() => doiLoc(() => setLoai(null))}>
            Tất cả
          </button>
          {Object.entries(NHAN_LOAI).map(([ma, nhan]) => (
            <button
              key={ma}
              type="button"
              data-active={loai === ma}
              onClick={() => doiLoc(() => setLoai(loai === ma ? null : ma))}
            >
              {nhan}
            </button>
          ))}
        </div>

        {seriesDs.length > 0 && (
          <div className="ct-gn-chip" role="group" aria-label="Lọc theo series">
            {seriesDs.map((s) => (
              <button
                key={s.id}
                type="button"
                data-active={seriesChon === s.slug}
                onClick={() => doiLoc(() => setSeriesChon(seriesChon === s.slug ? null : s.slug))}
              >
                {s.title}
                {typeof s.postCount === 'number' && <span className="ct-mau-dem">{s.postCount}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {loi ? (
        <div className="ct-empty">
          <CloudOff size={26} aria-hidden className="ct-empty-icon" />
          <p>{loi}</p>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void napDanhSach()}>
            Thử lại
          </button>
        </div>
      ) : dangTai && bai.length === 0 ? (
        <p className="ct-muted">Đang tải…</p>
      ) : bai.length === 0 ? (
        <div className="ct-empty">
          <Play size={26} aria-hidden className="ct-empty-icon" />
          {/* Nói đúng cái đang xảy ra. Ba lý do khác nhau, ba câu khác nhau —
              gộp thành "không có dữ liệu" là bắt người dùng tự đoán. */}
          <p>
            {timDaGui || loai || seriesChon
              ? 'Không bài nào khớp bộ lọc đang chọn.'
              : 'Chưa có bài nào được đăng.'}
          </p>
          {(timDaGui || loai || seriesChon) && (
            <button
              type="button"
              className="ct-btn ct-btn-ghost"
              onClick={() => doiLoc(() => { setLoai(null); setSeriesChon(null); setTim(''); setTimDaGui(''); })}
            >
              Bỏ hết bộ lọc
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="ct-gn-luoi">
            {bai.map((b) => (
              <button key={b.id} type="button" className="ct-gn-the" onClick={() => setMoSlug(b.slug)}>
                <span className="ct-gn-anh">
                  {b.thumbnailUrl ? (
                    <img src={b.thumbnailUrl} alt="" loading="lazy" />
                  ) : (
                    <span className="ct-gn-anh-trong"><Play size={22} aria-hidden /></span>
                  )}
                  {phut(b.durationSec) && <span className="ct-gn-thoi">{phut(b.durationSec)}</span>}
                </span>
                <span className="ct-gn-the-than">
                  <span className="ct-gn-the-nhan">
                    <span className="ct-mau-tag">{NHAN_LOAI[b.type] ?? b.type}</span>
                    {b.series && <span className="ct-muted">{b.series.title}</span>}
                  </span>
                  <span className="ct-gn-the-ten">{b.title}</span>
                  {b.summary && <span className="ct-gn-the-tom">{b.summary}</span>}
                  <span className="ct-gn-the-so">
                    <span><Eye size={12} aria-hidden /> {b.viewCount ?? 0}</span>
                    <span><Heart size={12} aria-hidden /> {b.likeCount ?? 0}</span>
                    <span><MessageCircle size={12} aria-hidden /> {b.commentCount ?? 0}</span>
                    {b.publishedAt && <span className="ct-muted">{ngay(b.publishedAt)}</span>}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {soTrang > 1 && (
            <div className="ct-gn-trang">
              <button
                type="button"
                className="ct-btn ct-btn-ghost"
                disabled={trang <= 1}
                onClick={() => setTrang((t) => Math.max(1, t - 1))}
              >
                Trước
              </button>
              <span className="ct-muted">Trang {trang} / {soTrang}</span>
              <button
                type="button"
                className="ct-btn ct-btn-ghost"
                disabled={trang >= soTrang}
                onClick={() => setTrang((t) => t + 1)}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Chi tiết một bài ────────────────────────────────────────────────────── */

function ChiTietBai({
  slug,
  onQuayLai,
  onMoBai,
}: {
  slug: string;
  onQuayLai: () => void;
  onMoBai: (slug: string) => void;
}) {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [bai, setBai] = useState<BaiDay | null>(null);
  const [lienQuan, setLienQuan] = useState<BaiTom[]>([]);
  const [loi, setLoi] = useState<string | null>(null);
  const [binhLuan, setBinhLuan] = useState<BinhLuan[]>([]);
  const [soanBl, setSoanBl] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [loiBl, setLoiBl] = useState<string | null>(null);

  useEffect(() => {
    if (userId === null || !api) return;
    let huy = false;
    setBai(null);
    setLoi(null);
    void swr<{ post: BaiDay; related?: BaiTom[] }>({
      userId,
      key: `voice:post:${slug}`,
      // `view=1` để máy chủ đếm lượt xem — đúng như trang web làm.
      fetcher: () => api.request(`/api/v1/voice/posts/${encodeURIComponent(slug)}?view=1`),
      online,
      ttlMs: 10 * 60 * 1000,
      onRefreshed: (moi) => {
        if (huy) return;
        setBai(moi.post);
        setLienQuan(moi.related ?? []);
      },
    })
      .then((kq) => {
        if (huy) return;
        setBai(kq.value.post);
        setLienQuan(kq.value.related ?? []);
      })
      .catch((e: unknown) => {
        if (huy) return;
        setLoi(
          e instanceof OfflineUnavailableError
            ? 'Bài này chưa từng mở nên không đọc được khi ngoại tuyến.'
            : e instanceof Error
              ? e.message
              : String(e),
        );
      });
    return () => { huy = true; };
  }, [api, userId, online, slug]);

  const napBinhLuan = useCallback(async (postId: number) => {
    if (!api) return;
    try {
      const ds = await api.request<unknown>(`/api/v1/voice/posts/${postId}/comments`);
      setBinhLuan(Array.isArray(ds) ? (ds as BinhLuan[]) : []);
    } catch {
      /* Bình luận hỏng thì bài vẫn đọc được — không dựng lỗi che cả trang. */
    }
  }, [api]);

  useEffect(() => {
    if (bai?.id) void napBinhLuan(bai.id);
  }, [bai?.id, napBinhLuan]);

  const thich = async () => {
    if (!api || !bai) return;
    /* Cập nhật lạc quan rồi mới gọi. Máy chủ trả về `{ liked, likeCount }` nên
       khi nó về thì lấy số THẬT, không cộng trừ tay hai lần. */
    const truoc = { liked: bai.likedByMe ?? false, so: bai.likeCount ?? 0 };
    setBai({ ...bai, likedByMe: !truoc.liked, likeCount: truoc.so + (truoc.liked ? -1 : 1) });
    try {
      const kq = await api.request<{ liked?: boolean; likeCount?: number }>(
        `/api/v1/voice/posts/${bai.id}/like`,
        { method: 'POST' },
      );
      setBai((b) => (b ? { ...b, likedByMe: kq.liked ?? !truoc.liked, likeCount: kq.likeCount ?? b.likeCount ?? 0 } : b));
    } catch {
      setBai((b) => (b ? { ...b, likedByMe: truoc.liked, likeCount: truoc.so } : b));
    }
  };

  const guiBinhLuan = async () => {
    if (!api || !bai || !soanBl.trim() || dangGui) return;
    setDangGui(true);
    setLoiBl(null);
    try {
      await api.request(`/api/v1/voice/posts/${bai.id}/comments`, {
        method: 'POST',
        body: { content: soanBl.trim() },
      });
      setSoanBl('');
      await napBinhLuan(bai.id);
    } catch (e) {
      setLoiBl(e instanceof Error ? e.message : String(e));
    } finally {
      setDangGui(false);
    }
  };

  const moNgoai = (url: string) => void window.cuongthai?.app.openExternal(url);

  if (loi) {
    return (
      <div className="ct-page ct-gn">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
          <ArrowLeft size={14} aria-hidden /> Danh sách
        </button>
        <div className="ct-empty">
          <CloudOff size={26} aria-hidden className="ct-empty-icon" />
          <p>{loi}</p>
        </div>
      </div>
    );
  }

  if (!bai) {
    return (
      <div className="ct-page ct-gn">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
          <ArrowLeft size={14} aria-hidden /> Danh sách
        </button>
        <p className="ct-muted">Đang tải…</p>
      </div>
    );
  }

  return (
    <div className="ct-page ct-gn ct-gn-ct">
      <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
        <ArrowLeft size={14} aria-hidden /> Danh sách
      </button>

      <article>
        {/* Phần phát: R2 và audio phát tại chỗ; YouTube phải ra ngoài, xem
            ghi chú CSP ở đầu tệp. */}
        <div className="ct-gn-phat">
          {bai.mediaKind === 'R2_VIDEO' && bai.videoUrl ? (
            <video src={bai.videoUrl} controls poster={bai.thumbnailUrl ?? undefined} preload="metadata" />
          ) : bai.mediaKind === 'AUDIO' && bai.audioUrl ? (
            <div className="ct-gn-audio">
              {bai.thumbnailUrl && <img src={bai.thumbnailUrl} alt="" />}
              <audio src={bai.audioUrl} controls preload="metadata" />
            </div>
          ) : bai.youtubeId ? (
            <button
              type="button"
              className="ct-gn-yt"
              onClick={() => moNgoai(`https://www.youtube.com/watch?v=${bai.youtubeId}`)}
            >
              {bai.thumbnailUrl
                ? <img src={bai.thumbnailUrl} alt="" />
                : <img src={`https://i.ytimg.com/vi/${bai.youtubeId}/hqdefault.jpg`} alt="" />}
              <span className="ct-gn-yt-nut">
                <Play size={20} aria-hidden />
                Xem trên YouTube
              </span>
            </button>
          ) : (
            <div className="ct-gn-anh-trong ct-gn-phat-trong"><Play size={26} aria-hidden /></div>
          )}
        </div>

        <div className="ct-gn-ct-nhan">
          <span className="ct-mau-tag">{NHAN_LOAI[bai.type] ?? bai.type}</span>
          {bai.series && <span className="ct-muted">{bai.series.title}</span>}
          {bai.publishedAt && <span className="ct-muted">{ngay(bai.publishedAt)}</span>}
        </div>

        <h1 className="ct-gn-ct-ten">{bai.title}</h1>

        <div className="ct-gn-ct-thanh">
          <span className="ct-muted">{tenNguoi(bai.author)}</span>
          <span className="ct-muted"><Eye size={13} aria-hidden /> {bai.viewCount ?? 0}</span>
          <button
            type="button"
            className="ct-btn ct-btn-ghost"
            data-thich={bai.likedByMe ? 'true' : 'false'}
            onClick={() => void thich()}
          >
            <Heart size={14} aria-hidden fill={bai.likedByMe ? 'currentColor' : 'none'} />
            {bai.likeCount ?? 0}
          </button>
          {bai.youtubeId && (
            <button
              type="button"
              className="ct-btn ct-btn-ghost"
              onClick={() => moNgoai(`https://www.youtube.com/watch?v=${bai.youtubeId}`)}
            >
              <ExternalLink size={14} aria-hidden /> YouTube
            </button>
          )}
        </div>

        {bai.summary && <p className="ct-gn-ct-tom">{bai.summary}</p>}

        {(bai.tags ?? []).length > 0 && (
          <div className="ct-mau-tu">
            {bai.tags!.map((t) => <span key={t}>#{t}</span>)}
          </div>
        )}

        {/* Show-notes. Backend đã dựng sẵn HTML lúc ghi (`descriptionHtml`) và
            đã lọc ở đó; app chỉ hiện. Không có HTML thì hiện chữ thô — thà thô
            còn hơn tự dựng markdown ở đây rồi lệch với web. */}
        {bai.descriptionHtml ? (
          <div className="ct-gn-mota" dangerouslySetInnerHTML={{ __html: bai.descriptionHtml }} />
        ) : bai.description ? (
          <p className="ct-gn-mota" style={{ whiteSpace: 'pre-wrap' }}>{bai.description}</p>
        ) : null}

        {(bai.chapters ?? []).length > 0 && (
          <section className="ct-gn-chuong">
            <h2>Mốc thời gian</h2>
            <ul>
              {bai.chapters!.map((c) => (
                <li key={`${c.t}-${c.label}`}>
                  <span className="ct-gn-chuong-t">{phut(c.t) ?? '0:00'}</span> {c.label}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <section className="ct-gn-bl">
        <h2>Bình luận ({binhLuan.length})</h2>
        <div className="ct-gn-bl-soan">
          <textarea
            value={soanBl}
            onChange={(e) => setSoanBl(e.target.value)}
            placeholder="Viết bình luận…"
            rows={3}
            aria-label="Nội dung bình luận"
          />
          <button
            type="button"
            className="ct-btn"
            disabled={!soanBl.trim() || dangGui}
            onClick={() => void guiBinhLuan()}
          >
            <Send size={14} aria-hidden /> {dangGui ? 'Đang gửi…' : 'Gửi'}
          </button>
        </div>
        {loiBl && <p className="ct-gn-loi">{loiBl}</p>}

        {binhLuan.length === 0 ? (
          <p className="ct-muted">Chưa có bình luận nào.</p>
        ) : (
          <ul className="ct-gn-bl-ds">
            {binhLuan.map((c) => (
              <li key={c.id}>
                <p className="ct-gn-bl-dau">
                  <strong>{tenNguoi(c.user ?? c.author)}</strong>
                  <span className="ct-muted">{ngay(c.createdAt)}</span>
                </p>
                <p className="ct-gn-bl-chu">{c.content}</p>
                {(c.replies ?? []).length > 0 && (
                  <ul className="ct-gn-bl-ds ct-gn-bl-con">
                    {c.replies!.map((r) => (
                      <li key={r.id}>
                        <p className="ct-gn-bl-dau">
                          <strong>{tenNguoi(r.user ?? r.author)}</strong>
                          <span className="ct-muted">{ngay(r.createdAt)}</span>
                        </p>
                        <p className="ct-gn-bl-chu">{r.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {lienQuan.length > 0 && (
        <section className="ct-gn-lq">
          <h2>Bài liên quan</h2>
          <div className="ct-gn-lq-ds">
            {lienQuan.map((b) => (
              <button key={b.id} type="button" onClick={() => onMoBai(b.slug)}>
                {b.thumbnailUrl && <img src={b.thumbnailUrl} alt="" loading="lazy" />}
                <span>{b.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
